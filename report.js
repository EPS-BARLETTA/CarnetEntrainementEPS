
function storageKey(id, tri){ return `cahier_eps:${id}:${tri}`; }
function loadCahier(id, tri){
  const raw = localStorage.getItem(storageKey(id,tri));
  if (!raw) return {meta:{},seances:[]};
  try{ return JSON.parse(raw);}catch(e){ return {meta:{},seances:[]}; }
}
document.addEventListener("DOMContentLoaded", ()=>{
  document.getElementById("build").addEventListener("click", ()=>{
    const id = document.getElementById("eleve_id").value.trim();
    const tri = document.getElementById("trimestre").value.trim();
    if (!id || !tri){ alert("ID et Trimestre requis."); return; }
    const data = loadCahier(id, tri);
    const rows = data.seances || [];
    // résumé
    const resume = document.getElementById("resume");
    resume.innerHTML = "";
    const total = rows.length;
    const activites = [...new Set(rows.map(r=>r["Activité"]))];
    const div = document.createElement("div");
    div.innerHTML = `<div><strong>ID :</strong> ${id}</div>
                     <div><strong>Trimestre :</strong> ${tri}</div>
                     <div><strong>Séances :</strong> ${total}</div>
                     <div><strong>Activités :</strong> ${activites.join(", ")}</div>`;
    resume.appendChild(div);
    // table
    const thead = document.getElementById("thead");
    const tbody = document.getElementById("tbody");
    thead.innerHTML = ""; tbody.innerHTML = "";
    if (rows.length){
      const headers = Array.from(new Set(rows.flatMap(r=>Object.keys(r))));
      const trh = document.createElement("tr");
      headers.forEach(h=>{ const th=document.createElement("th"); th.textContent=h; trh.appendChild(th); });
      thead.appendChild(trh);
      rows.forEach(r=>{
        const tr = document.createElement("tr");
        headers.forEach(h=>{ const td=document.createElement("td"); td.textContent=r[h]??""; tr.appendChild(td); });
        tbody.appendChild(tr);
      });
    }
    document.getElementById("preview").style.display = "block";
    window.scrollTo({top: document.body.scrollHeight, behavior:"smooth"});
  });
  document.getElementById("print").addEventListener("click", ()=> window.print());
});
