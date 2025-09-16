
function useLocalLib(container, text){
  try{
    if(typeof QRCode === 'function'){
      container.innerHTML = '';
      const box = document.createElement('div');
      box.className = 'qr-box';
      container.appendChild(box);
      new QRCode(box, { text, width: 180, height: 180 });
      return true;
    }
  }catch(e){}
  return false;
}

function useApi(container, text){
  const url = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(text);
  container.innerHTML = '';
  const img = document.createElement('img');
  img.src = url; img.alt = 'QR';
  img.width = 180; img.height = 180;
  img.className = 'qr-box';
  container.appendChild(img);
}

export function buildIdentityQR(container, payload){
  const json = JSON.stringify(payload);
  if(!useLocalLib(container, json)) useApi(container, json);
  const caption = document.createElement('div');
  caption.className = 'small';
  caption.textContent = 'QR identité (compatible ScanProf)';
  container.appendChild(caption);
}

export function buildSessionQR(container, payload){
  const json = JSON.stringify(payload);
  if(!useLocalLib(container, json)) useApi(container, json);
  const caption = document.createElement('div');
  caption.className = 'small';
  caption.textContent = 'QR séance (compatible ScanProf)';
  container.appendChild(caption);
}
