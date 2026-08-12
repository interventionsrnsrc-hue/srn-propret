const clamp=(n,min,max)=>Math.min(Math.max(n,min),max);
const progressBar=document.getElementById('progressBar');
const nav=document.getElementById('nav');
const promise=document.getElementById('promise');
const cleanLayer=document.getElementById('cleanLayer');
const wiper=document.getElementById('wiper');
const control=document.getElementById('control');
const controlVisual=document.getElementById('controlVisual');
const robotSection=document.getElementById('robot');
const robotUnit=document.getElementById('robotUnit');
const cleanTrail=document.getElementById('cleanTrail');

function onScroll(){
  const doc=document.documentElement;
  const max=Math.max(doc.scrollHeight-innerHeight,1);
  const p=scrollY/max;
  if(progressBar) progressBar.style.height=`${p*100}%`;

  const center=scrollY+innerHeight*.35;
  let light=false;
  document.querySelectorAll('.scene[data-theme]').forEach(s=>{
    if(center>=s.offsetTop && center<s.offsetTop+s.offsetHeight) light=s.dataset.theme==='light';
  });
  nav?.classList.toggle('light',light);

  if(promise && cleanLayer && wiper){
    const start=promise.offsetTop;
    const range=promise.offsetHeight-innerHeight;
    const pp=clamp((scrollY-start)/Math.max(range,1),0,1);
    const reveal=clamp((pp-.12)/.68,0,1);
    cleanLayer.style.clipPath=`inset(0 ${100-reveal*100}% 0 0)`;
    wiper.style.left=`calc(${reveal*100}% - 24px)`;
  }

  if(control && controlVisual){
    const r=control.getBoundingClientRect();
    const cp=clamp((innerHeight-r.top)/(innerHeight+r.height*.55),0,1);
    const scale=.94+cp*.06;
    controlVisual.style.transform=`scale(${scale})`;
  }

  if(robotSection && robotUnit && cleanTrail){
    const start=robotSection.offsetTop;
    const range=robotSection.offsetHeight-innerHeight;
    const rp=clamp((scrollY-start+innerHeight*.15)/Math.max(range+innerHeight*.7,1),0,1);
    const y=72-rp*48;
    robotUnit.style.top=`${y}%`;
    cleanTrail.style.height=`${100-y}%`;
    cleanTrail.style.bottom='0';
  }
}
addEventListener('scroll',onScroll,{passive:true});
addEventListener('resize',onScroll);
onScroll();

const serviceLinks={c1:'/nettoyage-multisites/',c2:'/remise-en-etat/',c3:'/vitrerie-professionnelle/',c4:'/nettoyage-mecanise-sols/'};
document.querySelectorAll('.service-card').forEach(card=>{
  const cls=[...card.classList].find(c=>serviceLinks[c]);
  if(!cls) return;
  const go=()=>location.href=serviceLinks[cls];
  card.setAttribute('role','link');
  card.setAttribute('tabindex','0');
  card.style.cursor='pointer';
  card.addEventListener('click',go);
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
});

const form=document.getElementById('quoteForm');
if(form){
  let current=1;
  const answers={};
  const showStep=n=>{
    form.querySelectorAll('.step').forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===n));
    current=n;
  };
  form.querySelectorAll('.choices button').forEach(btn=>btn.addEventListener('click',()=>{
    answers[current]=btn.dataset.value;
    showStep(current+1);
  }));
  form.querySelectorAll('.back').forEach(btn=>btn.addEventListener('click',()=>showStep(Math.max(1,current-1))));
  form.addEventListener('submit',e=>{e.preventDefault();showStep(4)});
  document.getElementById('restart')?.addEventListener('click',()=>showStep(1));
}
