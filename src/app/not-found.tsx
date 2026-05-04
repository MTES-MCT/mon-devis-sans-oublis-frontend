import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fr-container">
      <div className="fr-my-7w fr-mt-md-12w fr-mb-md-10w fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center">
        <div className="fr-py-0 fr-col-12 fr-col-md-6">
          <h1>Page non trouvée</h1>
          <p className="fr-text--sm fr-mb-3w">Erreur 404</p>
          <p className="fr-text--lead fr-mb-3w">
            La page que vous cherchez est introuvable. Le service Mon Devis Sans
            Oublis a cessé son activité le 1er mai 2026.
          </p>
          <ul className="fr-btns-group fr-btns-group--inline-md">
            <li>
              <Link className="fr-btn" href="/">
                Page d&apos;accueil
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
