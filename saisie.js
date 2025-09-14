
const QR_MAX = 2000;
let lastCanvas = null;
let lastSavedRow = null;

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

  function buildRowFromCurrent(){
    const notes = (document.getElementById("notes").value||"").trim();
    const now = new Date();
    return {
      "Nom": nom, "Prénom": prenom, "Classe": classe, "Trimestre": tri,
      "Date": now.toISOString().slice(0,10),
      "Semaine": isoWeek(now),
      "Activité": apsa,
      "Texte": notes
    };
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

  function drawQR(payload){
    const host = document.getElementById("qr"); host.innerHTML="";
    const canvas = window.QRCodeGen(payload);
    host.appendChild(canvas);
    lastCanvas = canvas;
  }

  // Live QR
  document.addEventListener("input", ()=>{
    const live = document.getElementById("live_qr").checked;
    const row = buildRowFromCurrent();
    const payload = JSON.stringify(row);
    updateCounter(payload);
    if(live){
      if(!updateCounter(payload)) return;
      drawQR(payload);
    }
  }, true);

  // Save only
  document.getElementById("save_only").addEventListener("click", ()=>{
    const row = buildRowFromCurrent();
    const d = load(); d.seances = d.seances||[]; d.seances.push(row); save(d); renderTable();
    lastSavedRow = row;
    alert("Séance enregistrée.");
  });

  // Generate QR from current text
  document.getElementById("gen_current").addEventListener("click", ()=>{
    const row = buildRowFromCurrent();
    const payload = JSON.stringify(row);
    if(!updateCounter(payload)){ alert("Texte trop long pour un QR fiable. Raccourcis."); return; }
    drawQR(payload);
  });

  // Generate QR from last saved session
  document.getElementById("gen_last").addEventListener("click", ()=>{
    const rows = (load().seances)||[];
    const row = rows[rows.length-1];
    if(!row){ alert("Aucune séance enregistrée."); return; }
    const payload = JSON.stringify(row);
    if(!updateCounter(payload)){ alert("La dernière séance est trop longue pour un QR fiable."); return; }
    drawQR(payload);
  });

  // Download QR
  document.getElementById("download_qr").addEventListener("click", ()=>{
    if(!lastCanvas){ alert("Génère d’abord un QR."); return; }
    const a = document.createElement("a");
    a.href = lastCanvas.toDataURL("image/png");
    a.download = `QR_${nom}_${prenom}_${classe}_${tri}.png`; a.click();
  });

  // CSV
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
