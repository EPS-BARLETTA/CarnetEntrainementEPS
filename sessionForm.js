
export function sessionForm({ onSubmit }){
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="form-row">
      <div>
        <label>Type</label>
        <select class="input" id="stype">
          <option>Course</option>
          <option>Luc Léger</option>
          <option>Sprint 30m</option>
          <option>Saut en longueur</option>
          <option>Natation</option>
          <option>Escalade</option>
        </select>
      </div>
      <div>
        <label>Date</label>
        <input type="date" class="input" id="sdate" value="${new Date().toISOString().slice(0,10)}">
      </div>
    </div>
    <div id="dynamic"></div>
    <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn primary" id="saveSession">Enregistrer</button>
    </div>
  `;

  const dyn = wrap.querySelector('#dynamic');
  const typeSel = wrap.querySelector('#stype');
  function renderFields(){
    const t = typeSel.value;
    let fields = '';
    if(t==='Luc Léger'){
      fields = `
        <div class="form-row">
          <div><label>VMA<input class="input" id="VMA" type="number" step="0.1"></label></div>
          <div><label>palier<input class="input" id="palier" type="number" step="1"></label></div>
        </div>
        <div class="form-row">
          <div><label>navettes<input class="input" id="navettes" type="number" step="1"></label></div>
          <div><label>Notes<textarea class="input" id="notes"></textarea></label></div>
        </div>`;
    } else if(t==='Sprint 30m'){
      fields = `
        <div class="form-row">
          <div><label>Vitesse (km/h)<input class="input" id="Vitesse" type="number" step="0.1"></label></div>
          <div><label>Temps 30m (s)<input class="input" id="Temps30m" type="number" step="0.01"></label></div>
        </div>
        <div><label>Notes<textarea class="input" id="notes"></textarea></label></div>`;
    } else if(t==='Saut en longueur'){
      fields = `
        <div class="form-row">
          <div><label>Longueur (m)<input class="input" id="Longueur" type="number" step="0.01"></label></div>
          <div><label>Notes<textarea class="input" id="notes"></textarea></label></div>
        </div>`;
    } else if(t==='Natation'){
      fields = `
        <div class="form-row">
          <div><label>Distance (m)<input class="input" id="Distance" type="number" step="1"></label></div>
          <div><label>Temps (s)<input class="input" id="Temps" type="number" step="0.01"></label></div>
        </div>
        <div class="form-row">
          <div><label>Allure (min/100m)<input class="input" id="Allure" type="text"></label></div>
          <div><label>Notes<textarea class="input" id="notes"></textarea></label></div>
        </div>`;
    } else if(t==='Escalade'){
      fields = `
        <div class="form-row">
          <div><label>Voies réussies<input class="input" id="Voies" type="number" step="1"></label></div>
          <div><label>Niveau (ex: 5c)<input class="input" id="Niveau" type="text"></label></div>
        </div>
        <div><label>Notes<textarea class="input" id="notes"></textarea></label></div>`;
    } else { // Course (endurance)
      fields = `
        <div class="form-row">
          <div><label>Distance (km)<input class="input" id="Distance" type="number" step="0.01"></label></div>
          <div><label>Vitesse (km/h)<input class="input" id="Vitesse" type="number" step="0.1"></label></div>
        </div>
        <div><label>Notes<textarea class="input" id="notes"></textarea></label></div>`;
    }
    dyn.innerHTML = fields;
  }
  renderFields();
  typeSel.addEventListener('change', renderFields);

  wrap.querySelector('#saveSession').addEventListener('click', ()=>{
    const t = typeSel.value;
    const get = (id)=>{
      const el = dyn.querySelector('#'+id);
      return el? el.value : undefined;
    };
    const payload = { };
    const ids = Array.from(dyn.querySelectorAll('input,textarea')).map(x=>x.id);
    ids.forEach(id => {
      const v = get(id);
      if(v!=='' && v!=null) payload[id] = isNaN(Number(v)) ? v : Number(v);
    });
    if(typeof onSubmit === 'function'){
      onSubmit(payload);
    }
  });

  return wrap;
}
