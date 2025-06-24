"use client";

import { WindowWithCrisp } from "@/types";
import { useEffect, useState } from "react";

export const useCrisp = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkCrisp = () => {
      if (typeof window !== "undefined") {
        const windowWithCrisp = window as WindowWithCrisp;
        const crisp = windowWithCrisp.$crisp;
        if (crisp && typeof crisp.push === "function") {
          crisp.push(["safe", true]);
          console.log("Crisp détecté et fonctionnel");
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
      console.log(
        `Tentative ${attempts}/${maxAttempts} - Vérification Crisp...`
      );

      if (checkCrisp() || attempts >= maxAttempts) {
        clearInterval(interval);
        if (attempts >= maxAttempts) {
          console.log("Timeout - Crisp non détecté après 10 secondes");
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  /**
   * Ouvre le chat Crisp
   */
  const openChat = () => {
    if (typeof window !== "undefined") {
      const windowWithCrisp = window as WindowWithCrisp;
      const crisp = windowWithCrisp.$crisp;
      if (crisp && typeof crisp.push === "function") {
        crisp.push(["do", "chat:open"]);
      } else {
        console.log("Impossible d'ouvrir le chat - Crisp non disponible");
      }
    }
  };

  /**
   * Envoie un message silencieux dans Crisp (sans ouvrir le chat)
   */
  const sendMessage = (message: string) => {
    if (typeof window !== "undefined") {
      const windowWithCrisp = window as WindowWithCrisp;
      const crisp = windowWithCrisp.$crisp;
      if (crisp && typeof crisp.push === "function") {
        crisp.push(["do", "message:send", ["text", message]]);
      } else {
        console.log("Impossible d'envoyer le message - Crisp non disponible");
      }
    }
  };

  /**
   * Envoie un message ET ouvre le chat automatiquement
   */
  const promptUser = (message: string) => {
    if (typeof window !== "undefined") {
      const windowWithCrisp = window as WindowWithCrisp;
      const crisp = windowWithCrisp.$crisp;
      if (crisp && typeof crisp.push === "function") {
        crisp.push(["do", "message:send", ["text", message]]);
        crisp.push(["do", "chat:open"]);
      } else {
        console.log(
          "Impossible de prompter l'utilisateur - Crisp non disponible"
        );
      }
    }
  };

  /**
   * Déclenche un événement personnalisé dans Crisp
   */
  const triggerEvent = (eventName: string) => {
    if (typeof window !== "undefined") {
      const windowWithCrisp = window as WindowWithCrisp;
      const crisp = windowWithCrisp.$crisp;
      if (crisp && typeof crisp.push === "function") {
        console.log(`Déclenchement de l'événement Crisp: ${eventName}`);
        crisp.push(["do", "trigger:run", [eventName]]);
      } else {
        console.log(
          `Impossible de déclencher l'événement ${eventName} - Crisp non disponible`
        );
      }
    }
  };

  return {
    isLoaded,
    openChat,
    sendMessage,
    promptUser,
    triggerEvent,
  };
};
