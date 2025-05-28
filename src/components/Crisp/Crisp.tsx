"use client";

import { useEffect } from "react";
import { getClientEnv } from "@/lib/config/env.config";

export default function CrispWrapper() {
  useEffect(() => {
    try {
      const clientEnv = getClientEnv();
      const websiteId = clientEnv.NEXT_PUBLIC_CRISP_WEBSITE_ID;
      
      
      if (typeof window === "undefined") {
        console.log("Window undefined");
        return;
      }

      if (!websiteId || websiteId.trim() === "") {
        console.log("NEXT_PUBLIC_CRISP_WEBSITE_ID non configuré - Crisp désactivé");
        return;
      }

      // Éviter la double initialisation
      if ((window as any).$crisp) {
        console.log("Crisp déjà initialisé");
        return;
      }

      // Initialisation de Crisp
      (window as any).$crisp = [];
      (window as any).CRISP_WEBSITE_ID = websiteId;

      const script = document.createElement("script");
      script.src = "https://client.crisp.chat/l.js";
      script.async = true;
      
      script.onload = () => {
        console.log("Script Crisp chargé avec succès !");
      };
      
      script.onerror = (error) => {
        console.log("Erreur chargement script Crisp:", error);
      };

      document.head.appendChild(script);

    } catch (error) {
      console.log("Erreur initialisation Crisp:", error);
    }
  }, []);

  return null;
}