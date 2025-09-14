
function toCSV(rows){
  if(!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = v => (v==null?"":String(v).replace(/"/g,'""'));
  return [headers.join(","), ...rows.map(r=>headers.map(h=>`"${esc(r[h])}"`).join(","))].join("\n");
}
function download(name, text, mime="text/csv"){
  const blob = new Blob([text], {type: mime+";charset=utf-8"});
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
}
document.addEventListener("DOMContentLoaded", ()=>{
  const thead = document.getElementById("thead");
  const tbody = document.getElementById("tbody");
  let rows = [];
  function render(){
    thead.innerHTML = "<tr><th>#</th><th>ID</th></tr>";
    tbody.innerHTML = "";
    rows.forEach((r,i)=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${i+1}</td><td>${r.ID}</td>`;
      tbody.appendChild(tr);
    });
  }
  document.getElementById("gen").addEventListener("click", ()=>{
    const etab = document.getElementById("etab").value.trim()||"VAU";
    const an = document.getElementById("annee").value.trim()||"T25";
    const cl = document.getElementById("classe").value.trim()||"TLE1";
    const start = Number(document.getElementById("start").value||1);
    const end = Number(document.getElementById("end").value||30);
    const pad = Number(document.getElementById("pad").value||3);
    rows = [];
    for (let n=start; n<=end; n++){
      const num = String(n).padStart(pad,"0");
      rows.push({ID: `${etab}-${an}-${cl}-${num}`});
    }
    render();
  });
  document.getElementById("csv").addEventListener("click", ()=>{
    if (!rows.length){ alert("Générez d’abord des IDs."); return; }
    download("IDs_Eleves.csv", toCSV(rows));
  });
});
