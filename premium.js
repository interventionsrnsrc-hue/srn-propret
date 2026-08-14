const clamp=(n,min,max)=>Math.min(Math.max(n,min),max);

const galleryStyles=document.createElement('link');
galleryStyles.rel='stylesheet';
galleryStyles.href='premium-gallery.css';
document.head.appendChild(galleryStyles);

const comparisonsGrid=document.querySelector('.comparisons');
if(comparisonsGrid&&!document.querySelector('.secondary-media')){
  comparisonsGrid.insertAdjacentHTML('beforeend',`
    <article class="comparison reveal" data-compare>
      <div class="compare-media secondary-media">
        <div class="proof-image secondary-sprite dump-before before" role="img" aria-label="Zone encombrée avant intervention SRN"></div>
        <div class="after-wrap" data-after>
          <div class="proof-image secondary-sprite dump-after after" role="img" aria-label="Zone remise en état après intervention SRN"></div>
        </div>
        <div class="compare-line" data-line><span>↔</span></div>
        <input class="compare-range" type="range" min="0" max="100" value="51" aria-label="Comparer avant et après : restitution d'une zone extérieure" />
        <span class="badge before-badge">AVANT</span>
        <span class="badge after-badge">APRÈS</span>
      </div>
      <div class="compare-caption"><small>04 / INTERVENTION</small><h3>RESTITUTION DE ZONE</h3><p>Retrait des encombrants et remise en état visible de l’espace.</p></div>
    </article>`);

  comparisonsGrid.insertAdjacentHTML('afterend',`
    <div class="editorial-grid">
      <figure class="editorial-image reveal">
        <div class="editorial-shot detail-shot" role="img" aria-label="Détail terrain avant une intervention de remise en état SRN"></div>
        <figcaption><span>DÉTAIL TERRAIN</span><small>La réalité avant intervention.</small></figcaption>
      </figure>
      <figure class="editorial-image reveal">
        <div class="editorial-shot retail-shot" role="img" aria-label="Environnement retail entretenu par SRN, enseigne masquée"></div>
        <figcaption><span>ENVIRONNEMENT RETAIL</span><small>Une exécution discrète dans des lieux exigeants.</small></figcaption>
      </figure>
    </div>`);
}

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
