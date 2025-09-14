
document.addEventListener("DOMContentLoaded", ()=>{
  document.getElementById("go").addEventListener("click", ()=>{
    const nom = (document.getElementById("nom").value||"").trim().toUpperCase();
    const prenom = (document.getElementById("prenom").value||"").trim();
    const classe = (document.getElementById("classe").value||"").trim();
    const tri = (document.getElementById("trimestre").value||"").trim();
    const apsa = (document.getElementById("apsa").value||"").trim();
    if(!nom || !prenom || !classe || !tri || !apsa){ alert("Complète tous les champs."); return; }
    localStorage.setItem("ceps:last_nom", nom);
    localStorage.setItem("ceps:last_prenom", prenom);
    localStorage.setItem("ceps:last_classe", classe);
    localStorage.setItem("ceps:last_tri", tri);
    localStorage.setItem("ceps:last_apsa", apsa);
    location.href = "saisie.html";
  });
});
