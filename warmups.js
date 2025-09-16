
import presets from '../../warmups/presets.json' assert { type: 'json' };

export function renderWarmups(root){
  root.insertAdjacentHTML('beforeend', `
    <section class="card">
      <h2>Échauffements</h2>
      <p class="small">Choisis un échauffement ou assemble le tien pour la séance d’évaluation.</p>
      <div class="form-row">
        <div>
          <label>Modèles</label>
          <select class="input" id="preset"></select>
        </div>
        <div>
          <label>Durée cible (min)</label>
          <input type="number" class="input" id="duree" value="12">
        </div>
      </div>
      <div style="margin-top:10px">
        <button class="btn" id="preview">Prévisualiser</button>
        <button class="btn primary" id="print">Imprimer</button>
      </div>
      <div id="zone" style="margin-top:10px"></div>
    </section>
  `);
  const sel = root.querySelector('#preset');
  presets.forEach(p=>{
    const o = document.createElement('option'); o.value = p.id; o.textContent = p.titre; sel.appendChild(o);
  });
  sel.value = presets[0]?.id || '';

  root.querySelector('#preview').addEventListener('click', ()=>{
    const pr = presets.find(x=>x.id===sel.value);
    const duree = Number(root.querySelector('#duree').value)||0;
    root.querySelector('#zone').innerHTML = renderPlan(pr, duree);
  });
  root.querySelector('#print').addEventListener('click', ()=>{
    window.print();
  });
}

function renderPlan(pr, duree){
  if(!pr) return '<p class="small">Aucun modèle.</p>';
  const blocks = pr.bl1.concat(pr.bl2||[], pr.bl3||[]);
  const totalParts = blocks.reduce((a,b)=>a+(b.part||1),0);
  return `
    <div class="card">
      <h3>${pr.titre}</h3>
      <table>
        <thead><tr><th>Bloc</th><th>Contenu</th><th>Durée estimée</th></tr></thead>
        <tbody>
          ${blocks.map((b,i)=>{
            const t = Math.round((b.part||1)/totalParts * duree);
            return `<tr><td>${i+1}</td><td>${b.txt}</td><td>${t} min</td></tr>`;
          }).join('')}
        </tbody>
      </table>
      <p class="small">Prévoir adaptation selon la séance d’évaluation.</p>
    </div>
  `;
}
