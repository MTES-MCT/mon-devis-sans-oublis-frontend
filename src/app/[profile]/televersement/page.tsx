// Page de redirection temporaire
// TODO : A supprimer quand on la bascule sera considérée comme faite
import { redirect, notFound } from "next/navigation";
import { Profile } from "@/types";

interface PageProps {
  params: Promise<{
    profile: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LegacyTeleversementRedirect({
  params,
  searchParams,
}: PageProps) {
  const { profile } = await params;

  // Vérifier que le profil est valide
  const validProfiles = Object.values(Profile);
  if (!validProfiles.includes(profile as Profile)) {
    notFound();
  }

  // Construire l'URL de redirection avec les paramètres de query
  const query = await searchParams;
  const queryString = new URLSearchParams(
    query as Record<string, string>
  ).toString();
  const redirectUrl = `/${profile}/type-renovation${queryString ? `?${queryString}` : ""}`;

  // Redirection vers la page de choix du type de rénovation
  redirect(redirectUrl);
}
