
import { Storage } from './modules/storage.js';
import { renderCalendar } from './modules/calendar.js';
import { renderSafety } from './modules/safety.js';
import { renderWarmups } from './modules/warmups.js';
import { renderExports } from './modules/exports.js';
import { renderAbout } from './modules/help.js';
import { renderHome } from './modules/home.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./pwa/service-worker.js').catch(console.warn);
  });
}

const view = document.getElementById('view');
const routes = { home: renderHome, calendar: renderCalendar, safety: renderSafety, warmups: renderWarmups, exports: renderExports, about: renderAbout };

function routeTo(hash){
  const key = (hash || location.hash || '#home').replace('#','');
  const fn = routes[key] || renderHome;
  view.innerHTML = '';
  fn(view);
  location.hash = key;
}

document.addEventListener('click', (e)=>{
  const btn = e.target.closest('[data-route]');
  if(btn){ routeTo('#'+btn.dataset.route); }
});

(async () => {
  await Storage.init();
  if(!location.hash) location.hash = '#home';
  routeTo(location.hash);
  window.addEventListener('hashchange', ()=>routeTo(location.hash));
})();
