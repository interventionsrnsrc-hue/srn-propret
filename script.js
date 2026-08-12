const clarityStyles=document.createElement('style');
clarityStyles.textContent=`
/* No decorative imagery: every visual must explain the service. */
.service-stage{display:none!important}.service-card{height:auto!important;min-height:470px!important;padding:30px!important;background:#fff!important}.service-copy{max-width:100%!important;margin-top:auto}.service-copy:before{display:block;margin-bottom:28px;color:#118838;font-size:11px;font-weight:850;letter-spacing:.14em;line-height:1.55;text-transform:uppercase;white-space:pre-line}.c1 .service-copy:before{content:"BUREAUX  •  SIÈGES  •  COMMERCES\\A PARTIES COMMUNES  •  LOGISTIQUE"}.c2 .service-copy:before{content:"APRÈS TRAVAUX  •  DÉMÉNAGEMENT\\A SINISTRE  •  REMISE À NIVEAU"}.c3 .service-copy:before{content:"BAIES VITRÉES  •  VITRINES\\A ACCÈS DIFFICILES  •  MÉCANISATION"}.c4 .service-copy:before{content:"AUTOLAVEUSE  •  MONOBROSSE\\A PARKINGS  •  ENTREPÔTS"}.service-copy h3{max-width:720px}.service-copy p{font-size:17px;max-width:620px}.robot{display:block!important;min-height:auto!important;padding:125px 6vw 100px!important}.robot-copy{max-width:1050px}.robot-copy p:last-child{max-width:720px!important;font-size:18px}.window,.robot-caption{display:none!important}.robot-copy:after{content:"MÉCANISER QUAND C’EST PLUS SÛR.  •  ROBOTISER QUAND C’EST PLUS RÉGULIER.  •  GARDER L’HUMAIN POUR LE CONTRÔLE ET LES FINITIONS.";display:block;margin-top:44px;padding:26px 0;border-top:1px solid rgba(255,255,255,.2);border-bottom:1px solid rgba(255,255,255,.2);color:#dce7df;font-size:12px;font-weight:800;letter-spacing:.12em;line-height:1.8}
@media(max-width:900px){.service-card{min-height:500px!important;padding:24px!important}.service-copy:before{font-size:9px;margin-bottom:24px}.service-copy p{font-size:16px}.robot{padding:110px 20px 80px!important}.robot-copy:after{font-size:10px;line-height:1.75;margin-top:34px}}
`;
document.head.appendChild(clarityStyles);

const clamp=(n,min,max)=>Math.min(Math.max(n,min),max);
const progressBar=document.getElementById('progressBar');
const nav=document.getElementById('nav');
const promise=document.getElementById('promise');
const cleanLayer=document.getElementById('cleanLayer');
const wiper=document.getElementById('wiper');
const control=document.getElementById('control');
const controlVisual=document.getElementById('controlVisual');

function onScroll(){
  const doc=document.documentElement;
  const max=Math.max(doc.scrollHeight-innerHeight,1);
  const p=scrollY/max;
  if(progressBar) progressBar.style.height=`${p*100}%`;
  const center=scrollY+innerHeight*.35;
  let light=false;
  document.querySelectorAll('.scene[data-theme]').forEach(s=>{if(center>=s.offsetTop&&center<s.offsetTop+s.offsetHeight) light=s.dataset.theme==='light';});
  nav?.classList.toggle('light',light);
  if(promise&&cleanLayer&&wiper){const start=promise.offsetTop;const range=promise.offsetHeight-innerHeight;const pp=clamp((scrollY-start)/Math.max(range,1),0,1);const reveal=clamp((pp-.12)/.68,0,1);cleanLayer.style.clipPath=`inset(0 0 ${100-reveal*100}% 0)`;wiper.style.top=`calc(${reveal*100}% - 18px)`;}
  if(control&&controlVisual){const r=control.getBoundingClientRect();const cp=clamp((innerHeight-r.top)/(innerHeight+r.height*.55),0,1);controlVisual.style.transform=`scale(${.94+cp*.06})`;}
}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();

const serviceLinks={c1:'/nettoyage-multisites/',c2:'/remise-en-etat/',c3:'/vitrerie-professionnelle/',c4:'/nettoyage-mecanise-sols/'};
document.querySelectorAll('.service-card').forEach(card=>{const cls=[...card.classList].find(c=>serviceLinks[c]);if(!cls)return;const go=()=>location.href=serviceLinks[cls];card.setAttribute('role','link');card.setAttribute('tabindex','0');card.style.cursor='pointer';card.addEventListener('click',go);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});});

const form=document.getElementById('quoteForm');
if(form){let current=1;const answers={};const successText=form.querySelector('.success p');if(successText)successText.textContent='Votre demande a bien été transmise à l’équipe SRN. Nous revenons vers vous pour qualifier le besoin et organiser la suite.';const showStep=n=>{form.querySelectorAll('.step').forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===n));current=n;};form.querySelectorAll('.choices button').forEach(btn=>btn.addEventListener('click',()=>{answers[current]=btn.dataset.value;showStep(current+1);}));form.querySelectorAll('.back').forEach(btn=>btn.addEventListener('click',()=>showStep(Math.max(1,current-1))));form.addEventListener('submit',async e=>{e.preventDefault();const submit=form.querySelector('.submit');const original=submit?.innerHTML;if(submit){submit.disabled=true;submit.textContent='Envoi en cours…';}const fd=new FormData(form);const payload={'_subject':'Nouvelle demande depuis srn-proprete.com','_template':'table','_replyto':fd.get('email')||'','_url':location.href,'Besoin':answers[1]||'Non précisé','Nombre de sites':answers[2]||'Non précisé','Société':fd.get('company')||'','Nom et prénom':fd.get('name')||'','Email':fd.get('email')||'','Téléphone':fd.get('phone')||''};try{const res=await fetch('https://formsubmit.co/ajax/interventionsrnsrc@gmail.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)});if(!res.ok)throw new Error('Envoi impossible');showStep(4);form.reset();}catch(err){alert('La demande n’a pas pu partir. Vous pouvez écrire directement à interventionsrnsrc@gmail.com.');}finally{if(submit){submit.disabled=false;submit.innerHTML=original;}}});document.getElementById('restart')?.addEventListener('click',()=>showStep(1));}
