"use client";

import { useState } from "react";
import { MessageSquareMore, Send } from "lucide-react";
import ServiceScreen from "@/components/menus/ServiceScreen";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <ServiceScreen eyebrow="Inne" title="Wsparcie" description="Wyślij wiadomość do obsługi lub przygotuj zgłoszenie.">
      <form className="service-form">
        <label className="field">
          <span>Temat</span>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Np. problem z analizą" />
        </label>

        <label className="field">
          <span>Wiadomość</span>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Opisz problem..." rows={7} />
        </label>

        <div className="result-card">
          <MessageSquareMore size={22} />
          <div>
            <strong>Kontakt</strong>
            <p>Wiadomość trafi do kolejki wsparcia po podłączeniu backendu.</p>
          </div>
        </div>

        <button className="primary-button" type="button">
          <Send size={18} />
          Wyślij zgłoszenie
        </button>
      </form>
    </ServiceScreen>
  );
}
