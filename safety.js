
export function renderSafety(root){
  root.insertAdjacentHTML('beforeend', `
    <section class="card">
      <h2>Fiches sécurité</h2>
      <p>Ces fiches sont embarquées et consultables hors-ligne.</p>
      <div class="grid">
        <div class="card third">
          <h3>Course — sécurité générale</h3>
          <p class="small">Échauffement progressif, hydratation, respect des allures, zones de course sécurisées.</p>
          <button class="btn" data-open="safety/course.html">Ouvrir</button>
        </div>
        <div class="card third">
          <h3>Escalade — consignes</h3>
          <p class="small">Vérification du matériel, parade, consignes de déplacement au pied des voies.</p>
          <button class="btn" data-open="safety/escalade.html">Ouvrir</button>
        </div>
        <div class="card third">
          <h3>Natation — consignes</h3>
          <p class="small">Entrée dans l’eau, sens de nage, respect des lignes, récupération.</p>
          <button class="btn" data-open="safety/natation.html">Ouvrir</button>
        </div>
      </div>
    </section>
  `);

  root.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-open]');
    if(!btn) return;
    const path = btn.dataset.open;
    const w = window.open(path, '_blank');
    if(!w) location.href = path;
  });
}
