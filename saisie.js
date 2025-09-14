
const APSA = {
  "Demi-fond": {
    afl2: [
      {key:"date", label:"Date", type:"date", required:true},
      {key:"distance_m", label:"Distance (m)", type:"number"},
      {key:"duree_min", label:"Durée (min)", type:"number"},
      {key:"rpe", label:"RPE (1–10)", type:"number"}
    ],
    afl3: [
      {key:"objectif", label:"Objectif de séance", type:"text"},
      {key:"strategie", label:"Stratégie (allure, récup...)", type:"text"}
    ]
  },
  "Natation": {
    afl2: [
      {key:"date", label:"Date", type:"date", required:true},
      {key:"t50", label:"Temps 50m (s)", type:"number"},
      {key:"t100", label:"Temps 100m (s)", type:"number"},
      {key:"nb_longueurs", label:"Nb de longueurs", type:"number"}
    ],
    afl3: [
      {key:"objectif", label:"Objectif (technique/volume)", type:"text"},
      {key:"focal_tech", label:"Focalisation technique", type:"text"}
    ]
  },
  "Escalade": {
    afl2: [
      {key:"date", label:"Date", type:"date", required:true},
      {key:"voie", label:"Voie / bloc", type:"text"},
      {key:"cotation", label:"Cotation", type:"text"},
      {key:"modalite", label:"Modalité (tête/moulinette)", type:"text"},
      {key:"tentatives", label:"Nb de tentatives", type:"number"}
    ],
    afl3: [
      {key:"strategie", label:"Stratégie (lecture, repos...)", type:"text"},
      {key:"gestion", label:"Gestion émotionnelle/sécurité", type:"text"}
    ]
  },
  "Danse": {
    afl2: [
      {key:"date", label:"Date", type:"date", required:true},
      {key:"duree_min", label:"Répétition (min)", type:"number"},
      {key:"nb_mouv", label:"Nb de mouvements clés", type:"number"}
    ],
    afl3: [
      {key:"intention", label:"Intention/qualité", type:"text"},
      {key:"feedback", label:"Auto-éval / pairs", type:"text"}
    ]
  },
  "Badminton": {
    afl2: [
      {key:"date", label:"Date", type:"date", required:true},
      {key:"series", label:"Séries (échanges, points)", type:"text"},
      {key:"victoires", label:"Victoires", type:"number"},
      {key:"defaites", label:"Défaites", type:"number"}
    ],
    afl3: [
      {key:"tactique", label:"Tactique (zones, variations)", type:"text"},
      {key:"objectif", label:"Objectif séance", type:"text"}
    ]
  },
  "Football": {
    afl2: [
      {key:"date", label:"Date", type:"date", required:true},
      {key:"minutes", label:"Minutes jouées", type:"number"},
      {key:"buts", label:"Buts", type:"number"},
      {key:"passes", label:"Passes décisives", type:"number"}
    ],
    afl3: [
      {key:"role", label:"Rôle/tâches", type:"text"},
      {key:"principe", label:"Principe travaillé", type:"text"}
    ]
  },
  "Volley": {
    afl2: [
      {key:"date", label:"Date", type:"date", required:true},
      {key:"services_reussis", label:"Services réussis", type:"number"},
      {key:"receptions", label:"Réceptions", type:"number"},
      {key:"attaques", label:"Attaques", type:"number"}
    ],
    afl3: [
      {key:"organisation", label:"Organisation collective", type:"text"},
      {key:"objectif", label:"Objectif séance", type:"text"}
    ]
  },
  "Musculation": {
    afl2: [
      {key:"date", label:"Date", type:"date", required:true},
      {key:"exercice", label:"Exercice", type:"text"},
      {key:"charge_kg", label:"Charge (kg)", type:"number"},
      {key:"reps", label:"Répétitions", type:"number"},
      {key:"series", label:"Séries", type:"number"}
    ],
    afl3: [
      {key:"cible", label:"Cible (force/volume/endurance)", type:"text"},
      {key:"secu", label:"Sécurité (spotter, posture)", type:"text"}
    ]
  }
};

const QR_MAX = 2000;
let lastCanvas = null;

document.addEventListener("DOMContentLoaded", ()=>{
  const nom = localStorage.getItem("ceps:last_nom")||"";
  const prenom = localStorage.getItem("ceps:last_prenom")||"";
  const classe = localStorage.getItem("ceps:last_classe")||"";
  const tri = localStorage.getItem("ceps:last_tri")||"";
  const apsa = localStorage.getItem("ceps:last_apsa")||"Demi-fond";

  document.getElementById("who").textContent = `${nom} ${prenom} — ${classe} — ${tri} — ${apsa}`;

  const cfg = APSA[apsa] || {afl2:[{key:"date",label:"Date",type:"date",required:true}],afl3:[]};
  const host2 = document.getElementById("afl2");
  const host3 = document.getElementById("afl3");
  function renderFields(list, host){
    host.innerHTML="";
    list.forEach(f=>{
      const wrap=document.createElement("div"); wrap.className="field";
      const lab=document.createElement("label"); lab.textContent = f.label + (f.required?" *":""); wrap.appendChild(lab);
      const el=document.createElement("input"); el.type=f.type||"text"; 
      if (f.type==="date") el.value=(new Date()).toISOString().slice(0,10);
      el.id = "f_"+f.key; wrap.appendChild(el); host.appendChild(wrap);
    });
  }
  renderFields(cfg.afl2, host2);
  renderFields(cfg.afl3, host3);

  function load(){ return loadCahier(nom, prenom, classe, tri); }
  function save(d){ return saveCahier(nom, prenom, classe, tri, d); }

  function renderTable(){
    const rows = (load().seances)||[];
    const thead=document.getElementById("thead"), tbody=document.getElementById("tbody");
    thead.innerHTML=""; tbody.innerHTML="";
    if(!rows.length){ thead.innerHTML="<tr><th>Info</th></tr>"; tbody.innerHTML="<tr><td>Aucune séance.</td></tr>"; return; }
    const headers = Array.from(new Set(rows.flatMap(r=>Object.keys(r))));
    const trh=document.createElement("tr"); headers.forEach(h=>{ const th=document.createElement("th"); th.textContent=h; trh.appendChild(th); }); thead.appendChild(trh);
    rows.forEach(r=>{ const tr=document.createElement("tr"); headers.forEach(h=>{ const td=document.createElement("td"); td.textContent=r[h]??""; tr.appendChild(td); }); tbody.appendChild(tr); });
  }
  renderTable();

  function updateCounter(payloadStr){
    const bytes = new Blob([payloadStr]).size;
    const pct = Math.min(100, Math.round(bytes/QR_MAX*100));
    document.getElementById("qr_bar").style.width = pct+"%";
    document.getElementById("qr_info").textContent = `${bytes} / ${QR_MAX} octets`;
    document.getElementById("qr_warn").style.display = (bytes>QR_MAX*0.75 && bytes<=QR_MAX)?"block":"none";
    document.getElementById("qr_error").style.display = (bytes>QR_MAX)?"block":"none";
    return bytes<=QR_MAX;
  }

  function buildRow(){
    const data = {};
    [...(cfg.afl2||[]),...(cfg.afl3||[])].forEach(f=>{
      const v = (document.getElementById("f_"+f.key)?.value||"").trim();
      if(v) data[f.key]=v;
    });
    const notes = (document.getElementById("notes").value||"").trim();
    if(notes) data["notes"]=notes;
    const row = {"Nom":nom,"Prénom":prenom,"Classe":classe,"Trimestre":tri,"Date":(data.date||new Date().toISOString().slice(0,10)),"Activité":apsa, ...data};
    return row;
  }

  document.addEventListener("input", ()=>{
    const payload = JSON.stringify(buildRow());
    updateCounter(payload);
  }, true);

  document.getElementById("save").addEventListener("click", ()=>{
    const row = buildRow();
    const payload = JSON.stringify(row);
    if(!updateCounter(payload)){ alert("QR trop chargé : réduis les notes."); return; }

    const d = load(); d.seances = d.seances||[]; d.seances.push(row); save(d); renderTable();

    const host = document.getElementById("qr"); host.innerHTML="";
    const canvas = window.QRCodeGen(payload);
    host.appendChild(canvas);
    window._lastQRCanvas = canvas;
  });

  document.getElementById("download_qr").addEventListener("click", ()=>{
    const canvas = window._lastQRCanvas;
    if(!canvas){ alert("Génère d’abord le QR."); return; }
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "QR_Seance.png";
    link.click();
  });

  document.getElementById("export_csv").addEventListener("click", ()=>{
    const rows = (load().seances)||[];
    if(!rows.length){ alert("Aucune séance à exporter."); return; }
    const csv = toCSV(rows);
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `CarnetEPS_${nom}_${prenom}_${classe}_${tri}.csv`; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
    alert("Conseil : enregistre le CSV « Sur mon iPad » (pas iCloud).");
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
