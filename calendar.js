
import { Storage } from './storage.js';
import { sessionForm } from './sessionForm.js';
import { buildSessionQR } from './qr.js';

export async function renderCalendar(root){
  const me = await Storage.getProfile();
  const now = new Date();
  let month = now.getMonth();
  let year = now.getFullYear();

  const header = document.createElement('section');
  header.className = 'card';
  header.innerHTML = `
    <h2>Calendrier trimestriel</h2>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      <button class="btn" id="prev">◀</button>
      <div id="label" class="badge"></div>
      <button class="btn" id="next">▶</button>
      <span class="small">Ajoute/édite des séances par jour</span>
    </div>
  `;
  root.appendChild(header);

  const board = document.createElement('section');
  board.className = 'card';
  root.appendChild(board);

  async function render(){
    const first = new Date(year, month, 1);
    const startDay = (first.getDay()+6)%7; // Monday=0
    const daysInMonth = new Date(year, month+1, 0).getDate();
    header.querySelector('#label').textContent = first.toLocaleDateString('fr-FR',{month:'long',year:'numeric'});

    const all = await Storage.listSessions();
    const byDay = all.reduce((acc,s)=>{
      const d = s.date || '';
      acc[d] = acc[d] || []; acc[d].push(s); return acc;
    },{});

    let grid = `<div class="calendar">`;
    const heads = ['L','M','M','J','V','S','D'];
    grid += heads.map(h=>`<div class="cal-head">${h}</div>`).join('');
    for(let i=0;i<startDay;i++) grid += `<div class="day" aria-hidden="true"></div>`;
    for(let d=1; d<=daysInMonth; d++){
      const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const here = byDay[ds] || [];
      const today = ds === new Date().toISOString().slice(0,10);
      grid += `<button class="day ${today?'today':''}" data-date="${ds}">
        <div class="d">${d}</div>
        ${here.slice(0,3).map(s=>`<div class="tag">${s.type||'Séance'}</div>`).join('')}
      </button>`;
    }
    grid += `</div>`;
    board.innerHTML = grid;
  }

  header.querySelector('#prev').addEventListener('click', ()=>{ month--; if(month<0){month=11;year--;} render(); });
  header.querySelector('#next').addEventListener('click', ()=>{ month++; if(month>11){month=0;year++;} render(); });

  board.addEventListener('click', async (e)=>{
    const day = e.target.closest('.day');
    if(!day) return;
    const ds = day.getAttribute('data-date');
    const sheet = document.createElement('section'); sheet.className = 'card';
    sheet.innerHTML = `
      <h2>📅 Séance du ${new Date(ds).toLocaleDateString('fr-FR')}</h2>
      <div id="form"></div>
      <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn primary" id="save">Enregistrer</button>
        <button class="btn" id="list">Voir les séances du jour</button>
      </div>
      <div id="listbox" style="margin-top:10px"></div>
    `;
    root.appendChild(sheet);
    const form = sheet.querySelector('#form');
    const formEl = sessionForm({ onSubmit:()=>{} });
    form.appendChild(formEl);

    sheet.querySelector('#save').addEventListener('click', async ()=>{
      const type = formEl.querySelector('#stype').value;
      const fields = formEl.querySelectorAll('#dynamic input, #dynamic textarea');
      const mesures = {};
      fields.forEach(el=>{ if(el.value!==''){ const n = Number(el.value); mesures[el.id] = isNaN(n)? el.value : n; } });
      const session = { id:null, date: ds, type, mesures, notes: formEl.querySelector('#notes')?.value||'' };
      await Storage.upsertSession(session);
      alert('Séance enregistrée');
      await render();
    });

    sheet.querySelector('#list').addEventListener('click', async ()=>{
      const all = (await Storage.listSessions()).filter(s=>s.date===ds);
      if(!all.length){ sheet.querySelector('#listbox').innerHTML = '<p class="small">Aucune séance ce jour.</p>'; return; }
      const me2 = await Storage.getProfile();
      sheet.querySelector('#listbox').innerHTML = all.map(s=>{
        const data = toScanProfPayload(me2,s);
        return `<div class="qr-wrap" style="margin-bottom:12px">
          <div>
            <div class="small"><b>${s.type}</b> — ${JSON.stringify(data)}</div>
            <div class="small">${s.notes? 'Notes: '+s.notes : ''}</div>
          </div>
          <div class="qr-box" data-json='${JSON.stringify(data).replace(/'/g,"&apos;")}'></div>
          <button class="btn" data-build="${s.id}">Générer QR</button>
          <button class="btn ghost" data-del="${s.id}">Supprimer</button>
        </div>`;
      }).join('');

      sheet.querySelector('#listbox').addEventListener('click', async (ev)=>{
        const b = ev.target.closest('[data-build]');
        const d = ev.target.closest('[data-del]');
        if(b){
          const s = all.find(x=>x.id===b.dataset.build);
          const data = toScanProfPayload(me2, s);
          const box = ev.target.parentElement.querySelector('.qr-box');
          buildSessionQR(box, data);
        }
        if(d){
          await Storage.deleteSession(d.dataset.del);
          ev.target.closest('.qr-wrap').remove();
        }
      }, { once:false });
    });
  });

  await render();
}

function toScanProfPayload(me, s){
  const base = { Nom:me.Nom, Prénom:me.Prénom, Classe:me.Classe, Sexe:me.Sexe };
  const t = (s.type||'').toLowerCase();
  const m = s.mesures || {};
  if(t.includes('luc')){
    if(m.VMA!=null) base.VMA = Number(m.VMA);
    if(m.palier!=null) base.palier = Number(m.palier);
    if(m.navettes!=null) base.navettes = Number(m.navettes);
  } else if(t.includes('sprint')){
    if(m.Vitesse!=null) base.Vitesse = Number(m.Vitesse);
    if(m['Vitesse30m']!=null) base.Vitesse = Number(m['Vitesse30m']);
    if(m['Temps30m']!=null) base.Temps30m = Number(m['Temps30m']);
  } else if(t.includes('longueur')){
    if(m.Longueur!=null) base.Longueur = Number(m.Longueur);
  } else if(t.includes('course') || t.includes('endurance')){
    if(m.Distance!=null) base.Distance = Number(m.Distance);
    if(m.Vitesse!=null) base.Vitesse = Number(m.Vitesse);
  } else if(t.includes('natation')){
    if(m.Distance!=null) base.Distance = Number(m.Distance);
    if(m.Temps!=null) base.Temps = Number(m.Temps);
    if(m.Allure!=null) base.Allure = m.Allure+'';
  } else if(t.includes('escalade')){
    if(m.Voies!=null) base.Voies = Number(m.Voies);
    if(m.Niveau!=null) base.Niveau = m.Niveau+'';
  }
  return base;
}
