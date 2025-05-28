// src/hooks/useCrisp.ts
"use client";

import { useEffect, useState } from "react";

export const useCrisp = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkCrisp = () => {
      if (typeof window !== "undefined") {
        const crisp = (window as any).$crisp;
        if (crisp && typeof crisp.push === "function") {
          console.log("✅ Crisp détecté et fonctionnel");
          setIsLoaded(true);
          return true;
        }
      }
      return false;
    };

    // Vérification immédiate
    if (checkCrisp()) return;

    // Vérification périodique pendant 10 secondes max
    let attempts = 0;
    const maxAttempts = 20;
    
    const interval = setInterval(() => {
      attempts++;
      console.log(`🔄 Tentative ${attempts}/${maxAttempts} - Vérification Crisp...`);
      
      if (checkCrisp() || attempts >= maxAttempts) {
        clearInterval(interval);
        if (attempts >= maxAttempts) {
          console.log("❌ Timeout - Crisp non détecté après 10 secondes");
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const openChat = () => {
    if (typeof window !== "undefined") {
      const crisp = (window as any).$crisp;
      if (crisp && typeof crisp.push === "function") {
        console.log("🗨️ Ouverture du chat Crisp");
        crisp.push(["do", "chat:open"]);
      } else {
        console.log("❌ Impossible d'ouvrir le chat - Crisp non disponible");
      }
    }
  };

  const sendMessage = (message: string) => {
    if (typeof window !== "undefined") {
      const crisp = (window as any).$crisp;
      if (crisp && typeof crisp.push === "function") {
        console.log("📨 Envoi message:", message);
        crisp.push(["do", "message:send", ["text", message]]);
      } else {
        console.log("❌ Impossible d'envoyer le message - Crisp non disponible");
      }
    }
  };

  return {
    isLoaded,
    openChat,
    sendMessage,
  };
};