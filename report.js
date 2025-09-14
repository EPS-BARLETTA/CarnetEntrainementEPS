
document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("build").addEventListener("click",()=>{
    const nom=document.getElementById("nom").value.trim();
    const prenom=document.getElementById("prenom").value.trim();
    const classe=document.getElementById("classe").value.trim();
    const trimestre=document.getElementById("trimestre").value.trim();
    const key=`cahier_eps:${nom}:${prenom}:${classe}:${trimestre}`;
    const raw=localStorage.getItem(key);const data=raw?JSON.parse(raw):{seances:[]};
    const rows=data.seances||[];
    const thead=document.getElementById("thead"),tbody=document.getElementById("tbody");
    thead.innerHTML="";tbody.innerHTML="";
    if(rows.length){const headers=Object.keys(rows[0]);thead.innerHTML="<tr>"+headers.map(h=>"<th>"+h+"</th>").join("")+"</tr>";
      rows.forEach(r=>{tbody.innerHTML+="<tr>"+headers.map(h=>"<td>"+(r[h]||"")+"</td>").join("")+"</tr>";});
    }else{thead.innerHTML="<tr><th>Aucune séance</th></tr>";}
    document.getElementById("preview").style.display="block";
  });
  document.getElementById("print").addEventListener("click",()=>window.print());
});
