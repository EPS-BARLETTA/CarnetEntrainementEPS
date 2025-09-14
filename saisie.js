
document.addEventListener("DOMContentLoaded", ()=>{
  const nom = localStorage.getItem("ceps:last_nom")||"";
  const prenom = localStorage.getItem("ceps:last_prenom")||"";
  const classe = localStorage.getItem("ceps:last_classe")||"";
  const tri = localStorage.getItem("ceps:last_tri")||"";
  const apsa = localStorage.getItem("ceps:last_apsa")||"";
  document.getElementById("who").textContent = `${nom} ${prenom} — ${classe} — ${tri} — ${apsa}`;

  const ta = document.getElementById("notes");
  const chars = document.getElementById("chars");
  const words = document.getElementById("words");
  const qrBytesWrap = document.getElementById("qr_bytes");
  const qrBadge = document.getElementById("qr_badge");
  const words_left = document.getElementById("words_left");
  const avgWordBytes = 6;
  function countWords(s){ return (s.trim().match(/\\S+/g)||[]).length; }

  function buildRow(text, numOverride=null){
    const now = new Date();
    const d = loadCahier(nom, prenom, classe, tri);
    const num = (numOverride!=null)? numOverride : ((d.seances?.length||0)+1);
    return {
      "Séance": num,
      "Nom": nom, "Prénom": prenom, "Classe": classe, "Trimestre": tri,
      "Date": now.toISOString().slice(0,10),
      "Semaine": isoWeek(now),
      "Activité": apsa,
      "Texte": text
    };
  }

  function updateCounters(){
    const text = ta.value||"";
    chars.textContent = `${text.length} caractères`;
    words.textContent = `${countWords(text)} mots`;
    const payload = JSON.stringify(buildRow(text));
    const used = new Blob([payload]).size;
    const left = Math.max(0, 2000 - used);
    words_left.textContent = Math.max(0, Math.floor(left/avgWordBytes));
    makeBadge(qrBadge, used);
    qrBytesWrap.querySelector("#words_left").textContent = Math.max(0, Math.floor(left/avgWordBytes));
  }
  ta.addEventListener("input", ()=>{ ta.style.height="auto"; ta.style.height=(ta.scrollHeight+6)+"px"; updateCounters(); });
  ta.style.height=(ta.scrollHeight+6)+"px";
  updateCounters();

  function renderFlat(){
    const rows = (loadCahier(nom, prenom, classe, tri).seances)||[];
    const tb = document.getElementById("tbody"); tb.innerHTML="";
    rows.forEach((r,i)=>{
      const tr = document.createElement("tr");
      const short = (r.Texte||"").slice(0,40)+( (r.Texte||"").length>40 ? "…" : "" );
      tr.innerHTML = `<td>${r["Séance"]||i+1}</td><td>${r.Date||""}</td><td>${r.Semaine||""}</td><td>${r.Activité||""}</td><td>${short}</td>
                      <td><button data-i="${i}" class="edit btn ghost" style="padding:6px 10px">✏️</button>
                          <button data-i="${i}" class="del btn ghost" style="padding:6px 10px">🗑</button></td>`;
      tb.appendChild(tr);
    });

    tb.querySelectorAll(".del").forEach(b=>b.addEventListener("click", (e)=>{
      const i = +e.currentTarget.dataset.i;
      const d = loadCahier(nom, prenom, classe, tri);
      d.seances.splice(i,1);
      d.seances = d.seances.map((s,idx)=>({...s,"Séance": idx+1}));
      saveCahier(nom, prenom, classe, tri, d);
      render();
    }));
    tb.querySelectorAll(".edit").forEach(b=>b.addEventListener("click", (e)=>{
      const i = +e.currentTarget.dataset.i;
      const d = loadCahier(nom, prenom, classe, tri);
      const row = d.seances[i];
      ta.value = row.Texte||"";
      ta.style.height="auto"; ta.style.height=(ta.scrollHeight+6)+"px";
      updateCounters();
      editingIndex = i;
      document.getElementById("save_only").textContent = "Mettre à jour la séance";
      window.scrollTo({top:0,behavior:"smooth"});
    }));
  }

  function renderGrouped(){
    const host = document.getElementById("list_group");
    const rows = (loadCahier(nom, prenom, classe, tri).seances)||[];
    const byW = {};
    rows.forEach(r=>{ (byW[r.Semaine]=byW[r.Semaine]||[]).push(r); });
    host.innerHTML = "";
    Object.keys(byW).sort().forEach(w=>{
      const box = document.createElement("div"); box.className="kard colored";
      const count = byW[w].length;
      box.innerHTML = `<h3>Semaine ${w} • <span class="badge">${count} séance(s)</span></h3>`;
      const ul = document.createElement("ul");
      byW[w].forEach(r=>{
        const li = document.createElement("li");
        const short = (r.Texte||"").slice(0,60)+( (r.Texte||"").length>60 ? "…" : "" );
        li.textContent = `#${r["Séance"]} — ${r.Date} — ${r.Activité} — ${short}`;
        ul.appendChild(li);
      });
      box.appendChild(ul);
      host.appendChild(box);
    });
  }

  function render(){
    if(groupMode){
      document.getElementById("list_flat").style.display="none";
      document.getElementById("list_group").style.display="block";
      renderGrouped();
    } else {
      document.getElementById("list_group").style.display="none";
      document.getElementById("list_flat").style.display="block";
      renderFlat();
    }
  }
  let groupMode = false;
  render();

  let editingIndex = null;

  document.getElementById("save_only").addEventListener("click", ()=>{
    const d = loadCahier(nom, prenom, classe, tri);
    if(editingIndex==null){
      const row = buildRow(ta.value||"");
      d.seances = d.seances||[]; d.seances.push(row);
    }else{
      d.seances[editingIndex].Texte = ta.value||"";
      editingIndex = null;
      document.getElementById("save_only").textContent = "Enregistrer ma séance";
    }
    saveCahier(nom, prenom, classe, tri, d);
    render();
    alert("Séance enregistrée.");
  });

  document.getElementById("open_qr").addEventListener("click", ()=>{
    const d = loadCahier(nom, prenom, classe, tri);
    const nextNum = (d.seances?.length||0)+1;
    const row = buildRow(ta.value||"", nextNum);
    const payload = JSON.stringify(row);
    try{ sessionStorage.setItem("ceps:qr_payload", payload); }catch(e){}
    location.href = "qr.html";
  });

  document.getElementById("toggle_week").addEventListener("click", ()=>{
    groupMode = !groupMode;
    document.getElementById("toggle_week").textContent = groupMode ? "Vue liste simple" : "Vue par semaine";
    render();
  });

  document.getElementById("export_csv").addEventListener("click", ()=>{
    const rows = (loadCahier(nom, prenom, classe, tri).seances)||[];
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
        const renum = rows.map((s,idx)=>({...s,"Séance": idx+1}));
        const d = loadCahier(nom, prenom, classe, tri); d.seances = renum; saveCahier(nom, prenom, classe, tri, d);
        render();
        alert("CSV importé.");
      }catch(e){ alert("Erreur CSV."); }
    };
    fr.readAsText(f);
  });
});
