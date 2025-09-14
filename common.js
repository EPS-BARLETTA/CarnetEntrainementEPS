
function storageKey(id, tri){ return `cahier_eps:${id}:${tri}`; }
function loadCahier(id, tri){
  const raw = localStorage.getItem(storageKey(id,tri));
  if (!raw) return {meta:{created_at:new Date().toISOString()}, seances:[]};
  try { return JSON.parse(raw); } catch(e){ return {meta:{}, seances:[]}; }
}
function saveCahier(id, tri, data){
  data.meta = {...(data.meta||{}), updated_at:new Date().toISOString()};
  localStorage.setItem(storageKey(id,tri), JSON.stringify(data));
}
function todayStr(){ return new Date().toISOString().slice(0,10); }
function makeSessionId({eleveId,trimestre,date,activite}){ return `ceps-${eleveId}-${trimestre}-${date}-${activite}`.toLowerCase().replace(/\s+/g,'_'); }
