import { isProduction } from "@/lib/config/env.config";
import { ReactNode } from "react";

interface ProtectedDebugPageProps {
  children: ReactNode;
}

export default function ProtectedDebugPage({
  children,
}: ProtectedDebugPageProps) {
  if (isProduction()) {
    return (
      <div className="fr-alert fr-alert--error">
        <h3 className="fr-alert__title">Accès refusé</h3>
        <p>Cette page n'est pas disponible en production.</p>
      </div>
    );
  }

  return <>{children}</>;
}
