"use client";

import { getClientEnv, getSharedEnv } from "@/lib/config/env.config";
import { WindowWithCrisp } from "@/types/crisp";
import { useEffect, useState } from "react";

export default function DebugCrisp() {
  const [isMounted, setIsMounted] = useState(false);
  const [crispStatus, setCrispStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    setIsMounted(true);
    
    // Vérifier Crisp
    const checkCrisp = () => {
      if (typeof window !== "undefined") {
        const windowWithCrisp = window as WindowWithCrisp;
        if (windowWithCrisp.$crisp) {
          setCrispStatus('ready');
        } else {
          setTimeout(checkCrisp, 500);
        }
      }
    };
    
    checkCrisp();
    
    // Timeout après 10 secondes
    setTimeout(() => {
      if (crispStatus === 'loading') {
        setCrispStatus('error');
      }
    }, 10000);
  }, [crispStatus]);

  // Protection production
  if (process.env.NODE_ENV === "production") {
    return (
      <div className="fr-container fr-mt-8v">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-8">
            <div className="fr-alert fr-alert--error">
              <h3 className="fr-alert__title">Accès refusé</h3>
              <p>Cette page de debug n'est pas disponible en production.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className="fr-container fr-mt-8v">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-8">
            <div className="fr-alert fr-alert--info">
              <h3 className="fr-alert__title">Chargement</h3>
              <p>Vérification des variables d'environnement...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Récupération des variables
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

  const crispId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

  return (
    <div className="fr-container fr-mt-8v fr-mb-8v">
      <div className="fr-grid-row fr-grid-row--center">
        <div className="fr-col-12 fr-col-lg-10">
          
          <h1 className="fr-h2 fr-mb-6v">Debug Variables d'Environnement</h1>

          {/* État de Crisp */}
          <div className="fr-mb-6v">
            <h2 className="fr-h4">État de Crisp</h2>
            <hr />
            <div className={`fr-alert ${
              crispStatus === 'ready' ? 'fr-alert--success' : 
              crispStatus === 'loading' ? 'fr-alert--info' : 
              'fr-alert--error'
            }`}>
              <h3 className="fr-alert__title">
                {crispStatus === 'ready' ? 'Opérationnel' : 
                 crispStatus === 'loading' ? 'Chargement' : 
                 'Non disponible'}
              </h3>
              <p>
                {crispStatus === 'ready' ? 'Crisp est chargé et fonctionnel' : 
                 crispStatus === 'loading' ? 'Crisp en cours de chargement...' : 
                 'Crisp n\'a pas pu être initialisé'}
              </p>
              {crispId && (
                <p><strong>ID:</strong> {crispId}</p>
              )}
            </div>
          </div>

          {/* Variables Client */}
          <div className="fr-mb-6v">
            <h2 className="fr-h4">Variables Client</h2>
            <hr />
            
            {clientError ? (
              <div className="fr-alert fr-alert--error">
                <h3 className="fr-alert__title">Erreur</h3>
                <p>{clientError}</p>
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
                      <td><code>NEXT_PUBLIC_CRISP_WEBSITE_ID</code></td>
                      <td><code>{clientEnv?.NEXT_PUBLIC_CRISP_WEBSITE_ID || 'Non définie'}</code></td>
                      <td>
                        <span className={`fr-badge ${clientEnv?.NEXT_PUBLIC_CRISP_WEBSITE_ID ? 'fr-badge--success' : 'fr-badge--warning'}`}>
                          {clientEnv?.NEXT_PUBLIC_CRISP_WEBSITE_ID ? 'OK' : 'Manquante'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td><code>NEXT_PUBLIC_MATOMO_SITE_ID</code></td>
                      <td><code>{clientEnv?.NEXT_PUBLIC_MATOMO_SITE_ID || 'Non définie'}</code></td>
                      <td>
                        <span className={`fr-badge ${clientEnv?.NEXT_PUBLIC_MATOMO_SITE_ID ? 'fr-badge--success' : 'fr-badge--info'}`}>
                          {clientEnv?.NEXT_PUBLIC_MATOMO_SITE_ID ? 'OK' : 'Optionnelle'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td><code>NEXT_PUBLIC_MATOMO_URL</code></td>
                      <td><code>{clientEnv?.NEXT_PUBLIC_MATOMO_URL || 'Non définie'}</code></td>
                      <td>
                        <span className={`fr-badge ${clientEnv?.NEXT_PUBLIC_MATOMO_URL ? 'fr-badge--success' : 'fr-badge--info'}`}>
                          {clientEnv?.NEXT_PUBLIC_MATOMO_URL ? 'OK' : 'Optionnelle'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td><code>NEXT_PUBLIC_SENTRY_DSN</code></td>
                      <td><code>{clientEnv?.NEXT_PUBLIC_SENTRY_DSN || 'Non définie'}</code></td>
                      <td>
                        <span className={`fr-badge ${clientEnv?.NEXT_PUBLIC_SENTRY_DSN ? 'fr-badge--success' : 'fr-badge--info'}`}>
                          {clientEnv?.NEXT_PUBLIC_SENTRY_DSN ? 'OK' : 'Optionnelle'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Variables Partagées */}
          <div className="fr-mb-6v">
            <h2 className="fr-h4">Variables Partagées</h2>
            <hr />
            
            {sharedError ? (
              <div className="fr-alert fr-alert--error">
                <h3 className="fr-alert__title">Erreur</h3>
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
                      <td><code>NEXT_PUBLIC_API_URL</code></td>
                      <td><code>{sharedEnv?.NEXT_PUBLIC_API_URL || 'Non définie'}</code></td>
                      <td>
                        <span className={`fr-badge ${sharedEnv?.NEXT_PUBLIC_API_URL ? 'fr-badge--success' : 'fr-badge--error'}`}>
                          {sharedEnv?.NEXT_PUBLIC_API_URL ? 'OK' : 'Requise'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Informations Système */}
          <div className="fr-mb-6v">
            <h2 className="fr-h4">Informations Système</h2>
            <hr />
            
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-6">
                <div className="fr-card fr-card--grey">
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <h3 className="fr-card__title">Environnement</h3>
                      <p className="fr-card__desc">
                        <strong>NODE_ENV:</strong> {process.env.NODE_ENV}<br />
                        <strong>Variables NEXT_PUBLIC détectées:</strong> {Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_')).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="fr-col-12 fr-col-md-6">
                <div className="fr-card fr-card--grey">
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <h3 className="fr-card__title">État Global</h3>
                      <p className="fr-card__desc">
                        <strong>Configuration:</strong> {clientError || sharedError ? 'Erreurs détectées' : 'Valide'}<br />
                        <strong>Crisp:</strong> {crispStatus === 'ready' ? 'Fonctionnel' : 'Non disponible'}
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
  );
}