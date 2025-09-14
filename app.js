// Carnet EPS — app.js (UX-polished, same core logic)
const APSA_CONFIG = {
  "Demi-fond": {
    required: ["date", "rpe"],
    fields: [
      {key:"date", label:"Date", type:"date"},
      {key:"duree_min", label:"Durée (min)", type:"number", step:"1", min:"0"},
      {key:"distance_m", label:"Distance (m)", type:"number", step:"1", min:"0"},
      {key:"fc_moy", label:"Fréquence cardiaque moyenne", type:"number", step:"1", min:"0"},
      {key:"rpe", label:"RPE (1–10)", type:"number", min:"1", max:"10", step:"1", required:true},
      {key:"commentaire", label:"Commentaire", type:"textarea"}
    ]
  },
  "Natation": {
    required: ["date","rpe"],
    fields: [
      {key:"date", label:"Date", type:"date"},
      {key:"nage1", label:"Nage 1", type:"text"},
      {key:"t50_1", label:"Temps 50m #1 (s)", type:"number", step:"0.01", min:"0"},
      {key:"nage2", label:"Nage 2", type:"text"},
      {key:"t50_2", label:"Temps 50m #2 (s)", type:"number", step:"0.01", min:"0"},
      {key:"nage3", label:"Nage 3", type:"text"},
      {key:"t50_3", label:"Temps 50m #3 (s)", type:"number", step:"0.01", min:"0"},
      {key:"cb_50_3", label:"Coups de bras (50m3)", type:"number", step:"1", min:"0"},
      {key:"depart", label:"Départ", type:"select", options:["bord","plot"]},
      {key:"virage", label:"Virage", type:"select", options:["simple","culbute"]},
      {key:"rpe", label:"RPE (1–10)", type:"number", min:"1", max:"10", step:"1", required:true},
      {key:"commentaire", label:"Commentaire", type:"textarea"}
    ]
  },
  "Escalade": {
    required: ["date","modalite","cotation"],
    fields: [
      {key:"date", label:"Date", type:"date"},
      {key:"voie", label:"Voie", type:"text"},
      {key:"modalite", label:"Modalité", type:"select", options:["tête","moulinette"], required:true},
      {key:"cotation", label:"Cotation", type:"text", required:true},
      {key:"chutes", label:"Chutes (nb)", type:"number", step:"1", min:"0"},
      {key:"repos", label:"Position de repos respectée", type:"select", options:["ok","non"]},
      {key:"mousquetonnage", label:"Mousquetonnage", type:"select", options:["ok","non"]},
      {key:"analyse", label:"Analyse (court)", type:"textarea"},
      {key:"commentaire", label:"Commentaire sécurité", type:"textarea"}
    ]
  },
  "Danse": {
    required: ["date","role"],
    fields: [
      {key:"date", label:"Date", type:"date"},
      {key:"role", label:"Rôle", type:"select", options:["chorégraphe","interprète","spectateur"], required:true},
      {key:"propos", label:"Propos : état", type:"text"},
      {key:"carnet", label:"Carnet : état", type:"text"},
      {key:"repetition_min", label:"Répétition (min)", type:"number", step:"1", min:"0"},
      {key:"taches", label:"Tâches réalisées", type:"textarea"},
      {key:"pistes", label:"Pistes d’évolution", type:"textarea"},
      {key:"commentaire", label:"Commentaire", type:"textarea"}
    ]
  },
  "Badminton": {
    required: ["date","format"],
    fields: [
      {key:"date", label:"Date", type:"date"},
      {key:"format", label:"Format", type:"select", options:["simple","double"], required:true},
      {key:"adversaire", label:"Adversaire / Poule", type:"text"},
      {key:"scores", label:"Scores (ex: 21-15 / 18-21 / 21-17)", type:"text"},
      {key:"victoire", label:"Victoire (0/1)", type:"number", min:"0", max:"1", step:"1"},
      {key:"pts_gagnes", label:"Points gagnés", type:"number", step:"1", min:"0"},
      {key:"projet", label:"Projet de jeu (clé)", type:"text"},
      {key:"ajust", label:"Ajustements entre sets", type:"textarea"},
      {key:"role", label:"Rôle (arbitre/coach)", type:"text"},
      {key:"commentaire", label:"Commentaire", type:"textarea"}
    ]
  },
  "Football": {
    required: ["date","match"],
    fields: [
      {key:"date", label:"Date", type:"date"},
      {key:"match", label:"Match #", type:"text"},
      {key:"poste", label:"Poste / Rôle", type:"text"},
      {key:"score", label:"Score", type:"text"},
      {key:"victoire", label:"Victoire (0/1)", type:"number", min:"0", max:"1", step:"1"},
      {key:"actions", label:"Actions clés", type:"textarea"},
      {key:"concertation", label:"Décisions en concertation", type:"textarea"},
      {key:"commentaire", label:"Commentaire", type:"textarea"}
    ]
  },
  "Volley": {
    required: ["date","match"],
    fields: [
      {key:"date", label:"Date", type:"date"},
      {key:"match", label:"Match #", type:"text"},
      {key:"set1", label:"Set 1 (pts)", type:"number", step:"1", min:"0"},
      {key:"set2", label:"Set 2 (pts)", type:"number", step:"1", min:"0"},
      {key:"set3", label:"Set 3 (si décisif)", type:"number", step:"1", min:"0"},
      {key:"victoire", label:"Victoire (0/1)", type:"number", min:"0", max:"1", step:"1"},
      {key:"regle_service", label:"Règle service appliquée", type:"text"},
      {key:"role", label:"Rôle (arbitre/partenaire)", type:"text"},
      {key:"commentaire", label:"Commentaire", type:"textarea"}
    ]
  },
  "Musculation": {
    required: ["date","theme","rpe"],
    fields: [
      {key:"date", label:"Date", type:"date"},
      {key:"theme", label:"Thème", type:"select", options:["puissance","tonification","volume"], required:true},
      {key:"exo", label:"Exercice", type:"text"},
      {key:"series", label:"Séries", type:"number", step:"1", min:"0"},
      {key:"reps", label:"Répétitions", type:"number", step:"1", min:"0"},
      {key:"charge", label:"Charge (kg)", type:"number", step:"0.5", min:"0"},
      {key:"rpe", label:"RPE (1–10)", type:"number", min:"1", max:"10", step:"1", required:true},
      {key:"amplitude", label:"Amplitude", type:"select", options:["ok","limitée"]},
      {key:"respiration", label:"Respiration", type:"select", options:["ok","partielle"]},
      {key:"posture", label:"Posture", type:"select", options:["ok","compensations"]},
      {key:"regulation", label:"Régulation (texte)", type:"textarea"},
      {key:"commentaire", label:"Commentaire", type:"textarea"}
    ]
  }
};

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
function todayStr(){ return new Date().toISOString().slice(0,10); }
function makeSessionId({eleveId,trimestre,date,activite}){ return `ceps-${eleveId}-${trimestre}-${date}-${activite}`.toLowerCase().replace(/\s+/g,'_'); }
function storageKey(id, tri){ return `cahier_eps:${id}:${tri}`; }
function loadCahier(id, tri){ const raw=localStorage.getItem(storageKey(id,tri)); if(!raw) return {meta:{created_at:new Date().toISOString()},seances:[]}; try{return JSON.parse(raw);}catch(e){return {meta:{},seances:[]};} }
function saveCahier(id, tri, data){ data.meta={...(data.meta||{}),updated_at:new Date().toISOString()}; localStorage.setItem(storageKey(id,tri), JSON.stringify(data)); }
function toCSV(rows){ if(!rows.length) return ""; const headers=Array.from(new Set(rows.flatMap(r=>Object.keys(r)))); const esc=v=>(v==null?"":String(v).replace(/"/g,'""')); return [headers.join(","), ...rows.map(r=>headers.map(h=>`"${esc(r[h])}"`).join(","))].join("\\n"); }
function downloadText(name,text,mime="text/plain"){ const blob=new Blob([text],{type:mime+";charset=utf-8"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1e3); }

const App = (()=>{
  let state={eleve:{id:"",nom:"",prenom:"",classe:"",sexe:"F"}, trimestre:"T1-2025", activite:"Demi-fond", cahier:{seances:[],meta:{}}};

  function init(){
    // Identity restore
    $("#eleve_id").value=localStorage.getItem("ceps:last_id")||"";
    $("#nom").value=localStorage.getItem("ceps:last_nom")||"";
    $("#prenom").value=localStorage.getItem("ceps:last_prenom")||"";
    $("#classe").value=localStorage.getItem("ceps:last_classe")||"";
    $("#sexe").value=localStorage.getItem("ceps:last_sexe")||"F";
    $("#trimestre").value=localStorage.getItem("ceps:last_tri")||"T1-2025";
    renderFields("Demi-fond"); bind();

    // chip click
    $$("#chips .chip").forEach(ch=>ch.addEventListener("click", ()=>{
      $$("#chips .chip").forEach(c=>c.classList.remove("active"));
      ch.classList.add("active");
      state.activite = ch.dataset.apsa;
      renderFields(state.activite);
    }));
  }

  function bind(){
    $("#btn_load").addEventListener("click", onLoad);
    $("#btn_save_seance").addEventListener("click", onSaveSeance);
    $("#btn_export_csv").addEventListener("click", onExportCSV);
    $("#btn_export_json").addEventListener("click", onExportJSON);
    $("#btn_import_json").addEventListener("change", onImportJSON);
    $("#btn_mail").addEventListener("click", onMail);
  }

  function onLoad(){
    state.eleve={
      id:$("#eleve_id").value.trim(),
      nom:$("#nom").value.trim().toUpperCase(),
      prenom:$("#prenom").value.trim(),
      classe:$("#classe").value.trim(),
      sexe:$("#sexe").value
    };
    state.trimestre=$("#trimestre").value.trim();
    localStorage.setItem("ceps:last_id",state.eleve.id);
    localStorage.setItem("ceps:last_nom",state.eleve.nom);
    localStorage.setItem("ceps:last_prenom",state.eleve.prenom);
    localStorage.setItem("ceps:last_classe",state.eleve.classe);
    localStorage.setItem("ceps:last_sexe",state.eleve.sexe);
    localStorage.setItem("ceps:last_tri",state.trimestre);
    state.cahier=loadCahier(state.eleve.id,state.trimestre);
    renderTable();
  }

  function renderFields(act){
    const cfg = APSA_CONFIG[act];
    const host = $("#dyn_fields"); host.innerHTML="";
    cfg.fields.forEach(f=>{
      const wrap=document.createElement("div"); wrap.className="field";
      const lab=document.createElement("label"); lab.textContent=f.label+(f.required?" *":""); wrap.appendChild(lab);
      let input;
      if (f.type==="select"){
        input=document.createElement("select");
        (f.options||[]).forEach(o=>{ const op=document.createElement("option"); op.value=o; op.textContent=o; input.appendChild(op); });
      } else if (f.type==="textarea"){
        input=document.createElement("textarea");
      } else {
        input=document.createElement("input"); input.type=f.type;
        if (f.step) input.step=f.step; if (f.min) input.min=f.min; if (f.max) input.max=f.max;
        if (f.type==="date") input.value = todayStr();
      }
      input.id="f_"+f.key;
      wrap.appendChild(input);
      host.appendChild(wrap);
    });
  }

  function collect(){
    const cfg = APSA_CONFIG[state.activite];
    const o = {};
    cfg.fields.forEach(f=>{
      const el = document.getElementById("f_"+f.key);
      let v = el? el.value : "";
      if (f.type==="number" && v!=="") v = Number(v);
      o[f.key] = v;
    });
    (cfg.required||[]).forEach(r=>{ if(!o[r]) throw new Error("Champ obligatoire manquant : "+r); });
    if (!o.date) o.date = todayStr();
    return o;
  }

  function onSaveSeance(){
    try{
      if(!state.eleve.id||!state.trimestre){ alert("Renseignez ID + Trimestre puis cliquez sur Charger/Créer."); return; }
      const s=collect();
      const num=(state.cahier.seances?.length||0)+1;
      const sid=makeSessionId({eleveId:state.eleve.id,trimestre:state.trimestre,date:s.date,activite:state.activite});
      const row={
        "Source":"CahierEPS","ID":state.eleve.id,"Nom":state.eleve.nom,"Prénom":state.eleve.prenom,"Classe":state.eleve.classe,"Sexe":state.eleve.sexe,
        "Trimestre":state.trimestre,"Séance #":num,"Date":s.date,"Activité":state.activite,"Session ID":sid
      };
      const map={"duree_min":"Durée (min)","distance_m":"Distance (m)","fc_moy":"FC moy","commentaire":"Commentaire","rpe":"RPE",
        "analyse":"Analyse","repos":"Position de repos respectée","mousquetonnage":"Mousquetonnage","repetition_min":"Répétition (min)",
        "t50_1":"Temps 50m #1 (s)","t50_2":"Temps 50m #2 (s)","t50_3":"Temps 50m #3 (s)","cb_50_3":"Coups de bras (50m3)"};
      Object.entries(s).forEach(([k,v])=>row[map[k]||k]=v);

      state.cahier.seances.push(row); saveCahier(state.eleve.id,state.trimestre,state.cahier);
      renderTable(); showQR(row);
      // stepper state
      document.querySelectorAll(".dot").forEach((d,i)=>d.classList.toggle("active", i<3));
      location.hash="#qr_section";
    }catch(e){ alert(e.message||String(e)); }
  }

  function renderTable(){
    const rows=state.cahier.seances||[];
    $("#counter").textContent = `${rows.length} séance(s)`;
    const base=["Source","ID","Nom","Prénom","Classe","Sexe","Trimestre","Séance #","Date","Activité","Session ID"];
    const extra=new Set(); rows.forEach(r=>Object.keys(r).forEach(k=>{ if(!base.includes(k)) extra.add(k); }));
    const headers=[...base, ...extra];
    const thead=$("#thead"), tbody=$("#tbody"); thead.innerHTML=""; tbody.innerHTML="";
    const trh=document.createElement("tr"); headers.forEach(h=>{const th=document.createElement("th"); th.textContent=h; trh.appendChild(th);}); thead.appendChild(trh);
    rows.forEach(r=>{
      const tr=document.createElement("tr");
      headers.forEach(h=>{ const td=document.createElement("td"); td.textContent=r[h]??""; tr.appendChild(td); });
      tr.addEventListener("click", ()=>showQR(r)); tbody.appendChild(tr);
    });
  }

  function showQR(row){
    const payload=JSON.stringify(row);
    const c=window.QRCodeGen(payload);
    const host=$("#qr_host"); host.innerHTML=""; host.appendChild(c);
    $("#qr_text").textContent=payload;
    $("#qr_section").style.display="block";
  }

  function onExportCSV(){ const rows=state.cahier.seances||[]; if(!rows.length){alert("Aucune séance."); return;} downloadText(`CarnetEPS_${state.eleve.id}_${state.trimestre}.csv`, toCSV(rows), "text/csv"); }
  function onExportJSON(){ const rows=state.cahier.seances||[]; const obj={app:"CahierEPS",v:1,eleve:state.eleve,trimestre:state.trimestre,seances:rows}; downloadText(`CarnetEPS_${state.eleve.id}_${state.trimestre}.json`, JSON.stringify(obj,null,2), "application/json"); }
  function onImportJSON(ev){
    const f=ev.target.files?.[0]; if(!f) return;
    const r=new FileReader(); r.onload=()=>{ try{ const o=JSON.parse(r.result); if(!o||!o.seances){alert("JSON invalide"); return;} state.cahier.seances=Array.isArray(o.seances)?o.seances:[]; saveCahier(state.eleve.id,state.trimestre,state.cahier); renderTable(); alert("Import JSON ok"); }catch(e){ alert("Erreur import"); } }; r.readAsText(f);
  }
  function onMail(){
    const to=""; // vide => ouvre l'app mail par défaut
    const subject=encodeURIComponent(`[Carnet EPS] ${state.eleve.nom} ${state.eleve.prenom} ${state.trimestre}`);
    const body=encodeURIComponent(`Bonjour,\\n\\nJe vous transmets mon carnet d'entraînement.\\nVeuillez trouver en pièce jointe le CSV exporté depuis l'app.\\n\\nID: ${state.eleve.id}\\nClasse: ${state.eleve.classe}\\nSéances: ${(state.cahier.seances||[]).length}\\n\\nCordialement.`);
    location.href=`mailto:${to}?subject=${subject}&body=${body}`;
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", ()=> App.init());
