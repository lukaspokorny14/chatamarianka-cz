import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../public/assets/app.js',import.meta.url),'utf8');
const configSource=fs.readFileSync(new URL('../public/assets/config.js',import.meta.url),'utf8');
class Element {
 constructor(value=''){this.value=value;this.handlers={};this.attrs={};this.textContent='';this.hidden=true;this.disabled=false;this.classList={add(){},remove(){}};this.dataset={};}
 addEventListener(n,f){(this.handlers[n]??=[]).push(f);}
 async emit(n,event={}){for(const f of this.handlers[n]||[])await f({preventDefault(){},...event});}
 setAttribute(n,v){this.attrs[n]=v;}getAttribute(n){return this.attrs[n]??null;}focus(){this.focused=true;}
}
function environment({configured=true,fetchImpl=async()=>({ok:true}),gallery=false}={}){
 const nodes={},names=['jmeno','prijmeni','email','telefon','prijezd','odjezd','hoste','zprava','_gotcha'];
 const form=new Element();form.elements=Object.fromEntries(names.map(n=>[n,new Element()]));
 form.querySelector=()=>Object.values(form.elements).find(n=>n.attrs['aria-invalid']==='true');form.reset=()=>{names.forEach(n=>form.elements[n].value='');form.resetCalled=true;};
 Object.assign(form.elements.jmeno,{value:'Test'});Object.assign(form.elements.prijmeni,{value:'Kontrola'});Object.assign(form.elements.email,{value:'test@example.com'});Object.assign(form.elements.telefon,{value:'+420 777 123 456'});Object.assign(form.elements.prijezd,{value:'2099-12-20'});Object.assign(form.elements.odjezd,{value:'2099-12-27'});Object.assign(form.elements.hoste,{value:'21'});
 for(const id of ['form-status','submit-inquiry','email-fallback','form-unavailable',...names.map(n=>n+'-error')])nodes[id]=new Element();
 const dialog=new Element(),photoNodes=Object.fromEntries(['.lightbox-image','figcaption','.lightbox-counter','.lightbox-close','.lightbox-prev','.lightbox-next'].map(k=>[k,new Element()]));
 dialog.querySelector=k=>photoNodes[k];dialog.showModal=()=>{dialog.open=true};dialog.close=async()=>{dialog.open=false;await dialog.emit('close');};
 const photos=[0,1,2].map(i=>{const e=new Element();e.href='photo-'+i+'.jpg';e.dataset.caption='Photo '+i;e.querySelector=()=>({alt:'Alt '+i});return e;});
 const context={Intl,Date,URLSearchParams,AbortController,setTimeout,clearTimeout,location:{search:''},window:{MARIANKA_CONFIG:{formspreeEndpoint:configured?'https://formspree.io/f/localtest':''},matchMedia:()=>({addEventListener(){}})},fetch:fetchImpl,document:{body:{style:{}},addEventListener(){},querySelector:q=>q==='.lightbox'&&gallery?dialog:null,querySelectorAll:q=>q==='[data-gallery]'&&gallery?photos:[],getElementById:id=>id==='inquiry-form'?(gallery?null:form):nodes[id]||null}};
 if(configured)vm.runInNewContext(configSource,context);
 vm.runInNewContext(source,context);return {form,nodes,photos,dialog,photoNodes};
}
test('Formspree: successful response sends all fields and clears only after success',async()=>{
 let sent;const {form,nodes}=environment({fetchImpl:async(url,options)=>{sent={url,...options};return {ok:true}}});
 form.elements.zprava.value='Prosím o potvrzení dostupnosti přistýlky.';
 await form.emit('submit');const data=JSON.parse(sent.body);
 assert.equal(sent.url,'https://formspree.io/f/mdeaaedo');assert.equal(sent.method,'POST');
 assert.equal(sent.headers['Content-Type'],'application/json');assert.equal(sent.headers.Accept,'application/json');
 assert.deepEqual(data,{jmeno:'Test',prijmeni:'Kontrola',email:'test@example.com',telefon:'+420 777 123 456',prijezd:'2099-12-20',odjezd:'2099-12-27',hoste:'21',zprava:'Prosím o potvrzení dostupnosti přistýlky.',_subject:'Nezávazná poptávka – Chata Mariánka',_gotcha:''});
 assert(form.resetCalled);assert.match(nodes['form-status'].textContent,/Děkujeme/);assert(!nodes['submit-inquiry'].disabled);
});
test('Formspree: HTTP and network failures keep data and offer email',async()=>{
 for(const fetchImpl of [async()=>({ok:false}),async()=>{throw new Error('offline')}]){const {form,nodes}=environment({fetchImpl});await form.emit('submit');assert.equal(form.elements.jmeno.value,'Test');assert(!form.resetCalled);assert.equal(nodes['email-fallback'].hidden,false);assert.match(nodes['form-status'].textContent,/nepodařilo/);assert(!nodes['submit-inquiry'].disabled);}
});
test('Validation blocks capacity 22, past/same dates, phone, email and whitespace name',async()=>{
 for(const [field,value] of [['hoste','22'],['hoste','0'],['hoste','2.5'],['prijezd','2000-01-01'],['odjezd','2099-12-20'],['email','not-an-email'],['telefon','123'],['jmeno','   ']]){let called=false;const {form,nodes}=environment({fetchImpl:async()=>{called=true;return {ok:true}}});form.elements[field].value=value;await form.emit('submit');assert(!called,field);assert(nodes[field+'-error'].textContent,field);}
});
test('Missing endpoint prepares mailto without any network request',async()=>{let called=false;const {form,nodes}=environment({configured:false,fetchImpl:async()=>{called=true}});await form.emit('submit');assert(!called);assert.match(nodes['email-fallback'].href,/mailto:roliska@volny.cz/);assert.match(decodeURIComponent(nodes['email-fallback'].href),/Počet hostů: 21/);assert.equal(form.elements.jmeno.value,'Test');});
test('Honeypot and double submit do not send extra requests',async()=>{let called=0,finish;const {form,nodes}=environment({fetchImpl:()=>{called++;return new Promise(r=>finish=r)}});form.elements._gotcha.value='spam';await form.emit('submit');assert.equal(called,0);form.elements._gotcha.value='';const pending=form.emit('submit');assert(nodes['submit-inquiry'].disabled);await form.emit('submit');assert.equal(called,1);finish({ok:true});await pending;});
test('Gallery: horizontal swipe changes image, vertical scroll does not, arrows wrap',async()=>{const {photos,dialog,photoNodes}=environment({gallery:true});await photos[0].emit('click');assert(dialog.open);await dialog.emit('touchstart',{touches:[{clientX:300,clientY:100}]});await dialog.emit('touchend',{changedTouches:[{clientX:80,clientY:108}]});assert.equal(photoNodes['figcaption'].textContent,'Photo 1');await dialog.emit('touchstart',{touches:[{clientX:300,clientY:100}]});await dialog.emit('touchend',{changedTouches:[{clientX:290,clientY:300}]});assert.equal(photoNodes['figcaption'].textContent,'Photo 1');await dialog.emit('keydown',{key:'ArrowLeft'});await dialog.emit('keydown',{key:'ArrowLeft'});assert.equal(photoNodes['figcaption'].textContent,'Photo 2');await photoNodes['.lightbox-close'].emit('click');assert(photos[0].focused);});
