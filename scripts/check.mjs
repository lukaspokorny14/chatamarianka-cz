import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const pages=walk(root).filter(p=>p.endsWith('.html'));
const titles=new Set(),descriptions=new Set(),external=new Set();let checked=0;
for(const file of pages){
 const html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,file+' H1');
 assert.match(html,/<html lang="cs">/);
 const title=html.match(/<title>(.*?)<\/title>/)[1],description=html.match(/name="description" content="([^"]*)"/)[1];
 assert(!titles.has(title),'Duplicate title');titles.add(title);assert(!descriptions.has(description),'Duplicate description');descriptions.add(description);
 assert.match(html,/rel="canonical" href="https:\/\/chatamarianka.cz\//);
 JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert(!/Lorem ipsum|href="#"|TODO/i.test(html));
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,file+' duplicate IDs');
 for(const img of html.matchAll(/<img\b[^>]*>/g))assert.match(img[0],/\balt="[^"]*"/);
 const refs=[...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(m=>m[1]);
 for(const m of html.matchAll(/\bsrcset="([^"]+)"/g))refs.push(...m[1].split(',').map(s=>s.trim().split(' ')[0]));
 for(const ref of refs){
  if(/^https?:/.test(ref)){external.add(ref);continue;}if(/^(mailto:|tel:|data:)/.test(ref))continue;
  let [target,hash]=ref.split('#');const deployBase=process.env.PUBLIC_BASE_PATH||'/';if(deployBase!=='/'&&target.startsWith(deployBase))target='/'+target.slice(deployBase.length);let dest=target?(target.startsWith('/')?path.join(root,target):path.resolve(path.dirname(file),decodeURIComponent(target))):file;
  assert(fs.existsSync(dest),file+' missing '+ref);if(fs.statSync(dest).isDirectory())dest=path.join(dest,'index.html');
  assert(fs.existsSync(dest),file+' missing index '+ref);
  if(hash&&dest.endsWith('.html'))assert(fs.readFileSync(dest,'utf8').includes('id="'+hash+'"'),file+' missing anchor '+ref);
  checked++;
 }
}
for(const file of walk(root).filter(p=>p.endsWith('.css')&&!p.endsWith('leaflet.css'))){
 const css=fs.readFileSync(file,'utf8');for(const m of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))assert(fs.existsSync(path.resolve(path.dirname(file),m[1])),file+' missing '+m[1]);
}
console.log(`${pages.length} HTML stránek, ${checked} interních odkazů a obrázkových variant: OK.`);
if(process.argv.includes('--external')){
 const links=[...external].filter(u=>!u.startsWith('https://chatamarianka.cz/')&&!u.startsWith('https://www.google.com/maps/'));
 const results=[];
 for(let i=0;i<links.length;i+=5)results.push(...await Promise.all(links.slice(i,i+5).map(async url=>{try{const r=await fetch(url,{signal:AbortSignal.timeout(20000),headers:{'User-Agent':'Mozilla/5.0 (compatible; link validation)'}});await r.body?.cancel();return {url,status:r.status};}catch(e){return {url,error:e.message};}})));
 console.log(JSON.stringify(results,null,2));
}
