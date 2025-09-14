
const QR_MAX = 2000; // indicatif (QR v~10 M)
function keyBy(nom, prenom, classe, tri){ return `cahier_eps:${nom}:${prenom}:${classe}:${tri}`; }
function loadCahier(nom, prenom, classe, tri){
  const raw = localStorage.getItem(keyBy(nom, prenom, classe, tri));
  if(!raw) return { meta:{}, seances:[] };
  try { return JSON.parse(raw); } catch(e){ return {meta:{}, seances:[]}; }
}
function saveCahier(nom, prenom, classe, tri, data){
  data.meta = {...(data.meta||{}), updated_at:new Date().toISOString()};
  localStorage.setItem(keyBy(nom, prenom, classe, tri), JSON.stringify(data));
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
function isoWeek(d){
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1)/7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2,'0')}`;
}
function makeBadge(element, used){
  const pct = used/QR_MAX;
  element.classList.remove("green","orange","red");
  if(pct < 0.7) element.classList.add("green");
  else if(pct < 0.95) element.classList.add("orange");
  else element.classList.add("red");
  element.textContent = `${used} / ${QR_MAX} octets`;
}
