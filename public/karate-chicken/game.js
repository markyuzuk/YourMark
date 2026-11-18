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
// ---------- challenge link: ?vs=NAME-SCORE ----------
const vs=(()=>{const m=new URLSearchParams(location.search).get('vs');if(!m)return null;
  const i=m.lastIndexOf('-'),s=+m.slice(i+1);
  return{name:(m.slice(0,i)||'RIVAL').toUpperCase().slice(0,12)||'RIVAL',score:isFinite(s)?s:0};})();
if(vs)$('vsTag').textContent=`⚔️ ${vs.name} dares you: beat ${vs.score.toLocaleString()}`;
// ---------- install prompt ----------
let deferredInstall=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;$('btnInstall').style.display='block';});
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
const standalone=matchMedia('(display-mode: fullscreen)').matches||matchMedia('(display-mode: standalone)').matches||navigator.standalone;
if(isIOS&&!standalone)$('btnInstall').style.display='block';
// ---------- streaks ----------
function bumpStreak(mode){
  if(mode!=='daily')return 0;
  const dstr=today.toISOString().slice(0,10);let st;
  try{st=JSON.parse(store.get('kc_streak')||'null')}catch(e){st=null}
  if(!st||st.d!==dstr){
    const yest=new Date(today.getTime()-864e5).toISOString().slice(0,10);
    st={n:(st&&st.d===yest)?st.n+1:1,d:dstr};store.set('kc_streak',JSON.stringify(st));
  }
  return st.n;
}
function curStreak(){try{const st=JSON.parse(store.get('kc_streak')||'null');return st&&st.d===today.toISOString().slice(0,10)?st.n:0}catch(e){return 0}}
async function champLine(){try{const j=await(await fetch('/karate-chicken/api/scores')).json();const c=j.champ;$('champLine').textContent=(c?`👑 Dojo Champ: ${c.n} — ${(+c.s).toLocaleString()} pts this week`:'')+(j.played?` · ${j.played} visits today`:'');}catch(e){}}
champLine();
resolveSfx('welcome').then(()=>{if(audioSrcs['welcome'])$('storyBtn').style.display='block'});
// ---------- mute ----------
let MUTED=store.get('kc_muted')==='1';
function setMute(on){MUTED=on;store.set('kc_muted',on?'1':'0');$('btnMute').textContent=on?'🔇':'🔊';if(on&&'speechSynthesis'in window)speechSynthesis.cancel();}
// ---------- seasonal hats: pilgrim Nov, santa Dec; 🎩 button cycles auto/on/off ----------
function hatType(){
  const h=store.get('kc_hat')||'auto',m=today.getMonth();
  if(h==='off')return null;
  if(m===10)return 'pilgrim';
  if(m===11)return 'santa';
  return h==='on'?'santa':null;
}
const HAT_EMO={auto:'🎩',on:'🎅',off:'🐔'};
function setHatMode(m){store.set('kc_hat',m);$('btnHat').textContent=HAT_EMO[m];}
// ---------- achievements ----------
const ACH=[
  ['first','First Blood',G=>G.perfects+G.goods>=1,'land your first hit','🩸'],
  ['p10','Sharpshooter',G=>G.perfects>=10,'10 perfects in one run','🎯'],
  ['flaw','Flawless Kata',(G,sv)=>sv&&G.misses===0,'finish Daily Kata untouched','🛡️'],
  ['c20','Chain Master',G=>G.maxCombo>=20,'reach a 20-hit combo','⛓️'],
  ['egg','Egg-splosion',G=>G.eggUsed,'unleash the Golden Egg','🥚'],
  ['jack','Jackpot!',G=>G.jackpots>0,'defeat a golden fox','🦊'],
  ['streak','Dedicated',()=>curStreak()>=5,'play 5 days in a row','🔥']];
// ---------- day-of-week modifiers ----------
const MODS=[
  {n:'Lazy Sunday',sp:.92},
  {n:'Fox Frenzy',sp:1.05,fox:1},
  {n:'Iron Tuesday',bad:.28},
  {n:'Weasel Wednesday',wea:.34},
  {n:'Ki Thursday',ki:1.6},
  {n:'Fox Friday',sp:1.15},
  {n:'Golden Saturday',gold:.13}];
const MOD=MODS[today.getDay()],KIK=MOD.ki||1;
$('modLine').textContent='📅 '+MOD.n;
function showAch(){
  let got;try{got=new Set(JSON.parse(store.get('kc_ach')||'[]'))}catch(e){got=new Set()}
  $('achList').innerHTML=ACH.map(a=>`<li class="ach${got.has(a[0])?' got':''}"><span class="ic">${got.has(a[0])?a[4]:'🔒'}</span><b>${a[1]}</b><small>${a[3]}</small></li>`).join('');
  show('achView');
}
function checkAch(sv){let got;try{got=JSON.parse(store.get('kc_ach')||'[]')}catch(e){got=[]}
  const fresh=ACH.filter(a=>!got.includes(a[0])&&a[2](G,sv));
  for(const a of fresh)got.push(a[0]);
  if(fresh.length)store.set('kc_ach',JSON.stringify(got));
  return{got,fresh};}
function achCount(){try{return JSON.parse(store.get('kc_ach')||'[]').length}catch(e){return 0}}
let actx=null;
function initAudio(){try{if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)();if(actx.state==='suspended')actx.resume();}catch(e){actx=null}}
function beep(f,d,type='square',v=.06){if(!actx||MUTED)return;try{const o=actx.createOscillator(),g=actx.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,actx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+d);o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+d);}catch(e){}}
let noiseBuf=null;
function noise(){if(!actx)return null;if(!noiseBuf){const b=actx.createBuffer(1,Math.floor(actx.sampleRate*.2),actx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;noiseBuf=b}return noiseBuf}
// power: 0 = whiff whoosh, 1 = good hit, 2 = perfect smash
function thwack(power){if(!actx||MUTED)return;try{const t=actx.currentTime;
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
function squawk(){if(!actx||MUTED)return;try{const t=actx.currentTime;
  const o=actx.createOscillator(),g=actx.createGain(),l=actx.createOscillator(),lg=actx.createGain();
  o.type='sawtooth';o.frequency.setValueAtTime(520,t);o.frequency.exponentialRampToValueAtTime(230,t+.2);
  l.type='square';l.frequency.value=28;lg.gain.value=90;l.connect(lg);lg.connect(o.frequency);l.start(t);l.stop(t+.22);
  g.gain.setValueAtTime(.08,t);g.gain.exponentialRampToValueAtTime(.001,t+.22);
  o.connect(g);g.connect(actx.destination);o.start(t);o.stop(t+.22);
}catch(e){}}
// ---------- custom sounds: drop e.g. assets/kick.m4a to replace a synth sfx ----------
const SFX_EXTS=['.m4a','.mp3','.wav','.webm','.ogg'];
const audioSrcs={}; // name -> url | null | undefined(probing)
async function resolveSfx(name){
  for(const ext of SFX_EXTS){
    try{const r=await fetch('assets/'+name+ext,{method:'HEAD'});
      // SPA fallback serves index.html (200) for missing files — only accept real media types
      if(r.ok&&/(audio|video|octet-stream)/i.test(r.headers.get('content-type')||'')){audioSrcs[name]='assets/'+name+ext;return}
    }catch(e){}
  }
  audioSrcs[name]=null;
}
function sfx(name,fallback){
  if(MUTED)return;
  if(!(name in audioSrcs)){audioSrcs[name]=undefined;resolveSfx(name);fallback();return;}
  if(!audioSrcs[name]){fallback();return;}
  try{const a=new Audio(audioSrcs[name]);if(G&&G.slow>0)a.playbackRate=.55;const p=a.play();if(p&&p.catch)p.catch(()=>fallback());}catch(e){fallback();}
}
function eggSound(){beep(523,.15,'triangle',.08);setTimeout(()=>beep(784,.2,'triangle',.08),90);setTimeout(()=>beep(1046,.3,'triangle',.08),180);}
function buzz(ms){try{if(navigator.vibrate)navigator.vibrate(ms);}catch(e){}}
function updateBest(){const b=store.get('kc_best'),st=curStreak(),ac=achCount();$('bestLine').textContent=(b?`Your best: ${(+b).toLocaleString()} (${beltFor(+b).n} Belt)`:'')+(st>1?` · 🔥 ${st}-day streak`:'')+(ac?` · 🏅 ${ac}/${ACH.length}`:'');$('btnAch').textContent=`🏅 BADGES (${ac}/${ACH.length})`;}
updateBest();
$('saveName').value=store.get('kc_name')||'';

const hero=new Image();hero.src='assets/karate-chicken.png';
const HERO_AR=684/1178;
let selfieImg=null;
function loadSelfie(){
  const d=store.get('kc_selfie');selfieImg=null;
  if(d){const i=new Image();i.onload=()=>{selfieImg=i};i.src=d;}
  updateSelfieBtn();
}
function updateSelfieBtn(){const b=$('btnSelfie');if(b)b.textContent=store.get('kc_selfie')?'📸 YOUR FACE IS READY':'📸 BECOME THE CHICKEN';}
// ---------- camera ----------
let camStream=null;
async function openCam(){
  try{
    camStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}});
    $('camVid').srcObject=camStream;$('camCount').textContent='';
    show('selfieView');
  }catch(e){alert('Camera unavailable — allow camera access to become the chicken!');}
}
function closeCam(){
  if(camStream){for(const t of camStream.getTracks())t.stop();camStream=null;}
  $('camVid').srcObject=null;$('camCount').textContent='';show('menu');
}
async function snap(){
  if(!camStream||!$('camVid').videoWidth)return;
  $('btnSnap').disabled=true;
  const cc=$('camCount');
  for(const l of['3','2','1']){cc.textContent=l;beep(660,.1,'triangle',.06);await new Promise(r=>setTimeout(r,750));}
  cc.textContent='';
  const v=$('camVid'),s=256,c=document.createElement('canvas');c.width=c.height=s;
  const x=c.getContext('2d'),m=Math.min(v.videoWidth,v.videoHeight);
  x.translate(s,0);x.scale(-1,1); // mirror like the preview
  x.drawImage(v,(v.videoWidth-m)/2,(v.videoHeight-m)/2,m,m,0,0,s,s);
  store.set('kc_selfie',c.toDataURL('image/jpeg',.82));
  loadSelfie();beep(1320,.12,'triangle',.07);
  $('btnSnap').disabled=false;closeCam();
}
function removeSelfie(){store.set('kc_selfie','');selfieImg=null;updateSelfieBtn();closeCam();}
loadSelfie();

// ---------- game state ----------
let G=null,state='menu',last=0;
function newGame(mode){
  G={mode,rand:mode==='daily'?mulberry32(seed):Math.random,t:0,score:0,combo:0,maxCombo:0,lives:3,ki:0,
     enemies:[],parts:[],texts:[],spawnT:.8,pose:0,poseT:0,stagger:0,shake:0,hitstop:0,flash:0,
     perfects:0,goods:0,misses:0,segs:Array.from({length:10},()=>({p:0,g:0,d:0,w:0})),
     slow:0,rts:[],jackpots:0,eggUsed:false,deathCam:0,deathX:0,dur:mode==='daily'?DAILY_SECONDS:Infinity};
}
const seg=()=>G.segs[Math.min(9,Math.floor(G.t/6))];

function spawn(){
  const r=G.rand;
  let side=r()<.5?-1:1;
  if(G.enemies.find(e=>e.side===side&&e.d>SPAWN_D-90))side=-side;
  let type='fox';const roll=r();
  if(!MOD.fox){
    if(G.t>12&&roll<.03)type=r()<.5?'cav':'phrag';
    else if(G.t>10&&roll<(MOD.gold||.05))type='golden';
    else if(G.t>25&&roll<(MOD.wea||.17))type='weasel';
    else if(G.t>14&&roll<(MOD.bad||.38))type='badger';
  }
  const base=Math.min(560,235+G.t*3.6)*(type==='badger'?.85:type==='weasel'?1.05:type==='cav'?.72:type==='phrag'?.5:1)*(.92+r()*.16)*(MOD.sp||1);
  if(type==='cav')addText(CX,GY-HERO_H-40,'HERE COMES LUCY!','#8a4a20',48);
  else if(type==='phrag')addText(CX,GY-HERO_H-40,'HERE COMES THE PHRAGMITES!','#3f7a2b',24);
  G.enemies.push({side,d:SPAWN_D,speed:base,type,hp:type==='phrag'?6:type==='cav'?5:type==='badger'?2:1,
    flipAt:type==='weasel'?190+r()*80:0,flipped:false,jump:0,wob:r()*6,hurt:0,
    zoneT:0});
  G.spawnT=Math.max(.36,1.05-G.t*.011)*(.75+r()*.5);
}
function addText(x,y,s,c,size=22){G.texts.push({x,y,s,c,size,life:.8});}
function burst(x,y,c,n=10,feather=false){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=80+Math.random()*220;G.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-120,life:.6+Math.random()*.5,c,feather});}}

function strike(side){
  if(state!=='play'||G.stagger>0)return;
  G.pose=side;G.poseT=.16;
  let best=null;
  for(const e of G.enemies){if(e.jump>0||e.side!==side||e.d>REACH)continue;if(!best||e.d<best.d)best=e;}
  if(!best){G.stagger=.26;G.combo=0;seg().w++;addText(CX+side*90,GY-140,'whiff','#7a6553',18);sfx('whiff',()=>thwack(0));return;}
  const boss=best.type==='cav'||best.type==='phrag',golden=best.type==='golden',perfect=Math.abs(best.d-RING)<=PERF,mult=1+Math.floor(G.combo/10),ex=CX+side*best.d;
  if(boss){G.score+=200*mult;G.ki=Math.min(100,G.ki+10*KIK);seg().g++;addText(ex,GY-130,'HIT!','#b03a1f',24);sfx('kick',()=>thwack(1));buzz(12);}
  else if(golden){G.score+=500*mult;G.ki=Math.min(100,G.ki+18*KIK);G.jackpots++;seg().p++;G.hitstop=.05;addText(ex,GY-130,'JACKPOT!','#f2b632',28);sfx('jackpot',()=>beep(1568,.15,'triangle',.09));buzz(20);}
  else if(perfect){G.score+=100*mult;G.ki=Math.min(100,G.ki+18*KIK);G.perfects++;seg().p++;G.hitstop=.05;addText(ex,GY-130,'PERFECT!','#d6342b',26);sfx('perfect',()=>thwack(2));beep(880,.09,'triangle',.05);beep(1320,.07,'triangle',.035);buzz(18);G.slow=.3;}
  else{G.score+=50*mult;G.ki=Math.min(100,G.ki+6*KIK);G.goods++;seg().g++;addText(ex,GY-130,'good','#2f6fd6',20);sfx('kick',()=>thwack(1));buzz(8);}
  G.combo++;G.maxCombo=Math.max(G.maxCombo,G.combo);
  if(G.combo%5===0){const big=G.combo%10===0;sfx(big?'yumyum':'yum',()=>beep(1046,.09,'triangle',.055));addText(CX,GY-HERO_H-45,big?'YUM YUM!':'YUM!','#f2b632',big?28:24);}
  if(best.zoneT)G.rts.push(G.t-best.zoneT);
  best.hp--;burst(ex,GY-40,best.type==='phrag'?'#5d8f3a':boss?'#b03a1f':best.type==='golden'?'#f2b632':best.type==='badger'?'#888':'#f08a24',8);
  if(best.hp<=0){best.dead=true;if(boss){addText(ex,GY-175,best.type==='phrag'?'PHRAG DOWN!':'LUCY DOWN!','#f2b632',34);G.slow=.45;}}
  else{best.d+=boss?100:150;best.hurt=.2;best.zoneT=0;}
  G.enemies=G.enemies.filter(e=>!e.dead);
  G.shake=Math.max(G.shake,perfect?5:3);
}
function goldenEgg(){
  if(state!=='play'||G.ki<100)return;
  G.ki=0;G.eggUsed=true;G.flash=.5;G.shake=12;buzz([30,40,60]);
  for(const e of G.enemies)burst(CX+(e.jump>0?0:e.side*e.d),GY-50,'#f2b632',12);
  G.score+=G.enemies.length*75;G.enemies=[];
  addText(CX,GY-HERO_H-30,'GOLDEN EGG!','#f2b632',34);
  sfx('egg',eggSound);
}
function hurt(e){
  G.lives--;G.combo=0;seg().d++;G.misses++;G.shake=14;buzz(120);
  burst(CX,GY-80,'#ffffff',16,true);addText(CX,GY-HERO_H-10,'BAWK!','#d6342b',30);sfx('squawk',()=>squawk());beep(110,.25,'sawtooth',.05);
  if(G.lives<=0){G.deathCam=1;G.slow=.9;G.deathX=CX+e.side*Math.min(e.d,REACH);endGame(false);}
}
function update(dt){
  if(G.hitstop>0){G.hitstop-=dt;return;}
  if(G.slow>0){G.slow-=dt;dt*=.33;}
  G.t+=dt;
  if(G.t>=G.dur){endGame(true);return;}
  G.stagger=Math.max(0,G.stagger-dt);G.poseT=Math.max(0,G.poseT-dt);if(G.poseT<=0)G.pose=0;
  G.shake=Math.max(0,G.shake-dt*40);G.flash=Math.max(0,G.flash-dt);
  G.spawnT-=dt;if(G.spawnT<=0)spawn();
  for(const e of G.enemies){
    e.wob+=dt*14;if(e.hurt)e.hurt=Math.max(0,e.hurt-dt);
    if(e.jump>0){e.jump-=dt/.55;e.zoneT=0;if(e.jump<=0){e.jump=0;e.side=-e.side;}continue;}
    e.d-=e.speed*SPEEDK*dt;
    if(!e.zoneT&&e.d<=REACH)e.zoneT=G.t;
    if(e.type==='weasel'&&!e.flipped&&e.d<=e.flipAt){e.flipped=true;e.jump=1;beep(990,.05,'square',.03);}
    if(e.d<=HITBOX){e.dead=true;hurt(e);if(state!=='play')return;}
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
function drawOne(P,x0){
  const pose=P?P.pose:0,st=P&&P.stagger>0,now=performance.now();
  const bob=Math.sin(now/180)*2,HH=HERO_H,HW=HH*HERO_AR,baseY=GY-26,hip=baseY-4;
  const x=x0+(st?Math.sin(now/30)*4:0)+pose*10;
  ctx.save();
  ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(x0,GY+4,50,9,0,0,Math.PI*2);ctx.fill();
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
  if(selfieImg){const hy=-HH*.76,hr=HH*.3;
    ctx.save();ctx.beginPath();ctx.arc(0,hy,hr,0,Math.PI*2);ctx.clip();
    ctx.drawImage(selfieImg,-hr,hy-hr,hr*2,hr*2);ctx.restore();
    ctx.strokeStyle='#d6342b';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,hy,hr,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-hr*.95,hy-hr*.15);ctx.lineTo(-hr-16,hy-hr*.4);ctx.moveTo(-hr*.95,hy-hr*.15);ctx.lineTo(-hr-20,hy-hr*.05);ctx.stroke();}
  const hat=hatType();
  if(hat==='santa'){ctx.fillStyle='#d6342b';ctx.beginPath();ctx.moveTo(-HW*.24,-HH*.9);ctx.quadraticCurveTo(0,-HH*1.32,HW*.26,-HH*.86);ctx.quadraticCurveTo(0,-HH*1,-HW*.24,-HH*.9);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(0,-HH*.9,HW*.25,HH*.05,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(HW*.24,-HH*.86,HW*.05,0,Math.PI*2);ctx.fill();}
  else if(hat==='pilgrim'){ctx.fillStyle='#1a1a1a';ctx.fillRect(-HW*.21,-HH*1.26,HW*.42,HH*.32);ctx.fillStyle='#f2b632';ctx.fillRect(-HW*.08,-HH*1.12,HW*.16,HH*.12);ctx.fillStyle='#1a1a1a';ctx.beginPath();ctx.ellipse(0,-HH*.93,HW*.35,HH*.07,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#6b4224';ctx.lineWidth=1.5;ctx.stroke();}
  ctx.restore();
  if(pose){ctx.font='bold 20px Bungee, Impact, sans-serif';ctx.textAlign='center';ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.fillStyle='#2a1d14';
    ctx.strokeText('HI-YAH!',x0+pose*120,GY-HH+10);ctx.fillText('HI-YAH!',x0+pose*120,GY-HH+10);}
}
function drawChickens(){
  drawOne(G||{pose:0},CX);
}
function drawEnemy(e){
  const bx=CX;
  let x,y=GY-22,flip=-e.side;
  if(e.jump>0){const p=1-e.jump;x=bx+e.side*e.d*(1-2*p);y-=Math.sin(Math.PI*p)*(HERO_H*.85);flip=-e.side*(p<.5?1:-1);}
  else x=bx+e.side*e.d;
  const bounce=e.jump>0?0:Math.abs(Math.sin(e.wob))*-6;
  ctx.save();ctx.translate(x,y+bounce);ctx.scale(flip,1);
  if(e.hurt>0)ctx.globalAlpha=.5+.5*Math.sin(performance.now()/25);
  ctx.fillStyle='rgba(0,0,0,.18)';ctx.beginPath();ctx.ellipse(0,26-bounce,30,6,0,0,Math.PI*2);ctx.fill();
  if(e.type==='cav'){
    // Lucy: ruby cavalier - long floppy ears, big dark eyes, harness, feathery tail
    ctx.strokeStyle='#2a1d14';ctx.lineWidth=2.5;
    const ruby='#9a5f33',ear='#7a4218',nose='#1a1a1a',harn='#3a4a55';
    // feathery tail (behind body, at right since facing left)
    ctx.fillStyle=ruby;ctx.beginPath();ctx.moveTo(26,-24);ctx.quadraticCurveTo(52,-40,48,-58);ctx.quadraticCurveTo(56,-44,40,-30);ctx.quadraticCurveTo(34,-24,26,-24);ctx.fill();ctx.stroke();
    ctx.strokeStyle=ear;ctx.lineWidth=2;
    for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(44-i*5,-44+i*4);ctx.quadraticCurveTo(50,-36,46-i*4,-26);ctx.stroke();}
    // body
    ctx.strokeStyle='#2a1d14';ctx.lineWidth=2.5;
    ctx.fillStyle=ruby;ctx.beginPath();ctx.ellipse(4,-18,34,20,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    // legs
    ctx.beginPath();ctx.moveTo(-16,-6);ctx.lineTo(-18,16);ctx.moveTo(2,-4);ctx.lineTo(1,16);ctx.moveTo(16,-6);ctx.lineTo(18,16);ctx.stroke();
    // harness straps
    ctx.strokeStyle=harn;ctx.lineWidth=5;
    ctx.beginPath();ctx.moveTo(-14,-34);ctx.quadraticCurveTo(-6,-16,-10,-2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(16,-34);ctx.lineTo(12,-4);ctx.stroke();
    ctx.strokeStyle='#2a1d14';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(-11,-18,3,0,Math.PI*2);ctx.stroke();
    // head
    ctx.strokeStyle='#2a1d14';ctx.lineWidth=2.5;
    ctx.fillStyle=ruby;ctx.beginPath();ctx.arc(-32,-36,19,0,Math.PI*2);ctx.fill();ctx.stroke();
    // big floppy ears hanging down
    ctx.fillStyle=ear;
    ctx.beginPath();ctx.ellipse(-46,-28,9,17,.35,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.ellipse(-18,-30,8,15,-.3,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=1.5;
    for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-49+i*3,-38+i*2);ctx.quadraticCurveTo(-45,-30,-47+i*3,-20);ctx.stroke();}
    // muzzle + nose
    ctx.strokeStyle='#2a1d14';ctx.lineWidth=2.5;
    ctx.fillStyle='#b07040';ctx.beginPath();ctx.ellipse(-40,-28,9,7,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle=nose;ctx.beginPath();ctx.arc(-45,-31,3.5,0,Math.PI*2);ctx.fill();
    // big round dark eyes
    ctx.fillStyle='#241309';ctx.beginPath();ctx.arc(-36,-40,4.6,0,Math.PI*2);ctx.arc(-25,-41,4.2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-37,-42,1.5,0,Math.PI*2);ctx.arc(-26,-43,1.4,0,Math.PI*2);ctx.fill();
    ctx.restore();
    ctx.fillStyle='#f2b632';ctx.font='bold 16px Inter, sans-serif';ctx.textAlign='center';ctx.fillText('♥'.repeat(e.hp),x,y-72);
    return;
  }
  if(e.type==='phrag'){
    ctx.lineCap='round';
    for(let i=-2;i<=2;i++){
      const h=95+((i*i)%3)*18,lean=Math.sin(e.wob+i)*4+i*7;
      ctx.strokeStyle=i%2?'#4e7a2f':'#3d6325';ctx.lineWidth=4.5;
      ctx.beginPath();ctx.moveTo(i*9,20);ctx.quadraticCurveTo(i*9+lean*.4,20-h*.55,i*9+lean,20-h);ctx.stroke();
      const px=i*9+lean,py=20-h;
      ctx.strokeStyle='#a8915f';ctx.lineWidth=3;
      for(let f=-1;f<=1;f++){ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+f*7-lean*.3,py-13-Math.abs(f)*3);ctx.stroke();}
      ctx.strokeStyle='#c9b083';ctx.lineWidth=2;
      for(let f=-1;f<=1;f++){ctx.beginPath();ctx.moveTo(px,py+2);ctx.lineTo(px+f*9-lean*.3,py-15-Math.abs(f)*3);ctx.stroke();}
    }
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-7,-38,5,0,Math.PI*2);ctx.arc(7,-38,5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#1a1a1a';ctx.beginPath();ctx.arc(-6,-38,2.4,0,Math.PI*2);ctx.arc(8,-38,2.4,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#1a1a1a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-12,-46);ctx.lineTo(-3,-42);ctx.moveTo(12,-46);ctx.lineTo(3,-42);ctx.stroke();
    ctx.restore();
    ctx.fillStyle='#f2b632';ctx.font='bold 16px Inter, sans-serif';ctx.textAlign='center';ctx.fillText('♥'.repeat(e.hp),x,y-112);
    return;
  }
  ctx.strokeStyle='#2a1d14';ctx.lineWidth=2.5;
  let body,belly,s=1;
  if(e.type==='fox'){body='#e57a2a';belly='#fff4e6';}
  else if(e.type==='golden'){body='#f2b632';belly='#fff8d6';}
  else if(e.type==='badger'){body='#6d6d72';belly='#eee';s=1.25;}
  else{body='#8a5a8f';belly='#f0dff2';s=.9;}
  ctx.scale(s,s);
  ctx.fillStyle=body;ctx.beginPath();ctx.moveTo(-22,0);ctx.quadraticCurveTo(-56,-10,-50,-30);ctx.quadraticCurveTo(-36,-10,-18,-8);ctx.fill();ctx.stroke();
  if(e.type==='fox'||e.type==='golden'){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-50,-28,6,0,Math.PI*2);ctx.fill();}
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
  if(G&&G.slow>0){const z=1+G.slow*(G.deathCam?.55:.3),zc=G.deathCam?G.deathX:CX;ctx.translate(zc,GY);ctx.scale(z,z);ctx.translate(-zc,-GY);}
  if(G&&G.shake>0)ctx.translate((Math.random()-.5)*G.shake,(Math.random()-.5)*G.shake);
  drawBG();
  if(G)for(const e of G.enemies)drawEnemy(e);
  drawChickens();
  if(G){
    for(const p of G.parts){ctx.globalAlpha=Math.min(1,p.life*2);ctx.fillStyle=p.c;
      if(p.feather){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.life*6);ctx.beginPath();ctx.ellipse(0,0,8,3,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#aaa';ctx.lineWidth=1;ctx.stroke();ctx.restore();}
      else{ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fill();}}
    ctx.globalAlpha=1;
    for(const t of G.texts){ctx.globalAlpha=Math.min(1,t.life*2);ctx.fillStyle=t.c;ctx.font=`bold ${t.size}px Bungee, Impact, sans-serif`;ctx.textAlign='center';ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.strokeText(t.s,t.x,t.y);ctx.fillText(t.s,t.x,t.y);}
    ctx.globalAlpha=1;
  }
  ctx.restore();
  if(G&&state==='count'){const c=G.cnt,l=c>2.4?'3':c>1.4?'2':c>0.4?'1':'HAJIME!';
    ctx.textAlign='center';ctx.font=`bold ${l==='HAJIME!'?52:96}px Bungee, Impact, sans-serif`;
    ctx.strokeStyle='#f2b632';ctx.lineWidth=6;ctx.strokeText(l,CX,GY-HERO_H*.55);
    ctx.fillStyle='rgba(42,29,20,.92)';ctx.fillText(l,CX,GY-HERO_H*.55);}
  if(G&&state==='play'&&G.lives===1){const p=.5+.5*Math.sin(performance.now()/170);
    ctx.strokeStyle=`rgba(214,52,43,${.28+.32*p})`;ctx.lineWidth=16;ctx.strokeRect(7,7,W-14,H-14);}
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
  if(state==='count'){G.cnt-=dt;if(G.cnt<=0)state='play';}
  else if(state==='play')update(dt);
  else if(G&&state==='over'){tickFx(dt);G.shake=Math.max(0,G.shake-dt*40);}
  draw();requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ---------- flow ----------
function show(id){for(const o of['menu','paused','over','board','cardView','achView','selfieView'])$(o).classList.toggle('hidden',o!==id);}
// ---------- leaderboard ----------
async function boardData(){try{const r=await fetch('/karate-chicken/api/scores');return(await r.json()).top||[]}catch(e){return null}}
async function showBoard(){
  const msg=$('boardMsg'),list=$('boardList');
  show('board');msg.textContent='loading…';list.innerHTML='';
  const top=await boardData();
  if(!top){msg.textContent='the dojo is offline — try again later';return;}
  if(!top.length){msg.textContent='no scores yet — be the first!';return;}
  msg.textContent='';
  const me=store.get('kc_name');
  list.innerHTML=top.map((r,i)=>`<li${me&&r.n===me?' class="me"':''}><span class="rk">${i+1}</span><span class="nm"></span><span class="bd">${beltFor(r.s).n} · x${r.c||0}</span><span class="sc">${(+r.s).toLocaleString()}</span></li>`).join('');
  list.querySelectorAll('.nm').forEach((el,i)=>el.textContent=top[i].n);
}
async function saveScore(){
  const btn=$('btnSave');if(!G||btn.disabled)return;
  const n=$('saveName').value.trim()||'anon';btn.disabled=true;btn.textContent='saving…';
  store.set('kc_name',n);
  try{
    const r=await fetch('/karate-chicken/api/scores',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({n,s:G.score,m:G.mode,c:G.maxCombo})});
    btn.textContent=r.ok?'saved!':'error';
    if(r.ok){
      // arm the challenge link so the share text dares their friends
      $('shareText').textContent+=`\n${location.origin}${location.pathname}?vs=${encodeURIComponent(n+'-'+G.score)}`;
      setTimeout(showBoard,500);
    }else btn.disabled=false;
  }catch(e){btn.textContent='offline?';btn.disabled=false;}
}
function setPlaying(on){document.body.classList.toggle('playing',on);}
function start(mode){initAudio();newGame(mode);G.cnt=3.6;state='count';show(null);setPlaying(true);$('copyMsg').textContent='';layout();
  fetch('/karate-chicken/api/ping',{method:'POST'}).catch(()=>{});}
function pause(){if(state!=='play')return;state='paused';show('paused');}
function resume(){if(state!=='paused')return;initAudio();state='play';show(null);last=performance.now();}
function toMenu(){state='menu';G=null;show('menu');setPlaying(false);$('padKi').disabled=true;champLine();}
function endGame(survived){
  if(state!=='play')return;state='over';setPlaying(false);
  const b=beltFor(G.score),best=+(store.get('kc_best')||0);
  if(G.score>best)store.set('kc_best',G.score);
  $('overTitle').textContent=survived?'Kata Complete!':'Feathers Ruffled!';
  const tot=G.perfects+G.goods+G.misses,acc=tot?Math.round(100*G.perfects/tot):0;
  const stN=bumpStreak(G.mode),beatVs=vs&&G.score>vs.score;
  const ach=checkAch(survived),rt=G.rts.length?(G.rts.reduce((a,x)=>a+x)/G.rts.length).toFixed(2):0;
  $('overStats').innerHTML=`<b>${G.score.toLocaleString()}</b> pts · <b>${b.n} Belt</b><br>Perfect rate ${acc}% · best combo ${G.maxCombo}${rt?` · ⚡ ${rt}s reflexes`:''}${G.score>best?' · <b>new best!</b>':''}${stN>1?` · 🔥 ${stN}-day streak`:''}${vs?`<br>${beatVs?'🎉 You beat '+vs.name+'!':vs.name+' keeps the crown… this time'}`:''}${ach.fresh.length?`<br>🏅 ${ach.fresh.map(a=>a[1]).join(' · ')}`:''}`;
  if(!survived)sfx('gameover',()=>{});
  $('btnRematch').style.display=beatVs?'':'none';
  const n=G.mode==='daily'?10:Math.min(10,Math.max(1,Math.ceil(G.t/6)));
  const grid=G.segs.slice(0,n).map((s,i)=>i*6>=G.t?'⬛':s.d?'🟥':(s.g+s.w>s.p?'🟨':'🟩')).join('');
  const head=G.mode==='daily'?`🐔🥋 Karate Chicken #${dayNo}`:`🐔🥋 Karate Chicken · Endless ${Math.floor(G.t)}s`;
  $('shareText').textContent=`${head}${beatVs?' — beat '+vs.name+'!':''}\n${b.n} Belt · ${G.score.toLocaleString()} pts${stN>1?` · 🔥 ${stN}-day streak`:''}\n${grid}\nbest combo ${G.maxCombo}`;
  $('padKi').disabled=true;updateBest();
  const sr=$('saveRow');sr.style.display=G.score>0?'flex':'none';
  const sb=$('btnSave');sb.disabled=false;sb.textContent='Save score';
  setTimeout(()=>{if(state==='over')show('over');},G.deathCam?1500:survived?200:700);
}
async function share(){
  const text=$('shareText').textContent+'\n'+location.href.split('#')[0];
  try{if(navigator.share){await navigator.share({text});return;}}catch(e){if(e&&e.name==='AbortError')return;}
  try{await navigator.clipboard.writeText(text);$('copyMsg').textContent='Copied. Paste it in your group chat!';}
  catch(e){const r=document.createRange();r.selectNodeContents($('shareText'));const s=getSelection();s.removeAllRanges();s.addRange(r);$('copyMsg').textContent='Selected: copy it to share.';}
}

// ---------- score card image ----------
function shareCard(){
  if(!G)return;
  const c=document.createElement('canvas');c.width=900;c.height=500;
  const x=c.getContext('2d'),b=beltFor(G.score),n=($('saveName').value.trim()||'a mysterious chicken').toUpperCase();
  x.fillStyle='#1c1410';x.fillRect(0,0,900,500);
  x.fillStyle='#2a1f18';x.fillRect(36,36,828,428);
  x.strokeStyle='#f2b632';x.lineWidth=6;x.strokeRect(36,36,828,428);
  if(hero.complete&&hero.naturalWidth){const h=380,w=h*HERO_AR;x.drawImage(hero,690-w/2,60,w,h);}
  x.textAlign='left';
  x.fillStyle='#f2b632';x.font='40px Bungee, Impact, sans-serif';x.fillText('KARATE CHICKEN',80,115);
  x.fillStyle='#fff';x.font='800 88px Inter, sans-serif';x.fillText(G.score.toLocaleString(),80,235);
  x.fillStyle='#d6342b';x.font='800 30px Inter, sans-serif';x.fillText(b.n.toUpperCase()+' BELT',80,295);
  x.fillStyle='#b8a58f';x.font='600 24px Inter, sans-serif';
  x.fillText(`${n} scored this — think you can beat it?`,80,355);
  if(vs&&G.score>vs.score){x.fillStyle='#f2b632';x.font='800 26px Inter, sans-serif';x.fillText('🎉 BEAT '+vs.name+'!',80,395);}
  x.fillStyle='#7a6553';x.font='600 19px Inter, sans-serif';x.fillText('yourmark.ai/karate-chicken',80,440);
  c.toBlob(async blob=>{
    if(!blob)return;
    const f=new File([blob],'karate-chicken-score.png',{type:'image/png'});
    const link=`${location.origin}${location.pathname}?vs=${encodeURIComponent(n+'-'+G.score)}`;
    const text=`${n} scored ${G.score.toLocaleString()} in Karate Chicken — beat it: ${link}`;
    // 1) native share sheet with the image + tappable challenge link (iOS/Android)
    try{if(navigator.canShare&&navigator.canShare({files:[f],text})){await navigator.share({files:[f],title:'Karate Chicken',text});return;}}catch(e){if(e&&e.name==='AbortError')return;}
    // 2) share sheet without files (text + link)
    try{if(navigator.share){await navigator.share({text});return;}}catch(e){if(e&&e.name==='AbortError')return;}
    // 3) iOS homescreen / desktop: show card for press-&-hold; auto-download on desktop
    const url=URL.createObjectURL(blob);
    $('cardImg').src=url;
    $('cardHint').textContent='hold the card to save — or copy the link: '+link;
    if(!isIOS){const a=document.createElement('a');a.href=url;a.download='karate-chicken-score.png';a.click();}
    show('cardView');
  },'image/png');
}
async function rematch(){
  if(!G||!vs)return;
  const n=$('saveName').value.trim()||'CHICKEN';
  const u=`${location.origin}${location.pathname}?vs=${encodeURIComponent(n+'-'+G.score)}`;
  const t=`I beat your ${vs.score.toLocaleString()} — now beat MY ${G.score.toLocaleString()}: ${u}`;
  try{if(navigator.share){await navigator.share({text:t});return;}}catch(e){if(e&&e.name==='AbortError')return;}
  try{await navigator.clipboard.writeText(t);$('copyMsg').textContent='Rematch link copied — send it to '+vs.name+'!';}catch(e){}
}

// ---------- input ----------
let lastMode='daily';
$('btnDaily').onclick=()=>start(lastMode='daily');
$('btnEndless').onclick=()=>start(lastMode='endless');
$('btnRematch').onclick=rematch;
$('btnMute').onclick=()=>setMute(!MUTED);setMute(MUTED);
$('btnHat').onclick=()=>{const h=store.get('kc_hat')||'auto';setHatMode(h==='auto'?'on':h==='on'?'off':'auto');};
setHatMode(store.get('kc_hat')||'auto');
$('btnAgain').onclick=()=>start(lastMode);
$('btnMenu').onclick=toMenu;
$('btnShare').onclick=share;
$('btnBoard').onclick=showBoard;
$('btnAch').onclick=showAch;
$('btnAchBack').onclick=()=>show('menu');
$('btnBack').onclick=()=>show(state==='over'?'over':'menu');
$('btnSave').onclick=saveScore;
$('btnInstall').onclick=()=>{if(deferredInstall){deferredInstall.prompt();deferredInstall.userChoice.finally(()=>$('btnInstall').style.display='none');deferredInstall=null;}else $('copyMsg')&&alert('iOS: tap Share → “Add to Home Screen”');};
$('btnCard').onclick=shareCard;
$('storyBtn').onclick=()=>sfx('welcome',()=>{});
$('btnSelfie').onclick=openCam;
$('btnSnap').onclick=snap;
$('btnCamCancel').onclick=closeCam;
$('btnCamRemove').onclick=removeSelfie;
$('btnCardBack').onclick=()=>show('over');
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
