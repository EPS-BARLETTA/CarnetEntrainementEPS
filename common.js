
function storageKey(id, tri){ return `cahier_eps:${id}:${tri}`; }
function loadCahier(id, tri){
  const raw = localStorage.getItem(storageKey(id,tri));
  if (!raw) return {meta:{}, seances:[]};
  try { return JSON.parse(raw); } catch(e){ return {meta:{}, seances:[]}; }
}
function saveCahier(id, tri, data){
  data.meta = {...(data.meta||{}), updated_at:new Date().toISOString()};
  localStorage.setItem(storageKey(id,tri), JSON.stringify(data));
}
function todayStr(){ return new Date().toISOString().slice(0,10); }
function makeSessionId({eleveId,trimestre,date,activite}){ return `ceps-${eleveId}-${trimestre}-${date}-${activite}`.toLowerCase().replace(/\s+/g,'_'); }
function toCSV(rows){
  if(!rows.length) return "";
  const headers = Array.from(new Set(rows.flatMap(r=>Object.keys(r))));
  const esc=v=>(v==null?"":String(v).replace(/"/g,'""'));
  return [headers.join(","), ...rows.map(r=>headers.map(h=>`"${esc(r[h])}"`).join(","))].join("\n");
}
function fromCSV(text){
  const lines = text.split(/\r?\n/).filter(Boolean);
  if(!lines.length) return [];
  const headers = lines[0].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
  const rows = [];
  for (let i=1;i<lines.length;i++){
    const cols = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    const obj = {};
    headers.forEach((h,idx)=>{
      const key = h.replace(/^"|"$/g,"");
      const val = (cols[idx]||"").replace(/^"|"$/g,"").replace(/""/g,'"');
      obj[key] = val;
    });
    rows.push(obj);
  }
  return rows;
}
