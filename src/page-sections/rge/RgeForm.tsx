"use client";

import { useState, useEffect } from "react";
import { checkRGE } from "@/actions/dataChecks.actions";
import { DataCheckRgeResult } from "@/types/dataChecks.types";
import { hasErrorDetails, isApiError, CheckRGEGesteTypes } from "@/types";
import { DropdownCheckboxList } from "@/components";
import { formatSiretDisplay } from "@/utils";

interface RgeFormProps {
  onResults: (results: DataCheckRgeResult, selectedGestes: string[]) => void;
  onLoading: (loading: boolean) => void;
  typeGesteMetadata: CheckRGEGesteTypes;
}

export default function RgeForm({
  onResults,
  onLoading,
  typeGesteMetadata,
}: RgeFormProps) {
  const [siret, setSiret] = useState("");
  const [displaySiret, setDisplaySiret] = useState("");
  const [selectedGestes, setSelectedGestes] = useState<string[]>([]);
  const [rge, setRge] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSiretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Extraire uniquement les chiffres pour la valeur réelle
    const cleanValue = inputValue.replace(/\D/g, "");

    // Mettre à jour les états
    setSiret(cleanValue);
    setDisplaySiret(formatSiretDisplay(inputValue));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!siret.trim()) {
      setError("Le SIRET est obligatoire");
      return;
    }

    if (siret.length !== 14) {
      setError("Le SIRET doit contenir exactement 14 chiffres");
      return;
    }

    if (selectedGestes.length == 0) {
      setError("Au moins un geste doit être sélectionné");
      return;
    }

    onLoading(true);

    try {
      const results = await checkRGE({
        siret: siret.trim(),
        gestes: selectedGestes,
        rge: rge.trim() || undefined,
        date: date.trim() || undefined,
      });

      onResults(results, selectedGestes);
    } catch (error: unknown) {
      if (hasErrorDetails(error)) {
        const messages = error.error_details.map((d) => d.message || d.code);
        setError(messages.join(" / "));
      } else if (isApiError(error)) {
        if (error.status === 422) {
          setError("Erreur 422 : Données invalides. Vérifiez les champs.");
        } else {
          setError(`Erreur API : ${error.message}`);
        }
      } else {
        setError("Erreur inattendue. Veuillez réessayer.");
      }
    } finally {
      onLoading(false);
    }
  };

  const handleGestesChange = (values: string[]) => {
    setSelectedGestes(values);
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
        {/* Titre vérification RGE */}
        <legend className="fr-fieldset__legend" id="rge-legend">
          Vérification du statut RGE
          <span className="fr-hint-text">
            Renseignez au minimum le SIRET de l'entreprise ainsi qu'un geste de
            travaux.
          </span>
        </legend>

        {/* Choix du SIRET */}
        <div className="fr-fieldset__element">
          <div className="fr-input-group">
            <label className="fr-label" htmlFor="siret-input">
              SIRET de l'entreprise *
              <span className="fr-hint-text">14 chiffres</span>
            </label>
            <input
              className="fr-input"
              name="siret"
              id="siret-input"
              type="text"
              value={displaySiret}
              onChange={handleSiretChange}
              placeholder="123 456 789 01234"
              maxLength={17} // 14 chiffres + 3 espaces
              required
              suppressHydrationWarning
            />
          </div>
        </div>

        {/* Choix des gestes */}
        {typeGesteMetadata && (
          <div className="fr-fieldset__element">
            <div className="fr-input-group">
              <DropdownCheckboxList
                label=" Gestes pour lesquels vérifier le RGE"
                hintLabel="Pour valider un ou plusieurs gestes"
                multiple={true}
                onChange={handleGestesChange}
                options={typeGesteMetadata.options.map(
                  ({ label, value, group }) => ({
                    id: value,
                    label,
                    group,
                  })
                )}
              />
            </div>
          </div>
        )}

        {/* Choix du numéro RGE */}
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

        {/* Choix de la date de vérification */}
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

        {/* Affichage des erreurs éventuelles */}
        <div className="fr-messages-group" id="rge-messages" aria-live="polite">
          {error && <p className="fr-message fr-message--error">{error}</p>}
        </div>
      </fieldset>

      {/* Bouton valider */}
      <div className="fr-btns-group">
        <button className="fr-btn" type="submit" suppressHydrationWarning>
          Vérifier le statut RGE
        </button>
      </div>
    </form>
  );
}
