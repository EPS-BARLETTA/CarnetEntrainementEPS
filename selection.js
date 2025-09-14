
document.addEventListener("DOMContentLoaded", () => {
  const chips = document.getElementById("chips");
  let activite = "Demi-fond";
  chips.addEventListener("click", (e)=>{
    const b = e.target.closest(".chip"); if(!b) return;
    document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
    b.classList.add("active");
    activite = b.dataset.apsa;
  });

  document.getElementById("go").addEventListener("click", ()=>{
    const id = document.getElementById("eleve_id").value.trim();
    const tri = document.getElementById("trimestre").value.trim();
    const nom = document.getElementById("nom").value.trim().toUpperCase();
    const prenom = document.getElementById("prenom").value.trim();
    const classe = document.getElementById("classe").value.trim();
    const sexe = document.getElementById("sexe").value;

    if(!id || !tri || !nom || !prenom || !classe){
      alert("Merci de compléter l'identité (ID, Trimestre, Nom, Prénom, Classe).");
      return;
    }
    // persist quick profile for later pages
    localStorage.setItem("ceps:last_id", id);
    localStorage.setItem("ceps:last_tri", tri);
    localStorage.setItem("ceps:last_nom", nom);
    localStorage.setItem("ceps:last_prenom", prenom);
    localStorage.setItem("ceps:last_classe", classe);
    localStorage.setItem("ceps:last_sexe", sexe);
    localStorage.setItem("ceps:last_apsa", activite);
    location.href = `saisie.html`;
  });
});
