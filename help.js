
export function renderAbout(root){
  root.insertAdjacentHTML('beforeend', `
    <section class="card">
      <h2>Aide</h2>
      <ul>
        <li><b>QR Identité</b> : crée l’élève dans ScanProf (Nom, Prénom, Classe, Sexe).</li>
        <li><b>QR Séance</b> : envoie uniquement les champs compatibles (VMA, palier, navettes, Distance, Vitesse, etc.).</li>
        <li><b>Calendrier</b> : ajoute des séances par jour et génère les QR à la demande.</li>
        <li><b>Fiches sécurité</b> : documents hors-ligne, imprimables.</li>
        <li><b>Échauffements</b> : modèles par activité (impression possible).</li>
        <li><b>Exports</b> : CSV (élève) et JSON (sauvegarde locale).</li>
      </ul>
      <p class="small">Astuce : si vous ajoutez <code>qrcode.min.js</code> (lib locale), l’app l’utilisera automatiquement au lieu du service web.</p>
    </section>
  `);
}
