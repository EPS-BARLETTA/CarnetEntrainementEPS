
document.addEventListener("DOMContentLoaded", ()=>{
  const build = document.getElementById("build");
  const printBtn = document.getElementById("print");
  build.addEventListener("click", ()=>{
    const id = document.getElementById("eleve_id").value.trim();
    const tri = document.getElementById("trimestre").value.trim();
    if(!id||!tri){ alert("ID et Trimestre requis."); return; }
    const data = loadCahier(id, tri);
    const rows = data.seances || [];
    const resume = document.getElementById("resume"); resume.innerHTML="";
    const div = document.createElement("div");
    const activites = [...new Set(rows.map(r=>r["Activité"]))];
    div.className="card"; // nested card look
    div.style.padding="12px";
    div.innerHTML = `<div><strong>ID :</strong> ${id}</div>
                     <div><strong>Trimestre :</strong> ${tri}</div>
                     <div><strong>Séances :</strong> ${rows.length}</div>
                     <div><strong>Activités :</strong> ${activites.join(", ")||"-"}</div>`;
    resume.appendChild(div);

    const thead = document.getElementById("thead");
    const tbody = document.getElementById("tbody");
    thead.innerHTML=""; tbody.innerHTML="";
    if(rows.length){
      const headers = Array.from(new Set(rows.flatMap(r=>Object.keys(r))));
      const trh = document.createElement("tr");
      headers.forEach(h=>{ const th=document.createElement("th"); th.textContent=h; trh.appendChild(th); });
      thead.appendChild(trh);
      rows.forEach(r=>{
        const tr = document.createElement("tr");
        headers.forEach(h=>{ const td=document.createElement("td"); td.textContent=r[h]??""; tr.appendChild(td); });
        tbody.appendChild(tr);
      });
    } else {
      thead.innerHTML = "<tr><th>Info</th></tr>";
      tbody.innerHTML = "<tr><td>Aucune séance.</td></tr>";
    }
    document.getElementById("preview").style.display="block";
    window.scrollTo({top:document.body.scrollHeight, behavior:"smooth"});
  });
  printBtn.addEventListener("click", ()=> window.print());
});
