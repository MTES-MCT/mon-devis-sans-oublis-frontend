import { QuoteCase } from "@/types";

interface QuoteStats {
  total: number;
  processed: number;
  valid: number;
  invalid: number;
  pending: number;
}

interface ValidQuoteCaseProps {
  analysisDate: string;
  dossier: QuoteCase;
  stats: QuoteStats;
  profile: string;
}

export default function ValidQuoteCase({
  //   analysisDate,
  //   dossier,
  stats,
  //   profile,
}: ValidQuoteCaseProps) {
  return (
    <section className="fr-container fr-py-10w">
      {/* Message de succès principal */}
      <div className="fr-alert fr-alert--success fr-mb-6w">
        <h2 className="fr-h4">
          🎉 Félicitations ! Votre dossier est entièrement conforme
        </h2>
        <p>
          Tous vos devis ({stats.total}) respectent les critères requis pour la
          rénovation d'ampleur. Vous pouvez procéder à la suite de votre projet.
        </p>
      </div>
    </section>
  );
}
