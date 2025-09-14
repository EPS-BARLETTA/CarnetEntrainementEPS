
document.addEventListener("DOMContentLoaded", ()=>{
  const host = document.getElementById("qr_canvas");
  const payload = sessionStorage.getItem("ceps:qr_payload") || "{}";
  const canvas = window.QRCodeGen(payload);
  host.appendChild(canvas);

  // show as image for long-press Save to Photos
  const imgWrap = document.getElementById("qr_img_wrap");
  const img = new Image();
  img.src = canvas.toDataURL("image/png");
  img.alt = "QR de la séance";
  img.style.maxWidth = "100%";
  img.style.height = "auto";
  imgWrap.appendChild(img);

  document.getElementById("download_qr").addEventListener("click", ()=>{
    const a = document.createElement("a");
    a.href = img.src;
    a.download = "QR_Seance.png";
    a.click();
  });
});
