
document.addEventListener("DOMContentLoaded", ()=>{
  const nom = localStorage.getItem("ceps:last_nom")||"";
  const prenom = localStorage.getItem("ceps:last_prenom")||"";
  const classe = localStorage.getItem("ceps:last_classe")||"";
  const tri = localStorage.getItem("ceps:last_tri")||"";
  const apsa = localStorage.getItem("ceps:last_apsa")||"";
  document.getElementById("who").textContent = `${nom} ${prenom} — ${classe} — ${tri} — ${apsa}`;

  const ta = document.getElementById("notes");
  const autoGrow = ()=>{ ta.style.height="auto"; ta.style.height=(ta.scrollHeight+6)+"px"; };
  ta.addEventListener("input", autoGrow); autoGrow();

  function load(){ return loadCahier(nom, prenom, classe, tri); }
  function save(d){ return saveCahier(nom, prenom, classe, tri, d); }

  function renderTable(){
    const rows = (load().seances)||[];
    const tb = document.getElementById("tbody"); tb.innerHTML="";
    rows.forEach((r,i)=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${i+1}</td><td>${r.Date||""}</td><td>${r.Semaine||""}</td><td>${r.Activité||""}</td><td>${(r.Texte||"").slice(0,40)}${(r.Texte||"").length>40?"…":""}</td>`;
      tb.appendChild(tr);
    });
  }
  renderTable();

  function buildRowFromCurrent(){
    const notes = (ta.value||"").trim();
    const now = new Date();
    return {
      "Nom": nom, "Prénom": prenom, "Classe": classe, "Trimestre": tri,
      "Date": now.toISOString().slice(0,10),
      "Semaine": isoWeek(now),
      "Activité": apsa,
      "Texte": notes
    };
  }

  document.getElementById("save_only").addEventListener("click", ()=>{
    const row = buildRowFromCurrent();
    const d = load(); d.seances = d.seances||[]; d.seances.push(row); save(d); renderTable();
    alert("Séance enregistrée.");
  });

  document.getElementById("open_qr").addEventListener("click", ()=>{
    const row = buildRowFromCurrent();
    const payload = JSON.stringify(row);
    // store payload in sessionStorage and open QR page
    try{ sessionStorage.setItem("ceps:qr_payload", payload); }catch(e){}
    location.href = "qr.html";
  });

  document.getElementById("export_csv").addEventListener("click", ()=>{
    const rows = (load().seances)||[];
    if(!rows.length){ alert("Aucune séance à exporter."); return; }
    const csv = toCSV(rows);
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `CarnetEPS_${nom}_${prenom}_${classe}_${tri}.csv`; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
    alert("Astuce : enregistre le CSV « Sur mon iPad » (pas iCloud).");
  });

  document.getElementById("import_csv").addEventListener("change",(ev)=>{
    const f = ev.target.files?.[0]; if(!f) return;
    const fr = new FileReader();
    fr.onload = ()=>{
      try{
        const rows = fromCSV(fr.result);
        const d = load(); d.seances = rows; save(d); renderTable();
        alert("CSV importé.");
      }catch(e){ alert("Erreur CSV."); }
    };
    fr.readAsText(f);
  });
});
