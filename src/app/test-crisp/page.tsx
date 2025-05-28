"use client";

import { useState } from "react";
import { useCrisp } from "@/hooks/useCrisp";

export default function CrispTestPage() {
  const { isLoaded, openChat, sendMessage } = useCrisp();
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
      openChat();
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto" suppressHydrationWarning>
      <h1 className="text-2xl font-bold mb-6">Test Crisp</h1>

      {/* Status */}
      <div className="mb-6 p-4 border rounded">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${isLoaded ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span>Crisp: {isLoaded ? "Chargé" : "Non chargé"}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4" suppressHydrationWarning>
        <button
          onClick={openChat}
          disabled={!isLoaded}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          suppressHydrationWarning
        >
          Ouvrir le chat
        </button>

        <div className="flex gap-2" suppressHydrationWarning>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message de test..."
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            suppressHydrationWarning
          />
          <button
            onClick={handleSendMessage}
            disabled={!isLoaded || !message.trim()}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            suppressHydrationWarning
          >
            Envoyer
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2" suppressHydrationWarning>
          <button
            onClick={() =>
              sendMessage("Bonjour, j'ai une question sur mon devis")
            }
            disabled={!isLoaded}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 disabled:opacity-50"
            suppressHydrationWarning
          >
            Message test 1
          </button>
          <button
            onClick={() =>
              sendMessage("Comment puis-je soumettre un nouveau devis ?")
            }
            disabled={!isLoaded}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 disabled:opacity-50"
            suppressHydrationWarning
          >
            Message test 2
          </button>
        </div>
      </div>
    </div>
  );
}
