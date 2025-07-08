"use client";

import { useState, useEffect } from "react";
import { checkRGE } from "@/actions/dataChecks.actions";
import { DataCheckRgeResult } from "@/types/dataChecks.types";

interface RgeFormProps {
  onResults: (results: DataCheckRgeResult) => void;
  onLoading: (loading: boolean) => void;
}

export default function RgeForm({ onResults, onLoading }: RgeFormProps) {
  const [siret, setSiret] = useState("");
  const [rge, setRge] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!siret.trim()) {
      setError("Le SIRET est obligatoire");
      return;
    }

    onLoading(true);

    try {
      const results = await checkRGE({
        siret: siret.trim(),
        rge: rge.trim() || undefined,
        date: date.trim() || undefined,
      });

      onResults(results);
    } catch {
      setError("Erreur de connexion. Vérifiez votre connexion internet.");
    } finally {
      onLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="fr-callout">
        <h3 className="fr-callout__title">Chargement du formulaire...</h3>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset
        className="fr-fieldset"
        aria-labelledby="rge-legend rge-messages"
      >
        <legend className="fr-fieldset__legend" id="rge-legend">
          Vérification du statut RGE
          <span className="fr-hint-text">
            Renseignez au minimum le SIRET de l'entreprise
          </span>
        </legend>

        <div className="fr-fieldset__element">
          <div className="fr-input-group">
            <label className="fr-label" htmlFor="siret-input">
              SIRET de l'entreprise *
              <span className="fr-hint-text">14 chiffres sans espaces</span>
            </label>
            <input
              className="fr-input"
              name="siret"
              id="siret-input"
              type="text"
              value={siret}
              onChange={(e) => setSiret(e.target.value)}
              placeholder="12345678901234"
              maxLength={14}
              required
              suppressHydrationWarning
            />
          </div>
        </div>

        <div className="fr-fieldset__element">
          <div className="fr-input-group">
            <label className="fr-label" htmlFor="rge-input">
              Numéro RGE (optionnel)
              <span className="fr-hint-text">
                Pour valider un numéro RGE spécifique
              </span>
            </label>
            <input
              className="fr-input"
              name="rge"
              id="rge-input"
              type="text"
              value={rge}
              onChange={(e) => setRge(e.target.value)}
              placeholder="RGE123456"
              suppressHydrationWarning
            />
          </div>
        </div>

        <div className="fr-fieldset__element">
          <div className="fr-input-group">
            <label className="fr-label" htmlFor="date-input">
              Date de vérification (optionnel)
              <span className="fr-hint-text">Format : AAAA-MM-JJ</span>
            </label>
            <input
              className="fr-input"
              name="date"
              id="date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              suppressHydrationWarning
            />
          </div>
        </div>

        <div className="fr-messages-group" id="rge-messages" aria-live="polite">
          {error && <p className="fr-message fr-message--error">{error}</p>}
        </div>
      </fieldset>

      <div className="fr-btns-group">
        <button className="fr-btn" type="submit" suppressHydrationWarning>
          Vérifier le statut RGE
        </button>
      </div>
    </form>
  );
}
