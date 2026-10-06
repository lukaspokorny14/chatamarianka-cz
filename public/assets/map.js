'use strict';
(()=>{
 const assets=new URL('.',document.currentScript.src);
 const loadButton=document.getElementById('load-map'),target=document.getElementById('places-map'),gate=document.querySelector('.map-gate'),status=document.getElementById('map-status');
 if(!loadButton)return;
 let map=null,places=[],markers=[],activeFilter='all',pendingPlace=null,loading=false;
 const home=[50.768718,15.292308];
 function ensureScript(){return new Promise((resolve,reject)=>{if(window.L){resolve();return;}const script=document.createElement('script');script.src=new URL('vendor/leaflet.js',assets);script.onload=resolve;script.onerror=()=>{script.remove();reject(new Error('Map library unavailable'));};document.head.append(script);});}
 function filter(){if(!map)return;markers.forEach(({marker,place})=>{if(!place||activeFilter==='all'||place.seasons.includes(activeFilter)){marker.addTo(map);}else{marker.remove();}});}
 function fit(){if(!map)return;const points=[home,...places.filter(p=>activeFilter==='all'||p.seasons.includes(activeFilter)).map(p=>[p.lat,p.lon])];map.fitBounds(points,{padding:[35,35],maxZoom:14});}
 function popup(p){const el=document.createElement('div'),title=document.createElement('strong'),text=document.createElement('p'),a=document.createElement('a');title.textContent=p.name;text.textContent=`${p.distance.toLocaleString('cs-CZ')} km vzdušnou čarou od chaty`;a.href='#'+(p.seasons.includes(activeFilter)?activeFilter:p.seasons[0])+'-'+p.id;a.textContent='Přečíst tip na výlet';el.append(title,text,a);return el;}
 function focusPlace(){if(!map||!pendingPlace)return;const entry=markers.find(m=>m.place?.id===pendingPlace);if(entry){if(!map.hasLayer(entry.marker)){activeFilter='all';syncButtons();filter();}map.setView(entry.marker.getLatLng(),13);entry.marker.openPopup();}pendingPlace=null;}
 function syncButtons(){document.querySelectorAll('[data-map-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mapFilter===activeFilter)));}
 loadButton.addEventListener('click',async()=>{
  if(map||loading)return;loading=true;loadButton.disabled=true;loadButton.textContent='Načítání mapy…';
  try{
   const [_,response]=await Promise.all([ensureScript(),fetch(new URL('places.json',assets))]);if(!response.ok)throw new Error('Points unavailable');places=await response.json();
   target.hidden=false;gate.hidden=true;map=L.map(target,{scrollWheelZoom:false,zoomControl:true});
   const tiles=L.tileLayer(window.MARIANKA_CONFIG?.mapTileUrl||'https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'}).addTo(map);
   tiles.on('tileerror',()=>{status.textContent='Některé mapové podklady se nepodařilo načíst. Tipy a odkazy na plánování tras najdete výše.';});
   const homeMarker=L.marker(home,{title:'Chata Mariánka – výchozí bod',alt:'Chata Mariánka',icon:L.divIcon({html:'<div class="map-dot home-dot"><span>M</span></div>',className:'custom-pin',iconSize:[39,39],iconAnchor:[19,39]})}).addTo(map).bindPopup('<strong>Chata Mariánka</strong>Mariánská Hora 7<br>Výchozí bod vašich výletů');markers.push({marker:homeMarker});
   places.forEach((p,i)=>{const marker=L.marker([p.lat,p.lon],{title:p.name,alt:p.name,icon:L.divIcon({html:`<div class="map-dot"><span>${i+1}</span></div>`,className:'custom-pin',iconSize:[34,34],iconAnchor:[17,34]})}).bindPopup(()=>popup(p));markers.push({marker,place:p});});
   filter();fit();focusPlace();status.textContent='Mapu můžete ovládat myší, dotykem i klávesnicí. Pro přiblížení použijte tlačítka + a −.';
  }catch(error){if(map){map.remove();map=null;markers=[];}target.hidden=true;gate.hidden=false;loadButton.disabled=false;loadButton.textContent='Zkusit mapu znovu';status.textContent='Mapu se nepodařilo načíst. Zkuste to znovu nebo použijte odkazy na plánování tras u jednotlivých míst.';}
  finally{loading=false;}
 });
 document.querySelectorAll('[data-map-filter]').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.mapFilter;syncButtons();filter();fit();}));
 document.getElementById('map-reset').addEventListener('click',()=>{activeFilter='all';syncButtons();if(map){filter();fit();map.closePopup();}else{loadButton.focus();}});
 document.querySelectorAll('.show-place').forEach(b=>b.addEventListener('click',()=>{pendingPlace=b.dataset.place;document.getElementById('mapa').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});if(map)focusPlace();else{loadButton.focus({preventScroll:true});status.textContent='Pro zobrazení vybraného místa nejprve načtěte mapu.';}}));
})();
