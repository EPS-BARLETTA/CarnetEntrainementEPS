import {store, keys} from './assets/js/storage.js';
const cal = document.getElementById('cal');
const list = document.getElementById('list');
const monthLbl = document.getElementById('monthLbl');
const btnPrev = document.getElementById('prev');
const btnNext = document.getElementById('next');
let current = new Date();
current.setDate(1);
btnPrev.addEventListener('click', ()=>{ current.setMonth(current.getMonth()-1); render(); });
btnNext.addEventListener('click', ()=>{ current.setMonth(current.getMonth()+1); render(); });
function render(){
  const y = current.getFullYear(), m = current.getMonth();
  monthLbl.textContent = current.toLocaleDateString('fr-FR', {month:'long', year:'numeric'});
  const firstDay = new Date(y,m,1).getDay() || 7;
  const daysInMonth = new Date(y,m+1,0).getDate();
  const seances = store.get(keys.seances, []);
  const byDate = {};
  seances.forEach(s=>{
    const d = (s.seance?.date || '').slice(0,10);
    if(!byDate[d]) byDate[d]=[];
    byDate[d].push(s);
  });
  const grid = document.createElement('div');
  grid.className = 'calendar';
  // headers
  ['L','M','M','J','V','S','D'].forEach(h=>{
    const hd = document.createElement('div'); hd.className='day'; hd.style.background='transparent'; hd.style.border='none'; hd.textContent=h; grid.appendChild(hd);
  });
  // blanks till firstDay (Mon=1)
  const blanks = (firstDay===1?0:firstDay-1);
  for(let i=0;i<blanks;i++){ const d=document.createElement('div'); d.className='day'; d.style.visibility='hidden'; grid.appendChild(d); }
  for(let d=1; d<=daysInMonth; d++){
    const dateStr = new Date(y,m,d).toISOString().slice(0,10);
    const cell = document.createElement('div'); cell.className='day';
    const top = document.createElement('div'); top.className='d'; top.textContent = d;
    cell.appendChild(top);
    if(byDate[dateStr]?.length){
      const dot = document.createElement('span'); dot.className='badge-dot'; dot.title = byDate[dateStr].length+' séance(s)';
      cell.appendChild(dot);
      cell.style.cursor='pointer';
      cell.addEventListener('click', ()=> showList(dateStr, byDate[dateStr]));
    }
    grid.appendChild(cell);
  }
  cal.innerHTML=''; cal.appendChild(grid);
  // init list
  list.innerHTML = '<div class="sub">Sélectionne un jour pour voir les détails.</div>';
}
function showList(dateStr, arr){
  const lines = arr.map(s=>{
    const act = s.seance?.activite || '—';
    const notes = s.seance?.notes || '';
    return `<div class="card" style="margin:6px 0">
      <div class="row"><strong>${act}</strong><span class="badge">${dateStr}</span></div>
      <div class="sub">${notes?notes.replace(/</g,'&lt;'):''}</div>
    </div>`;
  }).join('');
  list.innerHTML = lines || '<div class="sub">Aucune séance ce jour.</div>';
}
render();
