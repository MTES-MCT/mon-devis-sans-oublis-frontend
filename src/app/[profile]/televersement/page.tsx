// Page de redirection temporaire
// TODO : A supprimer quand on la bascule sera considérée comme faite
import { redirect, notFound } from "next/navigation";
import { Profile } from "@/types";

interface PageProps {
  params: Promise<{
    profile: string;
  }>;
}

export default async function LegacyTeleversementRedirect({
  params,
}: PageProps) {
  const { profile } = await params;

  // Vérifier que le profil est valide
  const validProfiles = Object.values(Profile);
  if (!validProfiles.includes(profile as Profile)) {
    notFound();
  }

  // Redirection vers la page de choix du type de rénovation
  redirect(`/${profile}/type-renovation`);
}
