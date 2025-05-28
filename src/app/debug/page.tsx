// src/app/debug-crisp/page.tsx
"use client";

import {
  ENV_CLIENT,
  getClientEnv,
  getSharedEnv,
} from "@/lib/config/env.config";
import { useEffect, useState } from "react";

export default function DebugCrisp() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testResults, setTestResults] = useState({
    clientEnv: null as any,
    sharedEnv: null as any,
    proxyResult: null as any,
    manualResult: null as any,
  });

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `${timestamp}: ${message}`]);
  };

  // Tests des fonctions d'environnement
  const runTests = () => {
    addLog("🔄 Running all tests...");

    // Test getClientEnv
    let clientEnv = null;
    try {
      clientEnv = getClientEnv();
      addLog(`✅ getClientEnv() success: ${JSON.stringify(clientEnv, null, 2)}`);
    } catch (error) {
      addLog(`❌ getClientEnv() error: ${error}`);
    }

    // Test getSharedEnv
    let sharedEnv = null;
    try {
      sharedEnv = getSharedEnv();
      addLog(`✅ getSharedEnv() success: ${JSON.stringify(sharedEnv, null, 2)}`);
    } catch (error) {
      addLog(`❌ getSharedEnv() error: ${error}`);
    }

    // Test proxy
    let proxyResult = null;
    try {
      proxyResult = ENV_CLIENT.NEXT_PUBLIC_CRISP_WEBSITE_ID;
      addLog(`✅ ENV_CLIENT.NEXT_PUBLIC_CRISP_WEBSITE_ID: ${proxyResult}`);
    } catch (error) {
      addLog(`❌ ENV_CLIENT proxy error: ${error}`);
    }

    // Test manual parse
    let manualResult = null;
    try {
      manualResult = {
        NEXT_PUBLIC_MATOMO_SITE_ID: process.env.NEXT_PUBLIC_MATOMO_SITE_ID,
        NEXT_PUBLIC_MATOMO_URL: process.env.NEXT_PUBLIC_MATOMO_URL,
        NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
        NEXT_PUBLIC_SENTRY_ORG: process.env.NEXT_PUBLIC_SENTRY_ORG,
        NEXT_PUBLIC_SENTRY_PROJECT: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
        NEXT_PUBLIC_SENTRY_URL: process.env.NEXT_PUBLIC_SENTRY_URL,
        NEXT_PUBLIC_CRISP_WEBSITE_ID: process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID,
      };
      addLog(`✅ Manual env object: ${JSON.stringify(manualResult, null, 2)}`);
    } catch (error) {
      addLog(`❌ Manual parse error: ${error}`);
    }

    // Mettre à jour les résultats
    setTestResults({
      clientEnv,
      sharedEnv,
      proxyResult,
      manualResult,
    });
  };

  useEffect(() => {
    addLog("🚀 Component mounted");

    // Test 1: Accès direct à process.env
    addLog(`Direct process.env: ${process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID}`);

    // Test 2: Comptage des variables NEXT_PUBLIC
    const nextPublicKeys = Object.keys(process.env).filter((k) =>
      k.startsWith("NEXT_PUBLIC_")
    );
    addLog(
      `NEXT_PUBLIC keys found: ${nextPublicKeys.length} (${nextPublicKeys.join(", ")})`
    );

    // Test 3: Toutes les clés de process.env
    const allKeys = Object.keys(process.env);
    addLog(`Total process.env keys: ${allKeys.length}`);

    // Test 4: Vérification du type d'objet
    addLog(`process.env type: ${typeof process.env}`);
    addLog(`process.env constructor: ${process.env.constructor.name}`);

    // Lancer les tests au mount
    runTests();

    // Monitor continu
    const interval = setInterval(() => {
      const currentValue = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
      const currentKeys = Object.keys(process.env).filter((k) =>
        k.startsWith("NEXT_PUBLIC_")
      );
      addLog(`Monitor - Value: ${currentValue}, Keys: ${currentKeys.length}`);
    }, 3000);

    setTimeout(() => {
      clearInterval(interval);
      addLog("⏹️ Monitoring stopped");
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto" suppressHydrationWarning>
      <h1 className="text-3xl font-bold mb-6">Debug Crisp Complet</h1>

      <button
        onClick={runTests}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        🔄 Run Tests Again
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tests en temps réel */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tests en temps réel</h2>

          <div className="bg-gray-50 p-4 rounded" suppressHydrationWarning>
            <h3 className="font-medium mb-2">Direct process.env</h3>
            <code className="bg-white p-2 rounded block">
              "{process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || "undefined"}"
            </code>
          </div>

          <div className="bg-gray-50 p-4 rounded" suppressHydrationWarning>
            <h3 className="font-medium mb-2">getClientEnv()</h3>
            {testResults.clientEnv ? (
              <code className="bg-green-100 p-2 rounded block">
                "{testResults.clientEnv.NEXT_PUBLIC_CRISP_WEBSITE_ID || "undefined"}"
              </code>
            ) : (
              <code className="bg-red-100 p-2 rounded block">ERREUR ou pas encore testé</code>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded" suppressHydrationWarning>
            <h3 className="font-medium mb-2">ENV_CLIENT Proxy</h3>
            <code className="bg-white p-2 rounded block">
              "{testResults.proxyResult || "undefined"}"
            </code>
          </div>

          <div className="bg-gray-50 p-4 rounded" suppressHydrationWarning>
            <h3 className="font-medium mb-2">Manual Parse</h3>
            <code className="bg-white p-2 rounded block">
              "{testResults.manualResult?.NEXT_PUBLIC_CRISP_WEBSITE_ID || "undefined"}"
            </code>
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Informations système</h2>

          <div className="bg-gray-50 p-4 rounded" suppressHydrationWarning>
            <h3 className="font-medium mb-2">Variables détectées</h3>
            <div className="text-sm space-y-1">
              <div>NODE_ENV: {process.env.NODE_ENV}</div>
              <div>
                Variables NEXT_PUBLIC_:{" "}
                {
                  Object.keys(process.env).filter((k) =>
                    k.startsWith("NEXT_PUBLIC_")
                  ).length
                }
              </div>
              <div>Total variables: {Object.keys(process.env).length}</div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded" suppressHydrationWarning>
            <h3 className="font-medium mb-2">
              Toutes les variables NEXT_PUBLIC
            </h3>
            <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-32">
              {JSON.stringify(
                Object.fromEntries(
                  Object.entries(process.env).filter(([key]) =>
                    key.startsWith("NEXT_PUBLIC_")
                  )
                ),
                null,
                2
              )}
            </pre>
          </div>

          <div className="bg-gray-50 p-4 rounded" suppressHydrationWarning>
            <h3 className="font-medium mb-2">Shared Env</h3>
            <pre className="bg-white p-2 rounded text-xs">
              {JSON.stringify(testResults.sharedEnv, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Logs de monitoring */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Logs de monitoring</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-64 overflow-auto">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}