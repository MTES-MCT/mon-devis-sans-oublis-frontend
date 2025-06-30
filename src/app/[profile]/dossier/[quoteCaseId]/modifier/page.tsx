import InvalidQuoteCase from "@/page-sections/result/quoteCase/InvalidQuoteCase";
import { getQuoteCase } from "@/actions/quoteCase.actions";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    profile: string;
    quoteCaseId: string;
  }>;
}

export default async function ModifierPage({ params }: PageProps) {
  const { profile, quoteCaseId } = await params;

  // Validation
  if (!quoteCaseId || !profile) {
    notFound();
  }

  try {
    // Charger les données côté serveur
    const currentQuoteCase = await getQuoteCase(quoteCaseId);

    // Calculer les stats
    const quoteChecks = currentQuoteCase.quote_checks || [];
    const stats = {
      total: quoteChecks.length,
      processed: quoteChecks.length,
      valid: quoteChecks.filter((q) => q.status === "valid").length,
      invalid: quoteChecks.filter((q) => q.status === "invalid").length,
      pending: 0,
    };

    const analysisDate = currentQuoteCase.finished_at
      ? new Date(currentQuoteCase.finished_at).toLocaleDateString("fr-FR")
      : "";

    return (
      <InvalidQuoteCase
        analysisDate={analysisDate}
        dossier={currentQuoteCase}
        stats={stats}
        profile={profile}
        quoteCaseId={quoteCaseId}
        onNavigateToQuote={() => {}} // TODO: Implémenter la navigation vers le devis
      />
    );
  } catch (error) {
    console.error("Erreur lors du chargement du dossier:", error);
    notFound();
  }
}
