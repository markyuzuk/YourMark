/* Karate Chicken — vanilla JS, no build step.
 * World units: the canvas is drawn in a logical space W x H that keeps the
 * screen's aspect ratio. Gameplay distances (RING, REACH...) are fixed; spawn
 * distance and speed scale with W so reaction time is identical on every device. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const cv=$('game'),ctx=cv.getContext('2d');

// ---------- tuning ----------
const RING=78,PERF=15,REACH=132,HITBOX=28,DAILY_SECONDS=60;
const BELTS=[
  {n:'White',s:0,c:'#f4f4f4'},{n:'Yellow',s:1000,c:'#f5d23a'},{n:'Orange',s:2500,c:'#f08a24'},
  {n:'Green',s:5000,c:'#3fae4b'},{n:'Blue',s:8000,c:'#2f6fd6'},{n:'Brown',s:12000,c:'#7a4a24'},{n:'Black',s:18000,c:'#1a1a1a'}];
const beltFor=s=>{let b=BELTS[0];for(const x of BELTS)if(s>=x.s)b=x;return b;};

// ---------- responsive world ----------
let W=800,H=450,CX=400,GY=372,SPAWN_D=450,SPEEDK=1,HERO_H=210,HUDK=1;
function layout(){
  const r=cv.getBoundingClientRect();if(!r.width||!r.height)return;
  const aspect=r.width/r.height;
  let vw=aspect>=1.4?800:aspect>=1?700:560,vh=vw/aspect;
  if(vh<380){vh=380;vw=vh*aspect;}
  W=vw;H=vh;CX=W/2;
  const portrait=aspect<1;
  GY=H-(portrait?70:58);
  HERO_H=portrait?270:Math.min(210,GY-70);
  HUDK=portrait?1.25:1;
  SPAWN_D=W/2+50;SPEEDK=(SPAWN_D-RING)/(450-RING);
  const dpr=Math.min(window.devicePixelRatio||1,2);
  cv.width=Math.round(r.width*dpr);cv.height=Math.round(r.height*dpr);
}
window.addEventListener('resize',layout);
window.addEventListener('orientationchange',()=>setTimeout(layout,200));
if(window.ResizeObserver)new ResizeObserver(layout).observe(cv);
layout();

// ---------- storage / rng / feedback ----------
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
const today=new Date();
const seed=today.getFullYear()*10000+(today.getMonth()+1)*100+today.getDate();
const dayNo=Math.max(1,Math.round((new Date(today.getFullYear(),today.getMonth(),today.getDate())-new Date(2026,10,17))/864e5)+1);
let actx=null;
function initAudio(){try{if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)();if(actx.state==='suspended')actx.resume();}catch(e){actx=null}}
function beep(f,d,type='square',v=.06){if(!actx)return;try{const o=actx.createOscillator(),g=actx.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,actx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+d);o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+d);}catch(e){}}
let noiseBuf=null;
function noise(){if(!actx)return null;if(!noiseBuf){const b=actx.createBuffer(1,Math.floor(actx.sampleRate*.2),actx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;noiseBuf=b}return noiseBuf}
// power: 0 = whiff whoosh, 1 = good hit, 2 = perfect smash
function thwack(power){if(!actx)return;try{const t=actx.currentTime;
  const n=actx.createBufferSource();n.buffer=noise();
  const nf=actx.createBiquadFilter();nf.type=power?'bandpass':'highpass';
  nf.frequency.setValueAtTime(power===2?2200:power?1400:600,t);
  if(!power)nf.frequency.exponentialRampToValueAtTime(2400,t+.1);
  const ng=actx.createGain();ng.gain.setValueAtTime(power?(power===2?.5:.32):.11,t);
  ng.gain.exponentialRampToValueAtTime(.001,t+(power?.09:.15));
  n.connect(nf);nf.connect(ng);ng.connect(actx.destination);n.start(t);n.stop(t+.18);
  if(!power)return;
  const o=actx.createOscillator(),g=actx.createGain();
  o.type='sine';o.frequency.setValueAtTime(power===2?200:150,t);o.frequency.exponentialRampToValueAtTime(45,t+.11);
  g.gain.setValueAtTime(power===2?.6:.38,t);g.gain.exponentialRampToValueAtTime(.001,t+.14);
  o.connect(g);g.connect(actx.destination);o.start(t);o.stop(t+.15);
}catch(e){}}
function squawk(){if(!actx)return;try{const t=actx.currentTime;
  const o=actx.createOscillator(),g=actx.createGain(),l=actx.createOscillator(),lg=actx.createGain();
  o.type='sawtooth';o.frequency.setValueAtTime(520,t);o.frequency.exponentialRampToValueAtTime(230,t+.2);
  l.type='square';l.frequency.value=28;lg.gain.value=90;l.connect(lg);lg.connect(o.frequency);l.start(t);l.stop(t+.22);
  g.gain.setValueAtTime(.08,t);g.gain.exponentialRampToValueAtTime(.001,t+.22);
  o.connect(g);g.connect(actx.destination);o.start(t);o.stop(t+.22);
}catch(e){}}
function yum(){if(!('speechSynthesis' in window))return;try{const u=new SpeechSynthesisUtterance('yum');u.rate=.85;u.pitch=.75;u.volume=1;speechSynthesis.cancel();setTimeout(()=>{try{speechSynthesis.speak(u)}catch(e){}},40);}catch(e){}}
function buzz(ms){try{if(navigator.vibrate)navigator.vibrate(ms);}catch(e){}}
function updateBest(){const b=store.get('kc_best');$('bestLine').textContent=b?`Your best: ${(+b).toLocaleString()} (${beltFor(+b).n} Belt)`:'';}
updateBest();

const hero=new Image();hero.src='assets/karate-chicken.png';
const HERO_AR=684/1178;

// ---------- game state ----------
let G=null,state='menu',last=0;
function newGame(mode){
  G={mode,rand:mode==='daily'?mulberry32(seed):Math.random,t:0,score:0,combo:0,maxCombo:0,lives:3,ki:0,
     enemies:[],parts:[],texts:[],spawnT:.8,pose:0,poseT:0,stagger:0,shake:0,hitstop:0,flash:0,
     perfects:0,goods:0,misses:0,segs:Array.from({length:10},()=>({p:0,g:0,d:0,w:0})),
     dur:mode==='daily'?DAILY_SECONDS:Infinity};
}
const seg=()=>G.segs[Math.min(9,Math.floor(G.t/6))];

function spawn(){
  const r=G.rand;
  let side=r()<.5?-1:1;
  if(G.enemies.find(e=>e.side===side&&e.d>SPAWN_D-90))side=-side;
  let type='fox';const roll=r();
  if(G.t>25&&roll<.17)type='weasel';else if(G.t>14&&roll<.38)type='badger';
  const base=Math.min(560,235+G.t*3.6)*(type==='badger'?.85:type==='weasel'?1.05:1)*(.92+r()*.16);
  G.enemies.push({side,d:SPAWN_D,speed:base,type,hp:type==='badger'?2:1,
    flipAt:type==='weasel'?190+r()*80:0,flipped:false,jump:0,wob:r()*6,hurt:0});
  G.spawnT=Math.max(.36,1.05-G.t*.011)*(.75+r()*.5);
}
function addText(x,y,s,c,size=22){G.texts.push({x,y,s,c,size,life:.8});}
function burst(x,y,c,n=10,feather=false){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=80+Math.random()*220;G.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-120,life:.6+Math.random()*.5,c,feather});}}

function strike(side){
  if(state!=='play'||G.stagger>0)return;
  G.pose=side;G.poseT=.16;
  let best=null;
  for(const e of G.enemies){if(e.jump>0||e.side!==side||e.d>REACH)continue;if(!best||e.d<best.d)best=e;}
  if(!best){G.stagger=.26;G.combo=0;seg().w++;addText(CX+side*90,GY-140,'whiff','#7a6553',18);thwack(0);return;}
  const perfect=Math.abs(best.d-RING)<=PERF,mult=1+Math.floor(G.combo/10),ex=CX+side*best.d;
  if(perfect){G.score+=100*mult;G.ki=Math.min(100,G.ki+18);G.perfects++;seg().p++;G.hitstop=.05;addText(ex,GY-130,'PERFECT!','#d6342b',26);thwack(2);beep(880,.09,'triangle',.05);beep(1320,.07,'triangle',.035);buzz(18);}
  else{G.score+=50*mult;G.ki=Math.min(100,G.ki+6);G.goods++;seg().g++;addText(ex,GY-130,'good','#2f6fd6',20);thwack(1);buzz(8);}
  G.combo++;G.maxCombo=Math.max(G.maxCombo,G.combo);
  if(G.combo%5===0){yum();addText(CX,GY-HERO_H-45,'YUM!','#f2b632',24);}
  best.hp--;burst(ex,GY-40,best.type==='badger'?'#888':'#f08a24',8);
  if(best.hp<=0)best.dead=true;else{best.d+=150;best.hurt=.2;}
  G.enemies=G.enemies.filter(e=>!e.dead);
  G.shake=Math.max(G.shake,perfect?5:3);
}
function goldenEgg(){
  if(state!=='play'||G.ki<100)return;
  G.ki=0;G.flash=.5;G.shake=12;buzz([30,40,60]);
  for(const e of G.enemies)burst(CX+(e.jump>0?0:e.side*e.d),GY-50,'#f2b632',12);
  G.score+=G.enemies.length*75;G.enemies=[];
  addText(CX,GY-HERO_H-30,'GOLDEN EGG!','#f2b632',34);
  beep(523,.15,'triangle',.08);setTimeout(()=>beep(784,.2,'triangle',.08),90);setTimeout(()=>beep(1046,.3,'triangle',.08),180);
}
function hurt(){
  G.lives--;G.combo=0;seg().d++;G.misses++;G.shake=14;buzz(120);
  burst(CX,GY-80,'#ffffff',16,true);addText(CX,GY-HERO_H-10,'BAWK!','#d6342b',30);squawk();beep(110,.25,'sawtooth',.05);
  if(G.lives<=0)endGame(false);
}
function update(dt){
  if(G.hitstop>0){G.hitstop-=dt;return;}
  G.t+=dt;
  if(G.t>=G.dur){endGame(true);return;}
  G.stagger=Math.max(0,G.stagger-dt);G.poseT=Math.max(0,G.poseT-dt);if(G.poseT<=0)G.pose=0;
  G.shake=Math.max(0,G.shake-dt*40);G.flash=Math.max(0,G.flash-dt);
  G.spawnT-=dt;if(G.spawnT<=0)spawn();
  for(const e of G.enemies){
    e.wob+=dt*14;if(e.hurt)e.hurt=Math.max(0,e.hurt-dt);
    if(e.jump>0){e.jump-=dt/.55;if(e.jump<=0){e.jump=0;e.side=-e.side;}continue;}
    e.d-=e.speed*SPEEDK*dt;
    if(e.type==='weasel'&&!e.flipped&&e.d<=e.flipAt){e.flipped=true;e.jump=1;beep(990,.05,'square',.03);}
    if(e.d<=HITBOX){e.dead=true;hurt();if(state!=='play')return;}
  }
  G.enemies=G.enemies.filter(e=>!e.dead);
  tickFx(dt);
  $('padKi').disabled=G.ki<100;
}
function tickFx(dt){
  for(const p of G.parts){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.feather?120:600)*dt;if(p.feather)p.vx*=.97;}
  G.parts=G.parts.filter(p=>p.life>0);
  for(const t of G.texts){t.life-=dt;t.y-=40*dt;}
  G.texts=G.texts.filter(t=>t.life>0);
}

// ---------- drawing ----------
function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function drawBG(){
  const wallB=GY-40;
  ctx.fillStyle='#efe3c8';ctx.fillRect(0,0,W,GY);
  ctx.strokeStyle='#8a5a33';ctx.lineWidth=3;
  for(let x=CX%100;x<=W;x+=100){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,wallB);ctx.stroke();}
  ctx.lineWidth=1.5;ctx.strokeStyle='rgba(138,90,51,.5)';
  for(let x=CX%50;x<W;x+=50){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,wallB);ctx.stroke();}
  for(let y=wallB-60;y>0;y-=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.fillStyle='#6b4224';ctx.fillRect(0,wallB-4,W,10);
  const sy=Math.max(110,wallB-330);
  const so=Math.min(250,W/2-56);
  for(const [sx,a,b] of[[CX-so,'空','手'],[CX+so,'鶏','道']]){
    ctx.fillStyle='#f9f3e3';rr(sx-38,sy,76,150,4);ctx.fill();ctx.strokeStyle='#6b4224';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='#6b4224';ctx.fillRect(sx-44,sy-4,88,7);ctx.fillRect(sx-44,sy+146,88,7);
    ctx.fillStyle='#2a1d14';ctx.font='bold 46px serif';ctx.textAlign='center';ctx.fillText(a,sx,sy+69);ctx.fillText(b,sx,sy+124);
  }
  const g=ctx.createLinearGradient(0,GY-34,0,H);g.addColorStop(0,'#c58a55');g.addColorStop(1,'#8d5a31');
  ctx.fillStyle=g;ctx.fillRect(0,GY-34,W,H-GY+34);
  ctx.strokeStyle='rgba(60,30,10,.25)';ctx.lineWidth=1;
  for(let x=CX-700;x<W+700;x+=70){ctx.beginPath();ctx.moveTo(x,GY-34);ctx.lineTo(CX+(x-CX)*1.8,H);ctx.stroke();}
  for(const s of[-1,1]){
    ctx.strokeStyle='rgba(242,182,50,.95)';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(CX+s*RING,GY+6,PERF+12,7,0,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(CX+s*(REACH-10),GY+6,10,4,0,0,Math.PI*2);ctx.stroke();
  }
}
function drawChicken(){
  const pose=G?G.pose:0,st=G&&G.stagger>0,now=performance.now();
  const bob=Math.sin(now/180)*2,HH=HERO_H,HW=HH*HERO_AR,baseY=GY-26,hip=baseY-4;
  const x=CX+(st?Math.sin(now/30)*4:0)+pose*10;
  ctx.save();
  ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(CX,GY+4,50,9,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#ef9325';ctx.lineWidth=7;ctx.lineCap='round';
  if(pose){
    ctx.beginPath();ctx.moveTo(x-pose*12,hip);ctx.lineTo(x-pose*18,GY);ctx.stroke();
    ctx.beginPath();ctx.moveTo(x+pose*12,hip);ctx.lineTo(x+pose*80,hip-26);ctx.stroke();
    ctx.lineWidth=4;for(const a of[-.6,0,.6]){ctx.beginPath();ctx.moveTo(x+pose*80,hip-26);ctx.lineTo(x+pose*(80+13*Math.cos(a)),hip-26+13*Math.sin(a));ctx.stroke();}
    ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=3;
    for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x+pose*(46+i*10),hip-44+i*12);ctx.lineTo(x+pose*(74+i*12),hip-44+i*12);ctx.stroke();}
  }else{
    ctx.beginPath();ctx.moveTo(x-14,hip);ctx.lineTo(x-18,GY);ctx.stroke();
    ctx.beginPath();ctx.moveTo(x+14,hip);ctx.lineTo(x+18,GY);ctx.stroke();
    ctx.lineWidth=4;for(const sx of[-1,1]){const fx=x+sx*18;ctx.beginPath();ctx.moveTo(fx,GY);ctx.lineTo(fx-9,GY+3);ctx.moveTo(fx,GY);ctx.lineTo(fx+9,GY+3);ctx.stroke();}
  }
  ctx.translate(x,baseY+bob);
  ctx.rotate(pose*.16+(st?Math.sin(now/40)*.05:0));
  if(hero.complete&&hero.naturalWidth)ctx.drawImage(hero,-HW/2,-HH,HW,HH);
  ctx.restore();
  if(pose){ctx.font='bold 20px Bungee, Impact, sans-serif';ctx.textAlign='center';ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.fillStyle='#2a1d14';
    ctx.strokeText('HI-YAH!',CX+pose*120,GY-HH+10);ctx.fillText('HI-YAH!',CX+pose*120,GY-HH+10);}
}
function drawEnemy(e){
  let x,y=GY-22,flip=-e.side;
  if(e.jump>0){const p=1-e.jump;x=CX+e.side*e.d*(1-2*p);y-=Math.sin(Math.PI*p)*(HERO_H*.85);flip=-e.side*(p<.5?1:-1);}
  else x=CX+e.side*e.d;
  const bounce=e.jump>0?0:Math.abs(Math.sin(e.wob))*-6;
  ctx.save();ctx.translate(x,y+bounce);ctx.scale(flip,1);
  if(e.hurt>0)ctx.globalAlpha=.5+.5*Math.sin(performance.now()/25);
  ctx.fillStyle='rgba(0,0,0,.18)';ctx.beginPath();ctx.ellipse(0,26-bounce,30,6,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#2a1d14';ctx.lineWidth=2.5;
  let body,belly,s=1;
  if(e.type==='fox'){body='#e57a2a';belly='#fff4e6';}
  else if(e.type==='badger'){body='#6d6d72';belly='#eee';s=1.25;}
  else{body='#8a5a8f';belly='#f0dff2';s=.9;}
  ctx.scale(s,s);
  ctx.fillStyle=body;ctx.beginPath();ctx.moveTo(-22,0);ctx.quadraticCurveTo(-56,-10,-50,-30);ctx.quadraticCurveTo(-36,-10,-18,-8);ctx.fill();ctx.stroke();
  if(e.type==='fox'){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-50,-28,6,0,Math.PI*2);ctx.fill();}
  ctx.lineWidth=5;const l=Math.sin(e.wob)*6;
  ctx.beginPath();ctx.moveTo(-10,10);ctx.lineTo(-10-l,26);ctx.moveTo(12,10);ctx.lineTo(12+l,26);ctx.stroke();
  ctx.lineWidth=2.5;
  ctx.fillStyle=body;ctx.beginPath();ctx.ellipse(0,0,28,18,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle=belly;ctx.beginPath();ctx.ellipse(6,6,14,9,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=body;ctx.beginPath();ctx.moveTo(18,-20);ctx.lineTo(24,-42);ctx.lineTo(32,-24);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(32,-22);ctx.lineTo(42,-40);ctx.lineTo(44,-20);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.ellipse(32,-12,16,14,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(42,-16);ctx.lineTo(58,-8);ctx.lineTo(42,-2);ctx.closePath();ctx.fill();ctx.stroke();
  if(e.type==='badger'){ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(36,-18,12,3,-.2,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='#2a1d14';ctx.beginPath();ctx.arc(57,-8,3,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(38,-14,2.6,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.moveTo(32,-22);ctx.lineTo(44,-18);ctx.stroke();
  if(e.type==='badger'&&e.hp>1){ctx.fillStyle='#b88a3a';rr(-18,-24,30,10,3);ctx.fill();ctx.stroke();}
  ctx.restore();
  if(e.type==='weasel'&&!e.flipped&&e.d<e.flipAt+110&&e.jump<=0){
    ctx.fillStyle='#d6342b';ctx.font='bold 32px Bungee, Impact, sans-serif';ctx.textAlign='center';
    ctx.fillText('!',x,y-50+Math.sin(performance.now()/60)*3);
  }
  if(e.type==='badger'){ctx.fillStyle='#2a1d14';ctx.font='bold 12px Inter, sans-serif';ctx.textAlign='center';ctx.fillText('♥'.repeat(e.hp),x,y-58);}
}
function drawHUD(){
  const k=HUDK;
  ctx.save();
  ctx.textAlign='left';ctx.fillStyle='#2a1d14';ctx.font=`bold ${26*k}px Bungee, Impact, sans-serif`;
  ctx.fillText(G.score.toLocaleString(),16,36*k);
  const b=beltFor(G.score);ctx.font=`600 ${13*k}px Inter, sans-serif`;ctx.fillText(b.n+' Belt',16,56*k);
  ctx.fillStyle=b.c;ctx.strokeStyle='#2a1d14';ctx.lineWidth=1.5;rr(16,62*k,60*k,7*k,3);ctx.fill();ctx.stroke();
  if(G.combo>1){ctx.fillStyle='#d6342b';ctx.font=`bold ${18*k}px Bungee, Impact, sans-serif`;ctx.fillText(`${G.combo} combo x${1+Math.floor(G.combo/10)}`,16,94*k);}
  ctx.textAlign='right';ctx.font=`${24*k}px serif`;ctx.fillStyle='#2a1d14';
  ctx.fillText('🪶'.repeat(Math.max(0,G.lives))+' ·'.repeat(3-Math.max(0,G.lives)),W-14,34*k);
  ctx.font=`600 ${14*k}px Inter, sans-serif`;
  ctx.fillText(G.mode==='daily'?`Kata #${dayNo} · ${Math.max(0,Math.ceil(G.dur-G.t))}s`:`Endless · ${Math.floor(G.t)}s`,W-14,56*k);
  const kw=150*k,kx=W-14-kw,ky=64*k;
  ctx.fillStyle='rgba(42,29,20,.25)';rr(kx,ky,kw,11*k,5);ctx.fill();
  ctx.fillStyle=G.ki>=100?`hsl(${(performance.now()/5)%360},90%,55%)`:'#f2b632';rr(kx,ky,Math.max(10,kw*G.ki/100),11*k,5);ctx.fill();
  ctx.fillStyle='#2a1d14';ctx.font=`600 ${11*k}px Inter, sans-serif`;ctx.fillText(G.ki>=100?'GOLDEN EGG READY!':'KI',W-14,ky+26*k);
  ctx.restore();
}
function draw(){
  ctx.setTransform(cv.width/W,0,0,cv.height/H,0,0);
  ctx.save();
  if(G&&G.shake>0)ctx.translate((Math.random()-.5)*G.shake,(Math.random()-.5)*G.shake);
  drawBG();
  if(G)for(const e of G.enemies)drawEnemy(e);
  drawChicken();
  if(G){
    for(const p of G.parts){ctx.globalAlpha=Math.min(1,p.life*2);ctx.fillStyle=p.c;
      if(p.feather){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.life*6);ctx.beginPath();ctx.ellipse(0,0,8,3,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#aaa';ctx.lineWidth=1;ctx.stroke();ctx.restore();}
      else{ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fill();}}
    ctx.globalAlpha=1;
    for(const t of G.texts){ctx.globalAlpha=Math.min(1,t.life*2);ctx.fillStyle=t.c;ctx.font=`bold ${t.size}px Bungee, Impact, sans-serif`;ctx.textAlign='center';ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.strokeText(t.s,t.x,t.y);ctx.fillText(t.s,t.x,t.y);}
    ctx.globalAlpha=1;
  }
  ctx.restore();
  if(G&&(state==='play'||state==='paused'))drawHUD();
  if(G&&state==='play'&&G.t<5){
    ctx.globalAlpha=Math.min(1,(5-G.t)*1.2);ctx.fillStyle='rgba(42,29,20,.75)';
    ctx.font=`bold ${20*HUDK}px Bungee, Impact, sans-serif`;ctx.textAlign='center';
    ctx.fillText('◀ TAP LEFT',W*.22,GY-HERO_H*.55);ctx.fillText('TAP RIGHT ▶',W*.78,GY-HERO_H*.55);ctx.globalAlpha=1;
  }
  if(G&&G.flash>0){ctx.fillStyle=`rgba(255,230,120,${G.flash})`;ctx.fillRect(0,0,W,H);}
}
function loop(ts){
  const dt=Math.min(.05,(ts-last)/1000||0);last=ts;
  if(state==='play')update(dt);
  else if(G&&state==='over'){tickFx(dt);G.shake=Math.max(0,G.shake-dt*40);}
  draw();requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ---------- flow ----------
function show(id){for(const o of['menu','paused','over'])$(o).classList.toggle('hidden',o!==id);}
function setPlaying(on){document.body.classList.toggle('playing',on);}
function start(mode){initAudio();newGame(mode);state='play';show(null);setPlaying(true);$('copyMsg').textContent='';layout();}
function pause(){if(state!=='play')return;state='paused';show('paused');}
function resume(){if(state!=='paused')return;initAudio();state='play';show(null);last=performance.now();}
function toMenu(){state='menu';G=null;show('menu');setPlaying(false);$('padKi').disabled=true;}
function endGame(survived){
  if(state!=='play')return;state='over';setPlaying(false);
  const b=beltFor(G.score),best=+(store.get('kc_best')||0);
  if(G.score>best)store.set('kc_best',G.score);
  $('overTitle').textContent=survived?'Kata Complete!':'Feathers Ruffled!';
  const tot=G.perfects+G.goods+G.misses,acc=tot?Math.round(100*G.perfects/tot):0;
  $('overStats').innerHTML=`<b>${G.score.toLocaleString()}</b> pts · <b>${b.n} Belt</b><br>Perfect rate ${acc}% · best combo ${G.maxCombo}${G.score>best?' · <b>new best!</b>':''}`;
  const n=G.mode==='daily'?10:Math.min(10,Math.max(1,Math.ceil(G.t/6)));
  const grid=G.segs.slice(0,n).map((s,i)=>i*6>=G.t?'⬛':s.d?'🟥':(s.g+s.w>s.p?'🟨':'🟩')).join('');
  const head=G.mode==='daily'?`🐔🥋 Karate Chicken #${dayNo}`:`🐔🥋 Karate Chicken · Endless ${Math.floor(G.t)}s`;
  $('shareText').textContent=`${head}\n${b.n} Belt · ${G.score.toLocaleString()} pts\n${grid}\nbest combo ${G.maxCombo}`;
  $('padKi').disabled=true;updateBest();
  setTimeout(()=>{if(state==='over')show('over');},survived?200:700);
}
async function share(){
  const text=$('shareText').textContent+'\n'+location.href.split('#')[0];
  try{if(navigator.share){await navigator.share({text});return;}}catch(e){if(e&&e.name==='AbortError')return;}
  try{await navigator.clipboard.writeText(text);$('copyMsg').textContent='Copied. Paste it in your group chat!';}
  catch(e){const r=document.createRange();r.selectNodeContents($('shareText'));const s=getSelection();s.removeAllRanges();s.addRange(r);$('copyMsg').textContent='Selected: copy it to share.';}
}

// ---------- input ----------
let lastMode='daily';
$('btnDaily').onclick=()=>start(lastMode='daily');
$('btnEndless').onclick=()=>start(lastMode='endless');
$('btnAgain').onclick=()=>start(lastMode);
$('btnMenu').onclick=toMenu;
$('btnShare').onclick=share;
$('btnPause').onclick=pause;
$('btnResume').onclick=resume;
$('btnQuit').onclick=toMenu;
function bindPad(id,fn){const el=$(id);el.addEventListener('pointerdown',e=>{e.preventDefault();fn();el.classList.add('hit');setTimeout(()=>el.classList.remove('hit'),90);});}
bindPad('padL',()=>strike(-1));
bindPad('padR',()=>strike(1));
bindPad('padKi',goldenEgg);
cv.addEventListener('pointerdown',e=>{if(state!=='play')return;e.preventDefault();const r=cv.getBoundingClientRect();strike(e.clientX-r.left<r.width/2?-1:1);});
window.addEventListener('keydown',e=>{
  if(state==='play'){
    if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A'){strike(-1);e.preventDefault();}
    else if(e.key==='ArrowRight'||e.key==='d'||e.key==='D'){strike(1);e.preventDefault();}
    else if(e.key===' '){goldenEgg();e.preventDefault();}
    else if(e.key==='Escape'||e.key==='p')pause();
  }else if(state==='paused'&&(e.key==='Escape'||e.key==='p'||e.key===' '))resume();
  else if(e.key==='Enter'&&state==='menu')start('daily');
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
window.addEventListener('blur',pause);
document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('gesturestart',e=>e.preventDefault()); // iOS pinch

// ---------- offline / install ----------
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
  window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
})();
