
document.addEventListener("DOMContentLoaded",()=>{
  let apsa="Demi-fond";
  document.getElementById("chips").addEventListener("click",e=>{
    if(e.target.classList.contains("chip")){
      document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
      e.target.classList.add("active"); apsa=e.target.dataset.apsa;
    }
  });
  document.getElementById("go").addEventListener("click",()=>{
    const nom=document.getElementById("nom").value.trim();
    const prenom=document.getElementById("prenom").value.trim();
    const classe=document.getElementById("classe").value.trim();
    const trimestre=document.getElementById("trimestre").value.trim();
    if(!nom||!prenom||!classe||!trimestre){alert("Complète tout");return;}
    localStorage.setItem("ceps:last",JSON.stringify({nom,prenom,classe,trimestre,apsa}));
    location.href="saisie.html";
  });
});
