import {store, keys} from './assets/js/storage.js';
const qrBox = document.getElementById('qrBox');
const btnContrast = document.getElementById('btn-contrast');
const btnFull = document.getElementById('btn-full');
const btnDownload = document.getElementById('btn-download');
const last = store.get(keys.derniereSeance, null);
if(!last){
  qrBox.innerHTML = '<div class="sub">Aucune séance enregistrée.</div>';
} else {
  const data = JSON.stringify(last);
  try{
    const el = document.getElementById('qrcode');
    el.innerHTML='';
    const qr = new window.QRCode(el, {text:data, width:320, height:320, correctLevel: window.QRCode.CorrectLevel.M});
    window.__qrCanvas = el.querySelector('canvas');
  }catch(e){
    qrBox.innerHTML = '<div class="sub">QR indisponible. Vérifie que <code>qrcode.min.js</code> est bien à la racine.</div>';
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
