const C='cc3';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
// App files: network first, cache as the offline fallback. Firebase library files: cache first so the app can start offline.
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!='GET')return;const u=new URL(r.url);
 if(u.hostname=='www.gstatic.com'&&u.pathname.startsWith('/firebasejs/')){
  e.respondWith(caches.open(C).then(c=>c.match(r).then(m=>m||fetch(r).then(x=>{c.put(r,x.clone());return x}))));return}
 if(u.origin==location.origin){
  e.respondWith(fetch(r.url,{cache:'no-cache'}).then(x=>{const k=x.clone();caches.open(C).then(c=>c.put(r.mode=='navigate'?'./index.html':r,k));return x}).catch(()=>caches.match(r.mode=='navigate'?'./index.html':r)))}});
// Phone notifications (sent by the Cloud Function in SETUP.md)
self.addEventListener('push',e=>{let d={};try{const j=e.data.json();d=j.data||j.notification||j}catch(x){}
 e.waitUntil(self.registration.showNotification(d.title||'SiivousNinjat Oy',{body:d.body||'',icon:'icon-192.png',badge:'icon-192.png',data:{tab:d.tab||''}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();
 e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>l.length?l[0].focus():clients.openWindow('./')))});
