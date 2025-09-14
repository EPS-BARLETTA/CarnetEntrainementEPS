
document.addEventListener("DOMContentLoaded", ()=>{
  let payload = sessionStorage.getItem("ceps:qr_payload") || "";
  // Fallback si page ouverte directement : reprendre la dernière séance enregistrée
  if(!payload){
    const nom = localStorage.getItem("ceps:last_nom")||"";
    const prenom = localStorage.getItem("ceps:last_prenom")||"";
    const classe = localStorage.getItem("ceps:last_classe")||"";
    const tri = localStorage.getItem("ceps:last_tri")||"";
    const key = `cahier_eps:${nom}:${prenom}:${classe}:${tri}`;
    try{
      const raw = localStorage.getItem(key);
      if(raw){
        const obj = JSON.parse(raw);
        const last = (obj.seances||[])[(obj.seances||[]).length-1];
        if(last){ payload = JSON.stringify(last); }
      }
    }catch(e){}
  }
  const container = document.getElementById("qrc");
  container.innerHTML = "";
  try{
    new QRCode(container, { text: payload || "{}", width: 320, height: 320, correctLevel: QRCode.CorrectLevel.M });
  }catch(e){
    container.textContent = "Erreur de génération du QR.";
  }
  document.getElementById("download_qr").addEventListener("click", ()=>{
    const img = container.querySelector("img");
    const canvas = container.querySelector("canvas");
    const src = img ? img.src : (canvas ? canvas.toDataURL("image/png") : null);
    if(!src){ alert("QR non disponible."); return; }
    const a = document.createElement("a"); a.href = src; a.download = "QR_Seance.png"; a.click();
  });
});
