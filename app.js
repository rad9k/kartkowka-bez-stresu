let cur;const tabs=document.getElementById('tabs');
Object.keys(QUIZY).forEach(k=>{const b=document.createElement('button');b.className='tab';b.textContent=k;b.onclick=()=>show(k);tabs.appendChild(b)});
function show(k){cur=k;[...tabs.children].forEach(b=>b.classList.toggle('on',b.textContent===k));document.getElementById('score').textContent='';
document.getElementById('quiz').innerHTML=QUIZY[k].map((q,i)=>`<div class="q" id="q${i}"><b>${i+1}. ${q.q}</b>${q.img||''}`+q.a.map((a,j)=>`<label class="opt" id="o${i}_${j}"><input type="radio" name="q${i}" value="${j}">${a}</label>`).join('')+`<div class="ex">💡 ${q.e}</div></div>`).join('')}
function check(){let s=0;QUIZY[cur].forEach((q,i)=>{const c=document.querySelector(`input[name=q${i}]:checked`);document.getElementById('q'+i).classList.add('done');
q.a.forEach((_,j)=>document.getElementById(`o${i}_${j}`).classList.remove('good','bad'));document.getElementById(`o${i}_${q.c}`).classList.add('good');
if(c){if(+c.value===q.c)s++;else document.getElementById(`o${i}_${c.value}`).classList.add('bad')}});
document.getElementById('score').textContent=`Twój wynik: ${s}/${QUIZY[cur].length} ${s===QUIZY[cur].length?'🏆':s>=3?'👍':'📖 Powtórz i spróbuj jeszcze raz!'}`}
show(Object.keys(QUIZY)[0]);
async function zapis(e){e.preventDefault();const d={email:email.value,kto:kto.value};const t=document.getElementById('dzieki');
if(CFG.SUPABASE_URL){const r=await fetch(CFG.SUPABASE_URL+'/rest/v1/zapisy',{method:'POST',headers:{apikey:CFG.SUPABASE_KEY,Authorization:'Bearer '+CFG.SUPABASE_KEY,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(d)});
t.textContent=r.ok?'Dziękujemy! Odezwiemy się z linkiem do przedsprzedaży.':'Ups, coś poszło nie tak. Spróbuj ponownie.'}else{t.textContent='Dziękujemy! (wersja testowa – zapis nie został jeszcze wysłany do bazy)'}e.target.reset()}
