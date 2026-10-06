'use strict';
const menuButton=document.querySelector('.menu-toggle');
const menu=document.getElementById('mobile-menu');
function closeMenu(){if(!menu)return;menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Otevřít menu');}
menuButton?.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Zavřít menu':'Otevřít menu');});
menu?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu&&!menu.hidden){closeMenu();menuButton.focus();}});
document.addEventListener('click',e=>{if(menu&&!menu.hidden&&!e.target.closest('.header'))closeMenu();});
window.matchMedia('(min-width:701px)').addEventListener('change',e=>{if(e.matches)closeMenu();});


// Pevná navigace se po posunutí zmenší; rozložení stránky se přitom nemění.
const header=document.querySelector('.header');
if(header){
 const syncHeader=()=>header.classList.toggle('is-scrolled',window.scrollY>48);
 window.addEventListener('scroll',syncHeader,{passive:true});
 window.addEventListener('pageshow',syncHeader);
 syncHeader();
}

// Nativní kalendář používá přístupný ovládací prvek prohlížeče i telefonu.
const todayParts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Prague',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
const today=['year','month','day'].map(p=>todayParts.find(v=>v.type===p).value).join('-');
function nextDate(value){const date=new Date(value+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+1);return date.toISOString().slice(0,10);}
function validDate(value){return /^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;}
document.querySelectorAll('input[name="prijezd"]').forEach(arrival=>{
 const departure=arrival.form.querySelector('input[name="odjezd"]');arrival.min=today;departure.min=nextDate(today);
 arrival.addEventListener('change',()=>{departure.min=validDate(arrival.value)?nextDate(arrival.value):nextDate(today);departure.setCustomValidity('');});
 departure.addEventListener('change',()=>departure.setCustomValidity(''));
});

const galleryItems=[...document.querySelectorAll('[data-gallery]')];
const lightbox=document.querySelector('.lightbox');
let visiblePhotos=galleryItems,photoIndex=0,lastPhotoLink=null;
function showPhoto(index){photoIndex=(index+visiblePhotos.length)%visiblePhotos.length;const item=visiblePhotos[photoIndex],image=lightbox.querySelector('.lightbox-image');image.src=item.href;image.alt=item.querySelector('img').alt;lightbox.querySelector('figcaption').textContent=item.dataset.caption;lightbox.querySelector('.lightbox-counter').textContent=`${photoIndex+1} / ${visiblePhotos.length}`;}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 galleryItems.forEach(item=>item.hidden=button.dataset.filter!=='all'&&item.dataset.category!==button.dataset.filter);
 visiblePhotos=galleryItems.filter(item=>!item.hidden);const n=visiblePhotos.length;document.querySelector('.gallery-count').textContent=`${n} ${n===1?'fotografie':n<5?'fotografie':'fotografií'}`;
}));
galleryItems.forEach(item=>item.addEventListener('click',event=>{
 if(!lightbox?.showModal)return;event.preventDefault();lastPhotoLink=item;showPhoto(visiblePhotos.indexOf(item));lightbox.showModal();document.body.style.overflow='hidden';lightbox.querySelector('.lightbox-close').focus();
}));
if(lightbox){
 lightbox.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());
 lightbox.querySelector('.lightbox-prev').addEventListener('click',()=>showPhoto(photoIndex-1));
 lightbox.querySelector('.lightbox-next').addEventListener('click',()=>showPhoto(photoIndex+1));
 lightbox.addEventListener('close',()=>{document.body.style.overflow='';lastPhotoLink?.focus();});
 lightbox.addEventListener('click',e=>{if(e.target===lightbox||e.target.tagName==='FIGURE')lightbox.close();});
 lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(photoIndex-1);}if(e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+1);}});
 let startX=0,startY=0;
 lightbox.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;startX=e.touches[0].clientX;startY=e.touches[0].clientY;},{passive:true});
 lightbox.addEventListener('touchend',e=>{if(!e.changedTouches[0])return;const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)showPhoto(photoIndex+(dx<0?1:-1));},{passive:true});
}

const form=document.getElementById('inquiry-form');
if(form){
 form.hidden=false;
 const endpoint=window.MARIANKA_CONFIG?.formspreeEndpoint||'';
 const configured=/^https:\/\/formspree\.io\/f\/[a-z0-9]+$/i.test(endpoint);
 const status=document.getElementById('form-status'),submit=document.getElementById('submit-inquiry'),emailFallback=document.getElementById('email-fallback');
 if(!configured){document.getElementById('form-unavailable').hidden=false;submit.textContent='Připravit e-mailovou poptávku';}
 const params=new URLSearchParams(location.search);
 for(const name of ['prijezd','odjezd']){const value=params.get(name);if(value&&validDate(value))form.elements[name].value=value;}
 const guestParam=params.get('hoste');if(guestParam&&Number.isInteger(+guestParam)&&+guestParam>=1&&+guestParam<=21)form.elements.hoste.value=guestParam;
 if(validDate(form.elements.prijezd.value))form.elements.odjezd.min=nextDate(form.elements.prijezd.value);
 function error(name,message){const input=form.elements[name];input.setAttribute('aria-invalid',String(Boolean(message)));document.getElementById(name+'-error').textContent=message;return !message;}
 function validate(name){const value=form.elements[name].value.trim();let message='';
  if(!value)message='Vyplňte prosím toto pole.';
  else if(name==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))message='Zadejte platnou e-mailovou adresu.';
  else if(name==='telefon'&&(!/^\+?[\d\s().-]+$/.test(value)||value.replace(/\D/g,'').length<9||value.replace(/\D/g,'').length>15))message='Zadejte telefon s 9 až 15 číslicemi, případně s předvolbou +420.';
  else if(name==='prijezd'&&(!validDate(value)||value<today))message='Příjezd musí být dnes nebo v budoucnu.';
  else if(name==='odjezd'&&(!validDate(value)||value<=form.elements.prijezd.value))message='Odjezd musí být později než příjezd.';
  else if(name==='hoste'&&(!Number.isInteger(+value)||+value<1||+value>21))message='Vyberte počet hostů od 1 do 21.';
  return error(name,message);
 }
 const names=['jmeno','prijmeni','email','telefon','prijezd','odjezd','hoste'];
 names.forEach(name=>{
  form.elements[name].addEventListener('blur',()=>{if(form.elements[name].value||form.elements[name].getAttribute('aria-invalid')==='true')validate(name);});
  form.elements[name].addEventListener('input',()=>{if(form.elements[name].getAttribute('aria-invalid')==='true')validate(name);emailFallback.hidden=true;});
 });
 form.elements.zprava.addEventListener('input',()=>{emailFallback.hidden=true;});
 function fields(){return Object.fromEntries([...names,'zprava'].map(name=>[name,form.elements[name].value.trim()]));}
 function emailLink(data){const date=v=>v.split('-').reverse().join('.');const body=`Dobrý den,\n\nrád/a bych nezávazně poptal/a pobyt na Chatě Mariánka.\n\nJméno: ${data.jmeno}\nPříjmení: ${data.prijmeni}\nE-mail: ${data.email}\nTelefon: ${data.telefon}\nPříjezd: ${date(data.prijezd)}\nOdjezd: ${date(data.odjezd)}\nPočet hostů: ${data.hoste}\n\nVzkaz:\n${data.zprava||'Bez poznámky'}\n\nDěkuji.`;return `mailto:roliska@volny.cz?subject=${encodeURIComponent('Nezávazná poptávka – Chata Mariánka')}&body=${encodeURIComponent(body)}`;}
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(submit.disabled)return;
  const checks=names.map(validate);if(checks.includes(false)){status.textContent='Zkontrolujte prosím označená pole.';status.classList.remove('success');form.querySelector('[aria-invalid="true"]').focus();return;}
  if(form.elements._gotcha.value)return;
  const data=fields();emailFallback.href=emailLink(data);
  if(!configured){status.textContent='Poptávka je připravená. Tlačítkem níže otevřete e-mail a odešlete jej ze své poštovní aplikace. Z tohoto webu zatím nebylo nic odesláno.';status.classList.remove('success');emailFallback.hidden=false;status.focus();return;}
  submit.disabled=true;const priorText=submit.textContent;submit.textContent='Odesílání…';status.textContent='Odesíláme vaši poptávku.';status.classList.remove('success');
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
  try{
   const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({...data,_subject:'Nezávazná poptávka – Chata Mariánka',_gotcha:''}),signal:controller.signal});
   if(!response.ok)throw new Error('Odeslání se nepodařilo');
   status.textContent='Děkujeme za vaši poptávku. Ozveme se vám co nejdříve. Termín bude rezervovaný až po vzájemném potvrzení.';status.classList.add('success');form.reset();names.forEach(n=>error(n,''));form.elements.odjezd.min=nextDate(today);emailFallback.hidden=true;status.focus();
  }catch(error){status.textContent='Poptávku se nepodařilo odeslat. Vyplněné údaje zůstaly zachované. Zkuste to prosím znovu, otevřete připravený e-mail nebo zavolejte na +420 777 728 288.';emailFallback.hidden=false;status.focus();}
  finally{clearTimeout(timer);submit.disabled=false;submit.textContent=priorText;}
 });
}
