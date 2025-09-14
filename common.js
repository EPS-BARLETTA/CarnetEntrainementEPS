
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
  // simple CSV parser (comma, quote)
  const lines = text.split(/\r?\n/).filter(Boolean);
  if(!lines.length) return [];
  const headers = lines[0].split(",").map(h=>h.replace(/^"|"$/g,""));
  const rows = [];
  for (let i=1;i<lines.length;i++){
    let row = []; let cur=""; let q=false;
    const s = lines[i];
    for (let j=0;j<s.length;j++){
      const c=s[j];
      if (c=='"'){ if (q && s[j+1]=='"'){cur+='"'; j++;} else { q=!q; } }
      else if (c=="," && !q){ row.push(cur); cur=""; }
      else { cur+=c; }
    }
    row.push(cur);
    const obj={}; headers.forEach((h,k)=>obj[h.replace(/^"|"$/g,"")] = (row[k]||"").replace(/^"|"$/g,""));
    rows.push(obj);
  }
  return rows;
}
