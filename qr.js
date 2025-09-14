
document.addEventListener("DOMContentLoaded", ()=>{
  const payload = sessionStorage.getItem("ceps:qr_payload") || "";
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
