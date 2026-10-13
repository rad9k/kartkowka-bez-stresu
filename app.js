// Pasek nawigacji, animacje przy przewijaniu, liczniki
const nav=document.getElementById('nav');addEventListener('scroll',()=>nav.classList.toggle('sc',scrollY>30));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');
 e.target.querySelectorAll('[data-count]').forEach(el=>{const n=+el.dataset.count,suf=el.dataset.suf||'',t0=performance.now();
  const f=t=>{const p=Math.min(1,(t-t0)/1400);el.textContent=Math.round(n*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)});
 io.unobserve(e.target)}),{threshold:.15});
document.querySelectorAll('.reveal,#mock').forEach(el=>io.observe(el));

// Konfetti
const cv=document.getElementById('confetti'),cx=cv.getContext('2d');let parts=[];
function confetti(){cv.width=innerWidth;cv.height=innerHeight;const cols=['#6d28d9','#ec4899','#f59e0b','#10b981','#3b82f6'];
 for(let i=0;i<180;i++)parts.push({x:innerWidth/2,y:innerHeight/2,vx:(Math.random()-.5)*16,vy:Math.random()*-16-4,s:Math.random()*8+4,c:cols[i%5],r:Math.random()*6,life:0});
 if(parts.length<=180)requestAnimationFrame(tick)}
function tick(){cx.clearRect(0,0,cv.width,cv.height);parts=parts.filter(p=>p.life<160);
 parts.forEach(p=>{p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.r+=.1;p.life++;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);cx.restore()});
 if(parts.length)requestAnimationFrame(tick);else cx.clearRect(0,0,cv.width,cv.height)}

// Quizy (treść w quizy.json – łatwo poprawiać bez ruszania kodu)
const META={chemia:['🧪','Chemia','#8b5cf6'],fizyka:['⚡','Fizyka','#f59e0b'],biologia:['🫀','Biologia','#ec4899'],matematyka:['📐','Matematyka','#3b82f6'],geografia:['🌍','Geografia','#10b981']};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let DATA,subj,qi,order=[];
const $=id=>document.getElementById(id);
fetch('quizy.json?v=3').then(r=>r.json()).then(d=>{DATA=d;
 $('subjects').innerHTML=Object.keys(META).filter(k=>d[k]).map(k=>`<button class="subj" data-s="${k}" style="--sc:${META[k][2]}">${META[k][0]} ${META[k][1]}</button>`).join('');
 $('subjects').onclick=e=>{const b=e.target.closest('.subj');if(b)pickSubj(b.dataset.s)};pickSubj(Object.keys(META).find(k=>d[k]))});
function pickSubj(s){subj=s;document.querySelectorAll('.subj').forEach(b=>b.classList.toggle('on',b.dataset.s===s));
 $('qlist').style.setProperty('--sc',META[s][2]);
 $('qlist').innerHTML=DATA[s].map((z,i)=>`<button class="qcard" data-i="${i}"><b>Quiz ${i+1}: ${esc(z.title)}</b><small>${z.questions.length} pytań · ok. 3 min</small></button>`).join('');
 $('qlist').onclick=e=>{const b=e.target.closest('.qcard');if(b)pickQuiz(+b.dataset.i)};pickQuiz(0)}
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
function pickQuiz(i){qi=i;document.querySelectorAll('.qcard').forEach(b=>b.classList.toggle('on',+b.dataset.i===i));
 const z=DATA[subj][i];$('qtitle').textContent=`${META[subj][0]} ${z.title}`;$('result').innerHTML='';$('prog').style.width='0';
 order=z.questions.map(q=>shuffle(q.options.map((_,j)=>j)));
 $('quiz').innerHTML=z.questions.map((q,n)=>{const img=window.ILUSTRACJE[`${subj}-${i}-${n}`];
  return `<div class="q" id="q${n}" style="animation-delay:${n*.07}s"><h4>${n+1}. ${esc(q.q)}</h4>${img?`<div class="ill" title="${esc(q.image||'')}">${img}</div>`:''}<div class="opts">`+
  order[n].map(j=>`<label class="opt" data-j="${j}"><input type="radio" name="q${n}" value="${j}"> ${esc(q.options[j])}</label>`).join('')+
  `</div><div class="ex">💡 ${esc(q.explanation)}</div></div>`}).join('');
 $('chk').disabled=false}
document.addEventListener('change',e=>{if(!e.target.matches('#quiz input'))return;const q=e.target.closest('.q');q.querySelectorAll('.opt').forEach(o=>o.classList.toggle('sel',o.contains(e.target)));
 const z=DATA[subj][qi],n=document.querySelectorAll('#quiz input:checked').length;$('prog').style.width=n/z.questions.length*100+'%'});
$('chk').onclick=()=>{const z=DATA[subj][qi];let s=0;
 z.questions.forEach((q,n)=>{const box=$('q'+n),c=box.querySelector('input:checked');box.classList.add('done');
  box.querySelectorAll('.opt').forEach(o=>{o.classList.remove('sel');if(+o.dataset.j===q.correct)o.classList.add('good')});
  if(c){if(+c.value===q.correct)s++;else c.closest('.opt').classList.add('bad')}});
 const t=z.questions.length,p=s/t;$('prog').style.width='100%';
 $('result').innerHTML=`<span class="big">${p===1?'🏆':p>=.6?'🎉':'📚'}</span>Twój wynik: ${s}/${t}<br><small style="font-weight:600;color:var(--mut)">${p===1?'Perfekcyjnie! Kartkówka to dla ciebie pestka.':p>=.6?'Świetnie! Przeczytaj wyjaśnienia przy błędach.':'Przeczytaj wyjaśnienia i spróbuj jeszcze raz – dasz radę!'}</small>`;
 if(p>=.6)confetti();$('chk').disabled=true;$('result').scrollIntoView({behavior:'smooth',block:'center'})};
$('again').onclick=()=>pickQuiz(qi);

// Zapis na przedsprzedaż (Supabase, tylko INSERT – odczyt chroni RLS)
$('form').onsubmit=async e=>{e.preventDefault();const m=$('msg'),b=$('sbtn');b.disabled=true;m.style.color='#16a34a';m.textContent='Zapisuję…';
 try{const r=await fetch(CFG.SUPABASE_URL+'/rest/v1/zapisy',{method:'POST',headers:{apikey:CFG.SUPABASE_KEY,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({email:$('email').value.trim(),kto:$('kto').value})});
  if(!r.ok)throw 0;m.textContent='Dziękujemy! Jesteś na liście przedsprzedaży 🎉';e.target.reset();confetti()}
 catch(_){m.style.color='#dc2626';m.textContent='Ups, nie udało się zapisać. Spróbuj ponownie za chwilę.'}b.disabled=false};
