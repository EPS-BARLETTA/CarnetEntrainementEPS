
import { Storage } from './storage.js';

export async function renderExports(root){
  const me = await Storage.getProfile();
  root.insertAdjacentHTML('beforeend', `
    <section class="card">
      <h2>Exports & sauvegardes</h2>
      <div class="form-row">
        <div><button class="btn" id="csv">Exporter CSV (élève)</button></div>
        <div><button class="btn" id="json">Sauvegarder JSON</button></div>
      </div>
      <p class="small">Les QR Codes identité et séance se génèrent depuis l’accueil ou le calendrier.</p>
      <div id="out"></div>
    </section>
  `);

  root.querySelector('#csv').addEventListener('click', async ()=>{
    const rows = await buildCSV();
    const blob = new Blob([rows], { type:'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Carnet_${me.Nom}_${me.Prénom}.csv`;
    a.click();
  });

  root.querySelector('#json').addEventListener('click', async ()=>{
    const data = await buildJSON();
    const blob = new Blob([JSON.stringify(data,null,2)], { type:'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Carnet_${me.Nom}_${me.Prénom}.json`;
    a.click();
  });
}

async function buildCSV(){
  const me = await Storage.getProfile();
  const all = await Storage.listSessions();
  const dyn = new Set();
  all.forEach(s=>Object.keys(s.mesures||{}).forEach(k=>dyn.add(k)));
  const head = ['Nom','Prénom','Classe','Sexe','Activité','Date', ...Array.from(dyn)];
  const lines = [head.join(',')];
  all.forEach(s=>{
    const base = [me.Nom, me.Prénom, me.Classe, me.Sexe, s.type, s.date];
    const vals = Array.from(dyn).map(k=> formatCSV(s.mesures?.[k] ?? ''));
    lines.push([...base, ...vals].join(','));
  });
  return lines.join('\n');
}

function formatCSV(v){
  if(v==null) return '';
  const s = String(v).replace(/"/g,'""');
  if(/[,"\n]/.test(s)) return `"${s}"`;
  return s;
}

async function buildJSON(){
  const me = await Storage.getProfile();
  const all = await Storage.listSessions();
  return { eleve: me, seances: all };
}
