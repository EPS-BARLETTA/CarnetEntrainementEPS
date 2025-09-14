
const APSA_FIELDS={
  "Demi-fond":[{key:"date",label:"Date",type:"date"},{key:"distance",label:"Distance (m)",type:"number"}],
  "Natation":[{key:"date",label:"Date",type:"date"},{key:"temps50",label:"50m (s)",type:"number"}],
  "Escalade":[{key:"date",label:"Date",type:"date"},{key:"voie",label:"Voie",type:"text"}]
};
document.addEventListener("DOMContentLoaded",()=>{
  const eleve=JSON.parse(localStorage.getItem("ceps:last")||"{}");
  const fields=APSA_FIELDS[eleve.apsa]||[];
  const host=document.getElementById("dyn_fields");fields.forEach(f=>{
    host.innerHTML+=`<div class="field"><label>${f.label}</label><input id="f_${f.key}" type="${f.type}"></div>`;
  });
  function load(){return loadCahier(eleve);} function save(d){saveCahier(eleve,d);}
  function render(){
    const data=load();const rows=data.seances||[];
    const thead=document.getElementById("thead"),tbody=document.getElementById("tbody");
    thead.innerHTML="";tbody.innerHTML="";
    if(!rows.length){thead.innerHTML="<tr><th>Aucune séance</th></tr>";return;}
    const headers=Object.keys(rows[0]);thead.innerHTML="<tr>"+headers.map(h=>"<th>"+h+"</th>").join("")+"</tr>";
    rows.forEach(r=>{tbody.innerHTML+="<tr>"+headers.map(h=>"<td>"+(r[h]||"")+"</td>").join("")+"</tr>";});
  }
  render();
  document.getElementById("save").addEventListener("click",()=>{
    const seance={Nom:eleve.nom,Prénom:eleve.prenom,Classe:eleve.classe,Trimestre:eleve.trimestre,Activité:eleve.apsa};
    fields.forEach(f=>seance[f.key]=document.getElementById("f_"+f.key).value);
    const data=load();data.seances.push(seance);save(data);render();
    const qr=new QRCode(document.getElementById("qr"),{text:JSON.stringify(seance),width:200,height:200});
    document.getElementById("qr_card").style.display="block";
  });
  document.getElementById("export_csv").addEventListener("click",()=>{
    const csv=toCSV(load().seances||[]);const blob=new Blob([csv],{type:"text/csv"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="CarnetEPS.csv";a.click();
  });
  document.getElementById("import_csv").addEventListener("change",ev=>{
    const f=ev.target.files[0];if(!f)return;const fr=new FileReader();fr.onload=()=>{
      const rows=fromCSV(fr.result);const d=load();d.seances=rows;save(d);render();};fr.readAsText(f);
  });
});
