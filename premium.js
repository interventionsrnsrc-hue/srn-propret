const clamp=(n,min,max)=>Math.min(Math.max(n,min),max);

const progress=document.getElementById('pageProgress');
const nav=document.getElementById('nav');

function updateScroll(){
  const doc=document.documentElement;
  const max=Math.max(doc.scrollHeight-innerHeight,1);
  if(progress) progress.style.height=`${(scrollY/max)*100}%`;

  const y=scrollY+innerHeight*.22;
  const lightSections=[...document.querySelectorAll('.manifesto,.proofs,.expertises')];
  const isLight=lightSections.some(s=>y>=s.offsetTop&&y<s.offsetTop+s.offsetHeight);
  nav?.classList.toggle('is-light',isLight);
}
addEventListener('scroll',updateScroll,{passive:true});
addEventListener('resize',updateScroll);
updateScroll();

const observer=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12,rootMargin:'0px 0px -5% 0px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('[data-compare]').forEach(card=>{
  const range=card.querySelector('.compare-range');
  const after=card.querySelector('[data-after]');
  const line=card.querySelector('[data-line]');
  if(!range||!after||!line)return;
  const render=()=>{
    const v=clamp(Number(range.value),0,100);
    after.style.clipPath=`inset(0 0 0 ${v}%)`;
    line.style.left=`${v}%`;
  };
  range.addEventListener('input',render,{passive:true});
  render();
});

const form=document.getElementById('contactForm');
const note=document.getElementById('formNote');

if(form){
  form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const button=form.querySelector('button[type="submit"]');
    const original=button?.innerHTML;
    const fd=new FormData(form);
    const payload={
      '_subject':'Nouvelle demande depuis srn-proprete.com',
      '_template':'table',
      '_replyto':fd.get('email')||'',
      '_url':location.href,
      'Société':fd.get('company')||'',
      'Nom et prénom':fd.get('name')||'',
      'Email':fd.get('email')||'',
      'Téléphone':fd.get('phone')||'',
      'Besoin':fd.get('message')||'Non précisé'
    };
    if(button){
      button.disabled=true;
      button.textContent='ENVOI EN COURS…';
    }
    if(note)note.textContent='';
    try{
      const res=await fetch('https://formsubmit.co/ajax/interventionsrnsrc@gmail.com',{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(payload)
      });
      if(!res.ok)throw new Error('Envoi impossible');
      form.reset();
      if(note)note.textContent='Demande envoyée. L’équipe SRN revient vers vous rapidement.';
    }catch(err){
      if(note)note.textContent='L’envoi a échoué. Vous pouvez écrire directement à interventionsrnsrc@gmail.com.';
    }finally{
      if(button){
        button.disabled=false;
        button.innerHTML=original;
      }
    }
  });
}

if(matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));
}
