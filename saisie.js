
const APSA_FIELDS = {
  "Demi-fond": [
    {key:"date", label:"Date", type:"date", required:true},
    {key:"duree_min", label:"Durée (min)", type:"number"},
    {key:"distance_m", label:"Distance (m)", type:"number"},
    {key:"rpe", label:"RPE (1–10)", type:"number", required:true}
  ],
  "Natation": [
    {key:"date", label:"Date", type:"date", required:true},
    {key:"t50_1", label:"Temps 50m #1 (s)", type:"number"},
    {key:"t50_2", label:"Temps 50m #2 (s)", type:"number"},
    {key:"t50_3", label:"Temps 50m #3 (s)", type:"number"},
    {key:"rpe", label:"RPE (1–10)", type:"number", required:true}
  ],
  "Escalade": [
    {key:"date", label:"Date", type:"date", required:true},
    {key:"voie", label:"Voie", type:"text"},
    {key:"modalite", label:"Modalité (tête/moulinette)", type:"text"},
    {key:"cotation", label:"Cotation", type:"text"}
  ]
};

document.addEventListener("DOMContentLoaded", ()=>{
  const id = localStorage.getItem("ceps:last_id")||"";
  const tri = localStorage.getItem("ceps:last_tri")||"";
  const nom = localStorage.getItem("ceps:last_nom")||"";
  const prenom = localStorage.getItem("ceps:last_prenom")||"";
  const classe = localStorage.getItem("ceps:last_classe")||"";
  const sexe = localStorage.getItem("ceps:last_sexe")||"F";
  const apsa = localStorage.getItem("ceps:last_apsa")||"Demi-fond";

  document.getElementById("who").textContent = `${nom} ${prenom} — ${classe} — ${tri}`;
  document.getElementById("apsa_name").textContent = apsa;

  const host = document.getElementById("dyn_fields");
  const fields = APSA_FIELDS[apsa] || [{key:"date",label:"Date",type:"date",required:true},{key:"rpe",label:"RPE (1–10)",type:"number",required:true}];
  host.innerHTML = "";
  fields.forEach(f=>{
    const wrap = document.createElement("div"); wrap.className="field";
    const lab = document.createElement("label"); lab.textContent = f.label + (f.required?" *":""); wrap.appendChild(lab);
    const inp = document.createElement("input"); inp.type = f.type||"text"; if (f.type==="date") inp.value=(new Date()).toISOString().slice(0,10);
    inp.id = "f_"+f.key; wrap.appendChild(inp); host.appendChild(wrap);
  });

  function renderTable(){
    const cahier = loadCahier(id, tri);
    const rows = cahier.seances || [];
    const thead = document.getElementById("thead");
    const tbody = document.getElementById("tbody");
    thead.innerHTML = ""; tbody.innerHTML = "";
    if (!rows.length){ thead.innerHTML="<tr><th>Info</th></tr>"; tbody.innerHTML="<tr><td>Aucune séance encore.</td></tr>"; return; }
    const headers = Array.from(new Set(rows.flatMap(r=>Object.keys(r))));
    const trh = document.createElement("tr"); headers.forEach(h=>{ const th=document.createElement("th"); th.textContent=h; trh.appendChild(th); }); thead.appendChild(trh);
    rows.forEach(r=>{ const tr=document.createElement("tr"); headers.forEach(h=>{ const td=document.createElement("td"); td.textContent=r[h]??""; tr.appendChild(td); }); tbody.appendChild(tr); });
  }
  renderTable();

  document.getElementById("save").addEventListener("click", ()=>{
    if(!id||!tri){ alert("Retour à la sélection pour l'identité."); return; }
    const data = {}; let ok=true;
    fields.forEach(f=>{
      const v = (document.getElementById("f_"+f.key).value||"").trim();
      if (f.required && !v) ok=false;
      data[f.key]=v;
    });
    if(!ok){ alert("Complète les champs obligatoires."); return; }
    if(!data.date) data.date=(new Date()).toISOString().slice(0,10);

    const cahier = loadCahier(id, tri);
    const num = (cahier.seances?.length||0)+1;
    const sid = makeSessionId({eleveId:id,trimestre:tri,date:data.date,activite:apsa});
    const row = {"Source":"CahierEPS","ID":id,"Nom":nom,"Prénom":prenom,"Classe":classe,"Sexe":sexe,"Trimestre":tri,"Séance #":num,"Date":data.date,"Activité":apsa,"Session ID":sid};
    Object.entries(data).forEach(([k,v])=>{ if(k!=="date") row[k] = v; });
    cahier.seances = cahier.seances || []; cahier.seances.push(row); saveCahier(id, tri, cahier);

    const payload = JSON.stringify(row);
    const canvas = window.QRCodeGen(payload);
    const hostQR = document.getElementById("qr");
    hostQR.innerHTML = ""; hostQR.appendChild(canvas);
    document.getElementById("qr_card").style.display = "block";
    renderTable();
    window.scrollTo({top: document.body.scrollHeight, behavior:"smooth"});
  });

  document.getElementById("export_csv").addEventListener("click", ()=>{
    const rows = (loadCahier(id,tri).seances)||[];
    if(!rows.length){ alert("Aucune séance à exporter."); return; }
    const csv = toCSV(rows);
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `CarnetEPS_${id}_${tri}.csv`; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  });

  document.getElementById("import_csv").addEventListener("change", (ev)=>{
    const f = ev.target.files?.[0]; if(!f) return;
    const fr = new FileReader();
    fr.onload = ()=>{
      try{
        const rows = fromCSV(fr.result);
        const cahier = loadCahier(id, tri);
        cahier.seances = rows; // overwrite for simplicité (on peut fusionner plus tard)
        saveCahier(id, tri, cahier);
        renderTable();
        alert("CSV importé.");
      }catch(e){ alert("Erreur lecture CSV."); }
    };
    fr.readAsText(f);
  });
});
