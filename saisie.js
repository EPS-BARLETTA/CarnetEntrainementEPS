import {store, keys} from './assets/js/storage.js';
const $ = s => document.querySelector(s);
const tiles = $('#tiles');
const formCard = $('#formCard');
const formGrid = $('#formGrid');
const actTitle = $('#actTitle');
const notesEl = $('#notes');
const btnSave = $('#btn-save');
const btnCSV = $('#btn-csv');
// Ensure identity exists
const eleve = store.get(keys.eleve, null);
if(!eleve || !eleve.nom || !eleve.prenom || !eleve.classe || !eleve.sexe){
  alert('Renseigne ton identité d\'abord.');
  location.href = 'identite.html';
}
const ACTIVITES = [
  {id:'Course', fields:[
    {k:'date', label:'Date', type:'date'},
    {k:'duree_min', label:'Durée (min)', type:'number', step:'1'},
    {k:'distance_km', label:'Distance (km)', type:'number', step:'0.01'},
    {k:'allure_sec_km', label:'Allure (sec/km)', type:'number', step:'1'},
    {k:'rpe', label:'RPE (1-10)', type:'number', min:'1', max:'10', step:'1'}
  ]},
  {id:'Musculation', fields:[
    {k:'date', label:'Date', type:'date'},
    {k:'exercice', label:'Exercice', type:'text'},
    {k:'series', label:'Séries', type:'number', step:'1'},
    {k:'reps', label:'Répétitions', type:'number', step:'1'},
    {k:'charge_kg', label:'Charge (kg)', type:'number', step:'0.5'},
    {k:'rpe', label:'RPE (1-10)', type:'number', min:'1', max:'10', step:'1'}
  ]},
  {id:'Natation', fields:[
    {k:'date', label:'Date', type:'date'},
    {k:'nage', label:'Nage', type:'text'},
    {k:'distance_m', label:'Distance (m)', type:'number', step:'1'},
    {k:'temps_sec', label:'Temps (sec)', type:'number', step:'1'},
    {k:'rpe', label:'RPE (1-10)', type:'number', min:'1', max:'10', step:'1'}
  ]},
  {id:'Sports collectifs', fields:[
    {k:'date', label:'Date', type:'date'},
    {k:'sport', label:'Sport', type:'text'},
    {k:'role', label:'Rôle', type:'text'},
    {k:'temps_jeu_min', label:'Temps de jeu (min)', type:'number', step:'1'},
    {k:'intensite', label:'Intensité (1-10)', type:'number', min:'1', max:'10', step:'1'}
  ]},
  {id:'Autre', fields:[
    {k:'date', label:'Date', type:'date'},
    {k:'intitule', label:'Intitulé', type:'text'},
    {k:'duree_min', label:'Durée (min)', type:'number', step:'1'},
    {k:'details', label:'Détails', type:'text'}
  ]}
];
function renderTiles(){
  ACTIVITES.forEach(a=>{
    const el = document.createElement('button');
    el.type='button';
    el.className = 'tile';
    el.innerHTML = `<div class="name">${a.id}</div><div class="sub">Saisir une séance</div>`;
    el.addEventListener('click', ()=> openForm(a));
    tiles.appendChild(el);
  });
}
renderTiles();
let currentAct = null;
function openForm(act){
  currentAct = act;
  actTitle.textContent = act.id;
  formGrid.innerHTML = '';
  act.fields.forEach(f=>{
    const wrap = document.createElement('div');
    wrap.innerHTML = `<div class="label">${f.label}</div>`;
    const input = document.createElement('input');
    input.className = 'input';
    input.id = f.k;
    input.type = f.type || 'text';
    if(f.step) input.step = f.step;
    if(f.min) input.min = f.min;
    if(f.max) input.max = f.max;
    if(f.type==='date' && !input.value) input.valueAsDate = new Date();
    wrap.appendChild(input);
    formGrid.appendChild(wrap);
  });
  notesEl.value = '';
  formCard.style.display = 'block';
  window.scrollTo({top: document.body.scrollHeight, behavior:'smooth'});
}
btnSave.addEventListener('click', ()=>{
  if(!currentAct){ alert('Choisis une activité.'); return; }
  const champs = {};
  currentAct.fields.forEach(f=>{
    const el = document.getElementById(f.k);
    if(!el) return;
    const v = el.value;
    if(v!=='' && v!==undefined) champs[f.k] = (f.type==='number' ? Number(v) : v);
  });
  const seance = {
    app:'CarnetEntrainementEPS',
    version:'1.0',
    eleve,
    seance:{
      date: champs.date || new Date().toISOString().slice(0,10),
      activite: currentAct.id,
      champs,
      notes: notesEl.value || ''
    }
  };
  store.set(keys.derniereSeance, seance);
  const all = store.get(keys.seances, []);
  all.push(seance);
  store.set(keys.seances, all);
  alert('✅ Séance enregistrée.');
});
btnCSV.addEventListener('click', ()=>{
  const s = store.get(keys.derniereSeance, null);
  if(!s){ alert('Aucune séance enregistrée.'); return; }
  const flat = flattenSeance(s);
  const headers = Object.keys(flat);
  const csv = [headers.join(','), headers.map(h=>csvEscape(flat[h])).join(',')].join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'seance.csv'; a.click();
  URL.revokeObjectURL(url);
});
function flattenSeance(s){
  const base = {
    Nom: s.eleve.nom || '',
    Prénom: s.eleve.prenom || '',
    Classe: s.eleve.classe || '',
    Sexe: s.eleve.sexe || '',
    Activité: s.seance.activite || '',
    Date: s.seance.date || '',
    Notes: s.seance.notes || ''
  };
  for(const [k,v] of Object.entries(s.seance.champs||{})){
    base[k] = v;
  }
  return base;
}
function csvEscape(v){
  const str = String(v==null?'':v);
  if(/[",\n]/.test(str)) return '"'+str.replace(/"/g,'""')+'"';
  return str;
}
