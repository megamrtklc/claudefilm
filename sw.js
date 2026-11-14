const V="sinemo-v2",IMGC="sinemo-img-v1",SHELL=["./","index.html","manifest.json","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V&&x!=IMGC).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const trim=async(n,m)=>{const c=await caches.open(n),k=await c.keys();if(k.length>m)await Promise.all(k.slice(0,k.length-m).map(x=>c.delete(x)))};
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);if(r.method!="GET")return;
if(u.hostname=="image.tmdb.org"){e.respondWith(caches.open(IMGC).then(async c=>{const h=await c.match(r);if(h)return h;try{const n=await fetch(r);if(n.ok||n.type=="opaque"){c.put(r,n.clone());trim(IMGC,200)}return n}catch(x){return Response.error()}}));return}
if(u.hostname=="api.themoviedb.org"){e.respondWith(fetch(r).then(n=>{if(n.ok){const cp=n.clone();caches.open(V).then(c=>c.put(r,cp))}return n}).catch(()=>caches.match(r)));return}
if(u.origin==location.origin){e.respondWith(fetch(r).then(n=>{if(n.ok){const cp=n.clone();caches.open(V).then(c=>c.put(r,cp))}return n}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))))}
});
