
import { Storage } from './storage.js';
import { buildIdentityQR, buildSessionQR } from './qr.js';
import { sessionForm } from './sessionForm.js';

export async function renderHome(root){
  const me = await Storage.getProfile();
  root.insertAdjacentHTML('beforeend', `
    <section class="card half">
      <h2>Profil élève</h2>
      <p>Renseigne ton identité pour générer les QR compatibles <span class="badge">ScanProf</span>.</p>
      <div class="form-row">
        <div><label>Nom<input class="input" id="nom" value="${me.Nom||''}"></label></div>
        <div><label>Prénom<input class="input" id="prenom" value="${me.Prénom||''}"></label></div>
        <div><label>Classe<input class="input" id="classe" value="${me.Classe||''}"></label></div>
        <div><label>Sexe
          <select class="input" id="sexe">
            <option ${me.Sexe==='F'?'selected':''}>F</option>
            <option ${me.Sexe==='M'?'selected':''}>M</option>
          </select>
        </label></div>
        <div><label>Activité
          <select class="input" id="activite">
            <option ${me.Activité==='Course'?'selected':''}>Course</option>
            <option ${me.Activité==='Luc Léger'?'selected':''}>Luc Léger</option>
            <option ${me.Activité==='Sprint 30m'?'selected':''}>Sprint 30m</option>
            <option ${me.Activité==='Saut en longueur'?'selected':''}>Saut en longueur</option>
            <option ${me.Activité==='Natation'?'selected':''}>Natation</option>
            <option ${me.Activité==='Escalade'?'selected':''}>Escalade</option>
          </select>
        </label></div>
      </div>
      <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap">
        <button class="btn primary" id="save">Enregistrer</button>
        <button class="btn" id="qrid">QR Identité</button>
      </div>
      <div id="qr-identity" class="qr-wrap" style="margin-top:10px; display:none"></div>
    </section>

    <section class="card half">
      <h2>Nouvelle séance rapide</h2>
      <div id="quick-form"></div>
    </section>

    <section class="card">
      <h2>Dernières séances</h2>
      <div id="last-sessions"></div>
    </section>
  `);

  root.querySelector('#save').addEventListener('click', async ()=>{
    const profile = {
      Nom: root.querySelector('#nom').value.trim(),
      Prénom: root.querySelector('#prenom').value.trim(),
      Classe: root.querySelector('#classe').value.trim(),
      Sexe: root.querySelector('#sexe').value,
      Activité: root.querySelector('#activite').value
    };
    await Storage.saveProfile(profile);
    alert('Profil enregistré.');
  });

  root.querySelector('#qrid').addEventListener('click', async ()=>{
    const me2 = await Storage.getProfile();
    const qrBox = root.querySelector('#qr-identity');
    qrBox.style.display='flex';
    qrBox.innerHTML='';
    const data = { Nom:me2.Nom, Prénom:me2.Prénom, Classe:me2.Classe, Sexe:me2.Sexe };
    buildIdentityQR(qrBox, data);
  });

  const qf = root.querySelector('#quick-form');
  qf.appendChild(sessionForm({
    onSubmit: async (payload)=>{
      const me3 = await Storage.getProfile();
      const s = {
        id: null,
        date: new Date().toISOString().slice(0,10),
        type: me3.Activité,
        mesures: payload,
        notes: ''
      };
      await Storage.upsertSession(s);
      alert('Séance enregistrée.');
      const box = root.querySelector('#last-sessions');
      box.innerHTML = '';
      await renderLastSessions(box);
    }
  }));

  await renderLastSessions(root.querySelector('#last-sessions'));
}

async function renderLastSessions(el){
  const { listSessions, getProfile } = Storage;
  const me = await getProfile();
  const all = (await listSessions()).sort((a,b)=>b.id.localeCompare(a.id)).slice(0,6);
  if(!all.length){ el.innerHTML = '<p class="small">Aucune séance pour l’instant.</p>'; return; }
  const rows = all.map(s=>{
    const desc = Object.entries(s.mesures).map(([k,v])=>`${k}: ${v}`).join(' · ');
    return `<tr>
      <td>${s.date}</td>
      <td><span class="badge">${s.type}</span></td>
      <td>${desc}</td>
      <td><button class="btn" data-qr="${s.id}">QR séance</button></td>
      <td><button class="btn ghost" data-del="${s.id}">Supprimer</button></td>
    </tr>`;
  }).join('');
  el.innerHTML = `<table>
    <thead><tr><th>Date</th><th>Type</th><th>Données</th><th>QR</th><th></th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
  el.addEventListener('click', async (e)=>{
    const id = e.target.getAttribute('data-qr');
    const del = e.target.getAttribute('data-del');
    if(id){
      const s = await Storage.getSession(id);
      const box = document.createElement('div'); box.className='qr-wrap'; 
      const data = toScanProfPayload(me, s);
      buildSessionQR(box, data);
      e.target.closest('tr').after(document.createElement('tr')).nextSibling.innerHTML = `<td colspan="5">${box.outerHTML}</td>`;
    }
    if(del){
      if(confirm('Supprimer cette séance ?')){
        await Storage.deleteSession(del);
        await (async ()=>{ el.innerHTML=''; await renderLastSessions(el); })();
      }
    }
  }, { once:false });
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
