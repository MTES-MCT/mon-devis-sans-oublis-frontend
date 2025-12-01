// Page de redirection temporaire
// TODO : A supprimer quand on la bascule sera considérée comme faite
import { redirect, notFound } from "next/navigation";
import { Profile } from "@/types";

interface PageProps {
  params: Promise<{
    profile: string;
    quoteCheckId: string;
  }>;
}

export default async function LegacyModifierRedirect({ params }: PageProps) {
  const { profile, quoteCheckId } = await params;

  // Vérifier que le profil est valide
  const validProfiles = Object.values(Profile);
  if (!validProfiles.includes(profile as Profile)) {
    notFound();
  }

  // Vérifier le format du quoteCheckId
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(quoteCheckId)) {
    notFound();
  }

  // Redirection vers la nouvelle URL
  redirect(`/${profile}/devis/${quoteCheckId}`);
}
