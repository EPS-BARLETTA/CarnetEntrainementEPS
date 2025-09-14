
function keyByName(nom, prenom, classe, tri){ return `cahier_eps:${nom}:${prenom}:${classe}:${tri}`; }
function loadCahier(nom, prenom, classe, tri){
  const raw = localStorage.getItem(keyByName(nom, prenom, classe, tri));
  if (!raw) return {meta:{}, seances:[]};
  try { return JSON.parse(raw); } catch(e){ return {meta:{}, seances:[]}; }
}
function saveCahier(nom, prenom, classe, tri, data){
  data.meta = {...(data.meta||{}), updated_at:new Date().toISOString()};
  localStorage.setItem(keyByName(nom, prenom, classe, tri), JSON.stringify(data));
}
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
