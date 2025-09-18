import {store, keys} from './assets/js/storage.js';
const $ = sel => document.querySelector(sel);
const inputs = ['nom','prenom','classe','sexe'].map(id=>$('#'+id));
const status = $('#status');
const btnNext = $('#btn-next');
const btnReset = $('#btn-reset');
// hydrate
const saved = store.get(keys.eleve, {});
inputs.forEach(i=>{ if(saved[i.id]!==undefined) i.value = saved[i.id]; });
renderStatus();
// autosave
inputs.forEach(i=> i.addEventListener('input', ()=>{
  const eleve = Object.fromEntries(inputs.map(x=>[x.id, x.value.trim()]));
  store.set(keys.eleve, eleve);
  renderStatus();
}));
btnNext.addEventListener('click', ()=>{
  if(!isComplete()){
    alert('Merci de compléter toutes les informations.');
    return;
  }
  location.href = 'saisie.html';
});
btnReset.addEventListener('click', ()=>{
  store.remove(keys.eleve); store.remove(keys.derniereSeance);
  inputs.forEach(i=> i.value=''); renderStatus();
});
function isComplete(){
  const e = store.get(keys.eleve, {});
  return e.nom && e.prenom && e.classe && e.sexe;
}
function renderStatus(){
  if(isComplete()){
    status.textContent = '✅ Enregistré';
  } else {
    status.textContent = '⏳ En attente';
  }
}
