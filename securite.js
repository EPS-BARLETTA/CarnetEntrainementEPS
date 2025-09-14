const SEC_DATA = {"general": ["Échauffement progressif (10–20 min), mobilité & activation.", "Hydratation régulière avant/pendant/après l’effort.", "Chaussures/équipements adaptés à l’activité.", "Respect des consignes du professeur et des partenaires.", "Arrêt si douleur, étourdissement ou gêne anormale."], "Demi-fond": ["Consignes principales… (extraits)"], "Natation": ["Consignes principales… (extraits)"], "Escalade": ["Consignes principales… (extraits)"], "Danse": ["Consignes principales… (extraits)"], "Badminton": ["Consignes principales… (extraits)"], "Football": ["Consignes principales… (extraits)"], "Volley": ["Consignes principales… (extraits)"], "Musculation": ["Consignes principales… (extraits)"]};
document.addEventListener("DOMContentLoaded", ()=>{
  const ulG = document.getElementById("sec_general");
  SEC_DATA.general.forEach(x=>{ const li=document.createElement("li"); li.textContent=x; ulG.appendChild(li); });
  const select = document.getElementById("apsa_select");
  const ulA = document.getElementById("sec_apsa");
  function renderApsa(){
    const list = SEC_DATA[select.value]||[];
    ulA.innerHTML=""; list.forEach(x=>{ const li=document.createElement("li"); li.textContent=x; ulA.appendChild(li); });
  }
  select.addEventListener("change", renderApsa);
  renderApsa();
});