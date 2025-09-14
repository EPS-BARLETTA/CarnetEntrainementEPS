
const QR_MAX = 2000;
let lastCanvas = null;

document.addEventListener("DOMContentLoaded", ()=>{
  const nom = localStorage.getItem("ceps:last_nom")||"";
  const prenom = localStorage.getItem("ceps:last_prenom")||"";
  const classe = localStorage.getItem("ceps:last_classe")||"";
  const tri = localStorage.getItem("ceps:last_tri")||"";
  const apsa = localStorage.getItem("ceps:last_apsa")||"";
  document.getElementById("who").textContent = `${nom} ${prenom} — ${classe} — ${tri} — ${apsa}`;

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

  function buildRow(){
    const notes = (document.getElementById("notes").value||"").trim();
    const now = new Date();
    const row = {
      "Nom": nom, "Prénom": prenom, "Classe": classe, "Trimestre": tri,
      "Date": now.toISOString().slice(0,10),
      "Semaine": isoWeek(now),
      "Activité": apsa,
      "Texte": notes
    };
    return row;
  }

  function updateCounter(payloadStr){
    const bytes = new Blob([payloadStr]).size;
    const bar = document.getElementById("qr_bar");
    const info = document.getElementById("qr_info");
    const pct = Math.min(100, Math.round(bytes/QR_MAX*100));
    bar.style.width = pct + "%";
    info.textContent = `${bytes} / ${QR_MAX} octets`;
    return bytes <= QR_MAX;
  }

  document.addEventListener("input", ()=> updateCounter(JSON.stringify(buildRow())), true);

  document.getElementById("save").addEventListener("click", ()=>{
    const row = buildRow();
    const payload = JSON.stringify(row);
    if(!updateCounter(payload)){ alert("Texte trop long pour un QR fiable. Raccourcis."); return; }
    const d = load(); d.seances = d.seances||[]; d.seances.push(row); save(d); renderTable();

    const host = document.getElementById("qr"); host.innerHTML="";
    const canvas = window.QRCodeGen(payload);
    host.appendChild(canvas);
    lastCanvas = canvas;
    window.scrollTo({top: host.getBoundingClientRect().top + window.scrollY - 40, behavior:"smooth"});
  });

  document.getElementById("download_qr").addEventListener("click", ()=>{
    if(!lastCanvas){ alert("Génère d’abord le QR."); return; }
    const a = document.createElement("a");
    a.href = lastCanvas.toDataURL("image/png");
    a.download = `QR_${nom}_${prenom}_${classe}_${tri}.png`; a.click();
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
