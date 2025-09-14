
const APSA_FIELDS = {
  "Demi-fond": [
    {key:"date", label:"Date", type:"date", required:true},
    {key:"duree_min", label:"Durée (min)", type:"number"},
    {key:"distance_m", label:"Distance (m)", type:"number"},
    {key:"fc_moy", label:"FC moyenne", type:"number"},
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
    {key:"modalite", label:"Modalité (tête/moulinette)", type:"text", required:true},
    {key:"cotation", label:"Cotation", type:"text", required:true}
  ]
  // On complètera les autres APSA après validation visuelle
};

function hdr(){ return ["Source","ID","Nom","Prénom","Classe","Sexe","Trimestre","Séance #","Date","Activité","Session ID"]; }

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

  // render fields
  const cfg = APSA_FIELDS[apsa] || [{key:"date",label:"Date",type:"date",required:true},{key:"rpe",label:"RPE (1–10)",type:"number",required:true}];
  const host = document.getElementById("dyn_fields");
  cfg.forEach(f=>{
    const wrap = document.createElement("div"); wrap.className="field";
    const lab = document.createElement("label"); lab.textContent = f.label + (f.required?" *":""); wrap.appendChild(lab);
    let input = document.createElement("input"); input.type = f.type || "text";
    if (f.type==="date") input.value = (new Date()).toISOString().slice(0,10);
    input.id = "f_"+f.key; wrap.appendChild(input); host.appendChild(wrap);
  });

  document.getElementById("save").addEventListener("click", ()=>{
    if (!id || !tri){ alert("Retournez à la sélection pour saisir l'identité."); return; }
    let data = {}; let ok = true;
    cfg.forEach(f=>{
      const v = (document.getElementById("f_"+f.key).value||"").trim();
      if (f.required && !v) ok=false;
      data[f.key] = v;
    });
    if (!ok){ alert("Merci de compléter les champs obligatoires."); return; }
    if (!data.date) data.date = (new Date()).toISOString().slice(0,10);

    const cahier = loadCahier(id, tri);
    const num = (cahier.seances?.length||0)+1;
    const sid = makeSessionId({eleveId:id,trimestre:tri,date:data.date,activite:apsa});
    const row = {"Source":"CahierEPS","ID":id,"Nom":nom,"Prénom":prenom,"Classe":classe,"Sexe":sexe,"Trimestre":tri,"Séance #":num,"Date":data.date,"Activité":apsa,"Session ID":sid};
    // minimal fields mapping for now
    if (data.rpe) row["RPE"] = data.rpe;
    if (data.duree_min) row["Durée (min)"] = data.duree_min;
    if (data.distance_m) row["Distance (m)"] = data.distance_m;
    if (data.fc_moy) row["FC moy"] = data.fc_moy;
    if (data.voie) row["Voie"] = data.voie;
    if (data.modalite) row["Modalité"] = data.modalite;
    if (data.cotation) row["Cotation"] = data.cotation;
    if (data.t50_1) row["Temps 50m #1 (s)"] = data.t50_1;
    if (data.t50_2) row["Temps 50m #2 (s)"] = data.t50_2;
    if (data.t50_3) row["Temps 50m #3 (s)"] = data.t50_3;

    cahier.seances = cahier.seances || [];
    cahier.seances.push(row);
    saveCahier(id, tri, cahier);

    // show QR
    const payload = JSON.stringify(row);
    const canvas = window.QRCodeGen(payload);
    const hostQR = document.getElementById("qr");
    hostQR.innerHTML = ""; hostQR.appendChild(canvas);
    document.getElementById("qr_card").style.display = "block";
    window.scrollTo({top: document.body.scrollHeight, behavior:"smooth"});
  });
});
