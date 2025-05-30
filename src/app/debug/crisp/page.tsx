"use client";

import { useState, useEffect } from "react";
import { useCrisp } from "@/hooks/useCrisp";
import ProtectedDebugPage from "@/components/debug/ProtectedDebugPage";

export default function CrispTestPage() {
  // Toujours appeler tous les hooks en premier
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("actions");
  const { isLoaded, openChat, sendMessage, promptUser } = useCrisp();

  // Éviter les problèmes d'hydration avec les extensions navigateur
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Attendre le montage côté client
  if (!isMounted) {
    return (
      <ProtectedDebugPage>
        <main role="main" id="content">
          <div className="fr-container fr-mt-8v fr-mt-md-14v fr-mb-2v fr-mb-md-8v">
            <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
              <div className="fr-col-12 fr-col-md-10 fr-col-lg-8">
                <h1 className="fr-h2">Test Crisp</h1>
                <div className="fr-alert fr-alert--info">
                  <h3 className="fr-alert__title">Chargement</h3>
                  <p>Initialisation en cours...</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </ProtectedDebugPage>
    );
  }

  return (
    <main role="main" id="content">
      <div className="fr-container fr-container--fluid fr-mb-md-14v">
        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
          <div className="fr-col-12 fr-col-lg-10">
            <div className="fr-container fr-background-alt--grey fr-px-md-0 fr-pt-10v fr-pt-md-14v fr-pb-6v fr-pb-md-10v">
              <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
                <div className="fr-col-12 fr-col-lg-11">
                  {/* Zone 1: Vérification de Crisp */}
                  <div className="fr-mb-6v">
                    <h2 className="fr-h4">État de Crisp</h2>
                    <hr />
                    <div
                      className={`fr-alert ${isLoaded ? "fr-alert--success" : "fr-alert--warning"}`}
                    >
                      <h3 className="fr-alert__title">
                        {isLoaded
                          ? "Service opérationnel"
                          : "Chargement en cours"}
                      </h3>
                      <p>
                        Crisp est{" "}
                        {isLoaded
                          ? "chargé et fonctionnel"
                          : "en cours de chargement"}
                      </p>
                    </div>
                  </div>

                  {/* Onglets */}
                  <div className="fr-tabs">
                    <ul
                      className="fr-tabs__list"
                      role="tablist"
                      aria-label="Actions de test Crisp"
                    >
                      <li role="presentation">
                        <button
                          id="tab-actions"
                          className={`fr-tabs__tab ${activeTab === "actions" ? "fr-tabs__tab--selected" : ""}`}
                          role="tab"
                          aria-selected={activeTab === "actions"}
                          aria-controls="tab-actions-panel"
                          onClick={() => setActiveTab("actions")}
                        >
                          Actions principales
                        </button>
                      </li>
                      <li role="presentation">
                        <button
                          id="tab-tests"
                          className={`fr-tabs__tab ${activeTab === "tests" ? "fr-tabs__tab--selected" : ""}`}
                          role="tab"
                          aria-selected={activeTab === "tests"}
                          aria-controls="tab-tests-panel"
                          onClick={() => setActiveTab("tests")}
                        >
                          Tests rapides
                        </button>
                      </li>
                    </ul>

                    {/* Panel Actions principales */}
                    <div
                      id="tab-actions-panel"
                      className={`fr-tabs__panel ${activeTab === "actions" ? "fr-tabs__panel--selected" : ""}`}
                      role="tabpanel"
                      aria-labelledby="tab-actions"
                    >
                      <fieldset className="fr-fieldset">
                        <legend className="fr-fieldset__legend">
                          <h3 className="fr-h5">Actions des hooks Crisp</h3>
                        </legend>

                        {/* Champ de saisie */}
                        <div className="fr-fieldset__element">
                          <div className="fr-input-group">
                            <label className="fr-label" htmlFor="crisp-message">
                              Message à envoyer
                              <span className="fr-hint-text">
                                Saisissez votre message de test
                              </span>
                            </label>
                            <input
                              className="fr-input"
                              type="text"
                              id="crisp-message"
                              name="crisp-message"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Votre message..."
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                message.trim() &&
                                sendMessage(message)
                              }
                            />
                          </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="fr-fieldset__element">
                          <ul className="fr-btns-group">
                            <li>
                              <button
                                className="fr-btn"
                                onClick={openChat}
                                disabled={!isLoaded}
                              >
                                Ouvrir le chat
                              </button>
                            </li>
                            <li>
                              <button
                                className="fr-btn fr-btn--secondary"
                                onClick={() => {
                                  if (message.trim()) {
                                    sendMessage(message);
                                    setMessage("");
                                  }
                                }}
                                disabled={!isLoaded || !message.trim()}
                              >
                                Envoyer silencieux
                              </button>
                            </li>
                            <li>
                              <button
                                className="fr-btn fr-btn--tertiary"
                                onClick={() => {
                                  if (message.trim()) {
                                    promptUser(message);
                                    setMessage("");
                                  }
                                }}
                                disabled={!isLoaded || !message.trim()}
                              >
                                Prompt utilisateur
                              </button>
                            </li>
                          </ul>
                        </div>
                      </fieldset>
                    </div>

                    {/* Panel Tests rapides */}
                    <div
                      id="tab-tests-panel"
                      className={`fr-tabs__panel ${activeTab === "tests" ? "fr-tabs__panel--selected" : ""}`}
                      role="tabpanel"
                      aria-labelledby="tab-tests"
                    >
                      <fieldset className="fr-fieldset">
                        <legend className="fr-fieldset__legend">
                          <h3 className="fr-h5">Tests prédéfinis</h3>
                        </legend>

                        <div className="fr-fieldset__element">
                          <p className="fr-hint-text">
                            Boutons de test avec des messages prédéfinis pour
                            valider rapidement les fonctionnalités.
                          </p>
                        </div>

                        <div className="fr-fieldset__element">
                          <ul className="fr-btns-group fr-btns-group--sm">
                            <li>
                              <button
                                className="fr-btn fr-btn--secondary fr-btn--sm"
                                onClick={() =>
                                  promptUser(
                                    "Bonjour, comment puis-je vous aider ?"
                                  )
                                }
                                disabled={!isLoaded}
                              >
                                Test prompt utilisateur
                              </button>
                            </li>
                            <li>
                              <button
                                className="fr-btn fr-btn--tertiary fr-btn--sm"
                                onClick={() =>
                                  sendMessage("Message silencieux de test")
                                }
                                disabled={!isLoaded}
                              >
                                Test silencieux
                              </button>
                            </li>
                          </ul>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
