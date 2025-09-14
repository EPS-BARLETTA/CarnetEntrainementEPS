
document.addEventListener("DOMContentLoaded", ()=>{
  document.getElementById("build").addEventListener("click", ()=>{
    const nom = (document.getElementById("nom").value||"").trim().toUpperCase();
    const prenom = (document.getElementById("prenom").value||"").trim();
    const classe = (document.getElementById("classe").value||"").trim();
    const tri = (document.getElementById("trimestre").value||"").trim();
    if(!nom||!prenom||!classe||!tri){ alert("Complète les paramètres."); return; }
    const data = JSON.parse(localStorage.getItem(`cahier_eps:${nom}:${prenom}:${classe}:${tri}`)||'{"seances":[]}');
    const rows = data.seances||[];
    const thead=document.getElementById("thead"), tbody=document.getElementById("tbody");
    thead.innerHTML=""; tbody.innerHTML="";
    if(rows.length){
      const headers = Array.from(new Set(rows.flatMap(r=>Object.keys(r))));
      const trh=document.createElement("tr"); headers.forEach(h=>{ const th=document.createElement("th"); th.textContent=h; trh.appendChild(th); }); thead.appendChild(trh);
      rows.forEach(r=>{ const tr=document.createElement("tr"); headers.forEach(h=>{ const td=document.createElement("td"); td.textContent=r[h]??""; tr.appendChild(td); }); tbody.appendChild(tr); });
    } else {
      thead.innerHTML="<tr><th>Info</th></tr>"; tbody.innerHTML="<tr><td>Aucune séance.</td></tr>";
    }
    document.getElementById("preview").style.display="block";
    window.scrollTo({top:document.body.scrollHeight, behavior:"smooth"});
  });
  document.getElementById("print").addEventListener("click", ()=> window.print());
});
