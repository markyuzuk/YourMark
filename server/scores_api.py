#!/usr/bin/env python3
"""Karate Chicken leaderboard — tiny stdlib JSON API.
GET  /scores -> {"top":[{n,s,m,c,d}, ...]}  (top 20)
POST /scores {"n":name,"s":score,"m":mode,"c":combo}
Lightweight anti-abuse: score clamp, name sanitize, 6 posts/min per IP.
Not cryptographically verified — client scores are spoofable; deterrent only.
"""
import json, time, threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

DB = Path('/var/www/karate-chicken-api/scores.json')
LOCK = threading.Lock()
RATE = {}
MAX_KEEP = 200

def load():
    try:
        return json.loads(DB.read_text())
    except Exception:
        return []

def save(rows):
    DB.write_text(json.dumps(rows))

class H(BaseHTTPRequestHandler):
    def _send(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *a):
        pass

    def do_GET(self):
        path = self.path.split('?')[0].rstrip('/') or '/'
        if path in ('/', '/scores'):
            cur = time.strftime('%G-W%V')
            rows = sorted(load(), key=lambda r: -r['s'])
            weekly = [r for r in rows if r.get('w', cur) == cur]
            self._send(200, {
                'top': weekly[:20],
                'champ': weekly[0] if weekly else None,
                'allBest': rows[:3]
            })
        else:
            self._send(404, {'err': 'not found'})

    def do_POST(self):
        path = self.path.split('?')[0].rstrip('/') or '/'
        if path not in ('/', '/scores'):
            self._send(404, {'err': 'not found'}); return
        try:
            n = int(self.headers.get('Content-Length', '0'))
            body = json.loads(self.rfile.read(min(n, 4096)) or b'{}')
        except Exception:
            self._send(400, {'err': 'bad json'}); return
        ip = self.headers.get('X-Forwarded-For', self.client_address[0]).split(',')[0].strip()
        now = time.time()
        RATE[ip] = [t for t in RATE.get(ip, []) if now - t < 60]
        if len(RATE[ip]) >= 6:
            self._send(429, {'err': 'slow down'}); return
        RATE[ip].append(now)
        name = ''.join(c for c in str(body.get('n', ''))[:12] if c.isalnum() or c in ' _-').strip() or 'anon'
        try:
            s = max(0, min(200000, int(body.get('s', 0))))
        except Exception:
            s = 0
        if s <= 0:
            self._send(400, {'err': 'score required'}); return
        mode = str(body.get('m', 'daily'))[:8]
        try:
            c = max(0, min(9999, int(body.get('c', 0))))
        except Exception:
            c = 0
        row = {'n': name, 's': s, 'm': mode, 'c': c, 'd': time.strftime('%Y-%m-%d'), 'w': time.strftime('%G-W%V')}
        with LOCK:
            rows = load()
            rows.append(row)
            rows.sort(key=lambda r: -r['s'])
            save(rows[:MAX_KEEP])
        self._send(201, {'ok': 1})

if __name__ == '__main__':
    DB.parent.mkdir(parents=True, exist_ok=True)
    ThreadingHTTPServer(('127.0.0.1', 8811), H).serve_forever()
