
(function(){
  // Wrapper: use QRCode if available, else fallback to QRCodeGen (tiny)
  window.renderQR = function(node, text){
    if (window.QRCode) {
      return new QRCode(node, { text:text||"{}", width: 300, height: 300, correctLevel: QRCode.CorrectLevel.M });
    } else if (window.QRCodeGen) {
      const c = window.QRCodeGen(text||"{}"); node.innerHTML=""; node.appendChild(c); return c;
    } else {
      node.textContent = "QR indisponible.";
    }
  };
})();

document.addEventListener("DOMContentLoaded", ()=>{
  const payload = sessionStorage.getItem("ceps:qr_payload") || "";
  const container = document.getElementById("qrc");
  container.innerHTML = "";
  renderQR(container, payload);
  document.getElementById("download_qr").addEventListener("click", ()=>{
    const img = container.querySelector("img");
    const canvas = container.querySelector("canvas");
    const src = img ? img.src : (canvas ? canvas.toDataURL("image/png") : null);
    if(!src){ alert("QR non disponible."); return; }
    const a = document.createElement("a"); a.href = src; a.download = "QR_Seance.png"; a.click();
  });
});
