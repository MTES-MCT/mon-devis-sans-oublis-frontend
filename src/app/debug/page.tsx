"use client";

import {
  getClientEnv,
  getSharedEnv,
  isProduction,
  isStaging,
  isLocal,
  isDevelopment,
} from "@/lib/config/env.config";
import { useCrisp } from "@/hooks/useCrisp";
import { useEffect, useState } from "react";
import ProtectedDebugPage from "@/components/debug/ProtectedDebugPage";
import { checkApiAuth } from "@/actions/debug/auth.actions";

interface WindowWithServices extends Window {
  _paq?: unknown[];
}

export default function DebugPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [matomoStatus, setMatomoStatus] = useState<
    "disabled" | "loading" | "ready" | "error"
  >("loading");
  const [apiStatus, setApiStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );

  // Utilisation du hook useCrisp
  const { isLoaded: crispIsLoaded } = useCrisp();

  useEffect(() => {
    setIsMounted(true);

    // Vérifier Matomo
    const checkMatomo = () => {
      if (typeof window !== "undefined") {
        const windowWithServices = window as WindowWithServices;
        const hasPaq =
          windowWithServices._paq && Array.isArray(windowWithServices._paq);
        const hasMatomoScript =
          document.querySelector('script[src*="matomo"]') !== null;

        return hasPaq || hasMatomoScript;
      }
      return false;
    };

    if (!isProduction() && !isStaging()) {
      setMatomoStatus("disabled");
    } else {
      let matomoChecked = false;

      const interval = setInterval(() => {
        if (
          !matomoChecked &&
          (isProduction() || isStaging()) &&
          checkMatomo()
        ) {
          matomoChecked = true;
        }

        // Arrêter si tout est vérifié
        if (matomoChecked || (!isProduction() && !isStaging())) {
          clearInterval(interval);
        }
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
        if (matomoStatus === "loading" && (isProduction() || isStaging())) {
          setMatomoStatus("error");
        }
      }, 10000);

      if (isProduction() || isStaging()) {
        checkMatomo();
      }
    }
  }, [matomoStatus]);

  // useEffect pour l'API
  useEffect(() => {
    const checkApi = async () => {
      try {
        const result = await checkApiAuth();
        setApiStatus(result.success ? "ready" : "error");
      } catch {
        setApiStatus("error");
      }
    };

    checkApi();
  }, []);

  if (!isMounted) {
    return (
      <div className="fr-container fr-mt-8v">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-8">
            <div className="fr-alert fr-alert--info">
              <h3 className="fr-alert__title">Chargement</h3>
              <p>Vérification des services en cours...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  let clientEnv, sharedEnv;
  let clientError, sharedError;

  try {
    clientEnv = getClientEnv();
  } catch (error) {
    clientError = String(error);
  }

  try {
    sharedEnv = getSharedEnv();
  } catch (error) {
    sharedError = String(error);
  }

  // Evaluation des helpers d'environnement
  let envHelpers = {
    isLocal: false,
    isStaging: false,
    isProduction: false,
    isDevelopment: false,
  };
  let helpersError: string | null = null;

  try {
    envHelpers = {
      isLocal: isLocal(),
      isStaging: isStaging(),
      isProduction: isProduction(),
      isDevelopment: isDevelopment(),
    };
  } catch (error) {
    helpersError = String(error);
  }

  const crispStatus = crispIsLoaded ? "ready" : "loading";

  return (
    <ProtectedDebugPage>
      <div className="fr-container fr-mt-8v fr-mb-8v">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-lg-10">
            <h1 className="fr-h2 fr-mb-6v">Debug - Variables et Services</h1>

            {/* Section 0: Helpers d'environnement */}
            <div className="fr-mb-8v">
              <h2 className="fr-h4">Helpers d'Environnement</h2>
              <hr />

              {helpersError ? (
                <div className="fr-alert fr-alert--error">
                  <h3 className="fr-alert__title">Erreur des helpers</h3>
                  <p>{helpersError}</p>
                </div>
              ) : (
                <div className="fr-grid-row fr-grid-row--gutters">
                  <div className="fr-col-12 fr-col-md-6">
                    <div className="fr-card fr-card--grey">
                      <div className="fr-card__body">
                        <div className="fr-card__content">
                          <h3 className="fr-card__title">État des Helpers</h3>
                          <p className="fr-card__desc">
                            <strong>isLocal():</strong>{" "}
                            <span
                              className={`fr-badge ${
                                envHelpers.isLocal
                                  ? "fr-badge--success"
                                  : "fr-badge--info"
                              }`}
                            >
                              {envHelpers.isLocal ? "true" : "false"}
                            </span>
                            <br />
                            <strong>isStaging():</strong>{" "}
                            <span
                              className={`fr-badge ${
                                envHelpers.isStaging
                                  ? "fr-badge--success"
                                  : "fr-badge--info"
                              }`}
                            >
                              {envHelpers.isStaging ? "true" : "false"}
                            </span>
                            <br />
                            <strong>isProduction():</strong>{" "}
                            <span
                              className={`fr-badge ${
                                envHelpers.isProduction
                                  ? "fr-badge--success"
                                  : "fr-badge--info"
                              }`}
                            >
                              {envHelpers.isProduction ? "true" : "false"}
                            </span>
                            <br />
                            <strong>isDevelopment():</strong>{" "}
                            <span
                              className={`fr-badge ${
                                envHelpers.isDevelopment
                                  ? "fr-badge--success"
                                  : "fr-badge--info"
                              }`}
                            >
                              {envHelpers.isDevelopment ? "true" : "false"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="fr-col-12 fr-col-md-6">
                    <div className="fr-card fr-card--grey">
                      <div className="fr-card__body">
                        <div className="fr-card__content">
                          <h3 className="fr-card__title">Variables brutes</h3>
                          <p className="fr-card__desc">
                            <strong>NODE_ENV:</strong>{" "}
                            <code>{process.env.NODE_ENV || "undefined"}</code>
                            <br />
                            <strong>NEXT_PUBLIC_APP_ENV:</strong>{" "}
                            <code>
                              {process.env.NEXT_PUBLIC_APP_ENV || "undefined"}
                            </code>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 1: État des Services */}
            <div className="fr-mb-8v">
              <h2 className="fr-h4">État des Services</h2>
              <hr />

              <div className="fr-grid-row fr-grid-row--gutters">
                {/* Crisp */}
                <div className="fr-col-12 fr-mb-4v">
                  <div
                    className={`fr-alert ${
                      crispStatus === "ready"
                        ? "fr-alert--success"
                        : "fr-alert--info"
                    }`}
                  >
                    <h3 className="fr-alert__title">Crisp Chat</h3>
                    <p>
                      <strong>État:</strong>{" "}
                      {crispStatus === "ready"
                        ? "Opérationnel"
                        : "Chargement..."}
                    </p>
                    {clientEnv?.NEXT_PUBLIC_CRISP_WEBSITE_ID && (
                      <p>
                        <strong>ID:</strong>{" "}
                        {clientEnv.NEXT_PUBLIC_CRISP_WEBSITE_ID}
                      </p>
                    )}
                  </div>
                </div>
                {/* Matomo */}
                <div className="fr-col-12 fr-mb-4v">
                  <div
                    className={`fr-alert ${
                      matomoStatus === "ready"
                        ? "fr-alert--success"
                        : matomoStatus === "disabled"
                          ? "fr-alert--info"
                          : matomoStatus === "loading"
                            ? "fr-alert--info"
                            : "fr-alert--warning"
                    }`}
                  >
                    <h3 className="fr-alert__title">Matomo Analytics</h3>
                    <p>
                      <strong>État:</strong>{" "}
                      {matomoStatus === "ready"
                        ? "Opérationnel"
                        : matomoStatus === "disabled"
                          ? "Désactivé (dev)"
                          : matomoStatus === "loading"
                            ? "Chargement..."
                            : "Non configuré"}
                    </p>
                    {clientEnv?.NEXT_PUBLIC_MATOMO_SITE_ID && (
                      <p>
                        <strong>Site ID:</strong>{" "}
                        {clientEnv.NEXT_PUBLIC_MATOMO_SITE_ID}
                      </p>
                    )}
                  </div>
                </div>
                {/* API Backend */}
                {/* // TODO : Gestion de l'état de l'API Partenaire */}
                <div className="fr-col-12 fr-mb-4v">
                  <div
                    className={`fr-alert ${
                      apiStatus === "ready"
                        ? "fr-alert--success"
                        : apiStatus === "loading"
                          ? "fr-alert--info"
                          : "fr-alert--error"
                    }`}
                  >
                    <h3 className="fr-alert__title">
                      API Backend (Partenaire?)
                    </h3>
                    <p>
                      <strong>État:</strong>{" "}
                      {/* {apiStatus === "ready"
                        ? "Connectée"
                        : apiStatus === "loading"
                          ? "Vérification..."
                          : "Erreur"} */}
                      TODO
                    </p>
                    {sharedEnv?.NEXT_PUBLIC_API_URL && (
                      <p>
                        <strong>URL:</strong> {sharedEnv.NEXT_PUBLIC_API_URL}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Variables Client */}
            <div className="fr-mb-8v">
              <h2 className="fr-h4">Variables Client</h2>
              <hr />

              {clientError ? (
                <div className="fr-alert fr-alert--error">
                  <h3 className="fr-alert__title">Erreur de configuration</h3>
                  <p>{clientError}</p>
                </div>
              ) : (
                <div className="fr-table fr-table--bordered">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Service</th>
                        <th scope="col">Variable</th>
                        <th scope="col">Valeur</th>
                        <th scope="col">État</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Crisp */}
                      <tr>
                        <td>
                          <strong>Crisp</strong>
                        </td>
                        <td>
                          <code>NEXT_PUBLIC_CRISP_WEBSITE_ID</code>
                        </td>
                        <td>
                          <code>
                            {clientEnv?.NEXT_PUBLIC_CRISP_WEBSITE_ID
                              ? `${clientEnv.NEXT_PUBLIC_CRISP_WEBSITE_ID.substring(0, 8)}...`
                              : "Non définie"}
                          </code>
                        </td>
                        <td>
                          <span
                            className={`fr-badge ${
                              clientEnv?.NEXT_PUBLIC_CRISP_WEBSITE_ID
                                ? "fr-badge--success"
                                : "fr-badge--warning"
                            }`}
                          >
                            {clientEnv?.NEXT_PUBLIC_CRISP_WEBSITE_ID
                              ? "OK"
                              : "Manquante"}
                          </span>
                        </td>
                      </tr>

                      {/* Matomo */}
                      <tr>
                        <td rowSpan={2}>
                          <strong>Matomo</strong>
                        </td>
                        <td>
                          <code>NEXT_PUBLIC_MATOMO_SITE_ID</code>
                        </td>
                        <td>
                          <code>
                            {clientEnv?.NEXT_PUBLIC_MATOMO_SITE_ID ||
                              "Non définie"}
                          </code>
                        </td>
                        <td>
                          <span
                            className={`fr-badge ${
                              clientEnv?.NEXT_PUBLIC_MATOMO_SITE_ID
                                ? "fr-badge--success"
                                : "fr-badge--info"
                            }`}
                          >
                            {clientEnv?.NEXT_PUBLIC_MATOMO_SITE_ID
                              ? "OK"
                              : "Optionnelle"}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <code>NEXT_PUBLIC_MATOMO_URL</code>
                        </td>
                        <td>
                          <code>
                            {clientEnv?.NEXT_PUBLIC_MATOMO_URL || "Non définie"}
                          </code>
                        </td>
                        <td>
                          <span
                            className={`fr-badge ${
                              clientEnv?.NEXT_PUBLIC_MATOMO_URL
                                ? "fr-badge--success"
                                : "fr-badge--info"
                            }`}
                          >
                            {clientEnv?.NEXT_PUBLIC_MATOMO_URL
                              ? "OK"
                              : "Optionnelle"}
                          </span>
                        </td>
                      </tr>

                      {/* Sentry */}
                      <tr>
                        <td>
                          <strong>Sentry</strong>
                        </td>
                        <td>
                          <code>NEXT_PUBLIC_SENTRY_DSN</code>
                        </td>
                        <td>
                          <code>
                            {clientEnv?.NEXT_PUBLIC_SENTRY_DSN
                              ? `${clientEnv.NEXT_PUBLIC_SENTRY_DSN.substring(0, 20)}...`
                              : "Non définie"}
                          </code>
                        </td>
                        <td>
                          <span
                            className={`fr-badge ${
                              clientEnv?.NEXT_PUBLIC_SENTRY_DSN
                                ? "fr-badge--success"
                                : "fr-badge--info"
                            }`}
                          >
                            {clientEnv?.NEXT_PUBLIC_SENTRY_DSN
                              ? "OK"
                              : "Optionnelle"}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Section 3: Variables Partagées */}
            <div className="fr-mb-8v">
              <h2 className="fr-h4">Variables Partagées</h2>
              <hr />

              {sharedError ? (
                <div className="fr-alert fr-alert--error">
                  <h3 className="fr-alert__title">Erreur de configuration</h3>
                  <p>{sharedError}</p>
                </div>
              ) : (
                <div className="fr-table fr-table--bordered">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Variable</th>
                        <th scope="col">Valeur</th>
                        <th scope="col">État</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <code>NEXT_PUBLIC_API_URL</code>
                        </td>
                        <td>
                          <code>
                            {sharedEnv?.NEXT_PUBLIC_API_URL || "Non définie"}
                          </code>
                        </td>
                        <td>
                          <span
                            className={`fr-badge ${
                              sharedEnv?.NEXT_PUBLIC_API_URL
                                ? "fr-badge--success"
                                : "fr-badge--error"
                            }`}
                          >
                            {sharedEnv?.NEXT_PUBLIC_API_URL ? "OK" : "Requise"}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <code>NEXT_PUBLIC_APP_ENV</code>
                        </td>
                        <td>
                          <code>
                            {sharedEnv?.NEXT_PUBLIC_APP_ENV || "Non définie"}
                          </code>
                        </td>
                        <td>
                          <span
                            className={`fr-badge ${
                              sharedEnv?.NEXT_PUBLIC_APP_ENV
                                ? "fr-badge--success"
                                : "fr-badge--error"
                            }`}
                          >
                            {sharedEnv?.NEXT_PUBLIC_APP_ENV ? "OK" : "Requise"}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Section 4: Résumé */}
            <div className="fr-mb-8v">
              <h2 className="fr-h4">Résumé</h2>
              <hr />

              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-6">
                  <div className="fr-card fr-card--grey">
                    <div className="fr-card__body">
                      <div className="fr-card__content">
                        <h3 className="fr-card__title">Environnement</h3>
                        <p className="fr-card__desc">
                          <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
                          <br />
                          <strong>Variables détectées:</strong>{" "}
                          {
                            Object.keys(process.env).filter((k) =>
                              k.startsWith("NEXT_PUBLIC_")
                            ).length
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="fr-col-12 fr-col-md-6">
                  <div className="fr-card fr-card--grey">
                    <div className="fr-card__body">
                      <div className="fr-card__content">
                        <h3 className="fr-card__title">Services</h3>
                        <p className="fr-card__desc">
                          <strong>Configuration:</strong>{" "}
                          {clientError || sharedError
                            ? "Erreurs détectées"
                            : "Valide"}
                          <br />
                          <strong>Crisp:</strong>{" "}
                          {crispStatus === "ready" ? "Actif" : "Inactif"}
                          <br />
                          <strong>Matomo:</strong>{" "}
                          {matomoStatus === "ready"
                            ? "Actif"
                            : matomoStatus === "disabled"
                              ? "Désactivé"
                              : "Inactif"}
                          <br />
                          <strong>API:</strong>{" "}
                          {apiStatus === "ready" ? "Connectée" : "Déconnectée"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedDebugPage>
  );
}
