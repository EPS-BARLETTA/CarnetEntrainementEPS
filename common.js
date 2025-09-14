
function keyBy(eleve){ return `cahier_eps:${eleve.nom}:${eleve.prenom}:${eleve.classe}:${eleve.trimestre}`; }
function loadCahier(eleve){
  const raw = localStorage.getItem(keyBy(eleve));
  if (!raw) return {meta:{}, seances:[]};
  return JSON.parse(raw);
}
function saveCahier(eleve,data){
  localStorage.setItem(keyBy(eleve), JSON.stringify(data));
}
function toCSV(rows){
  if(!rows.length) return "";
  const headers = Array.from(new Set(rows.flatMap(r=>Object.keys(r))));
  return [headers.join(","),...rows.map(r=>headers.map(h=>r[h]||"").join(","))].join("\n");
}
function fromCSV(text){
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split(",");
  return lines.slice(1).map(l=>{const vals=l.split(",");let o={};headers.forEach((h,i)=>o[h]=vals[i]);return o;});
}
