
const CACHE = 'carnet-eps-v1';
const ASSETS = [
  '/', '/index.html',
  '/styles/style.css',
  '/js/app.js',
  '/js/modules/storage.js',
  '/js/modules/calendar.js',
  '/js/modules/sessionForm.js',
  '/js/modules/qr.js',
  '/js/modules/safety.js',
  '/js/modules/warmups.js',
  '/js/modules/exports.js',
  '/js/modules/help.js',
  '/safety/course.html','/safety/escalade.html','/safety/natation.html',
  '/warmups/presets.json'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE && caches.delete(k)))));
});
self.addEventListener('fetch', (e)=>{
  const url = new URL(e.request.url);
  if(ASSETS.includes(url.pathname)){
    e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
  } else {
    e.respondWith(fetch(e.request).catch(()=>caches.match('/index.html')));
  }
});
