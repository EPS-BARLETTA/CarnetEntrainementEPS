import {store, keys} from './assets/js/storage.js';
const wrap = document.getElementById('qrWrap');
const qrBox = document.getElementById('qrBox');
const btnContrast = document.getElementById('btn-contrast');
const btnFull = document.getElementById('btn-full');
const btnDownload = document.getElementById('btn-download');
const last = store.get(keys.derniereSeance, null);
if(!last){
  qrBox.innerHTML = '<div class="sub">Aucune séance enregistrée.</div>';
} else {
  const data = JSON.stringify(last);
  // QRCode library expected at window.QRCode
  try{
    const el = document.getElementById('qrcode');
    el.innerHTML='';
    const qr = new window.QRCode(el, {text:data, width:256, height:256, correctLevel: window.QRCode.CorrectLevel.M});
    // store reference for download
    window.__qrCanvas = el.querySelector('canvas');
  }catch(e){
    qrBox.innerHTML = '<div class="sub">QR indisponible (lib manquante). Utilise l\'export CSV.</div>';
  }
}
btnContrast.addEventListener('click', ()=>{
  document.body.classList.toggle('contrast-dark');
});
btnFull.addEventListener('click', ()=>{
  if(qrBox.requestFullscreen) qrBox.requestFullscreen();
});
btnDownload.addEventListener('click', ()=>{
  const c = window.__qrCanvas;
  if(!c){ alert('QR non disponible.'); return; }
  const a = document.createElement('a'); a.download = 'qr.png'; a.href = c.toDataURL('image/png'); a.click();
});
