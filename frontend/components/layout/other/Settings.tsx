"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import ServiceScreen from "@/components/menus/ServiceScreen";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [lang, setLang] = useState("pl");

  return (
    <ServiceScreen eyebrow="Inne" title="Ustawienia profilu" description="Proste ustawienia dopasowane do urządzeń mobilnych.">
      <div className="service-form">
        <div className="toggle-list">
          <label className="toggle-row">
            <div>
              <strong>Powiadomienia</strong>
              <span>Otrzymuj alerty o nowych analizach</span>
            </div>
            <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
          </label>

          <label className="toggle-row">
            <div>
              <strong>Tryb kompaktowy</strong>
              <span>Gęstszy układ interfejsu</span>
            </div>
            <input type="checkbox" checked={compactMode} onChange={(e) => setCompactMode(e.target.checked)} />
          </label>
        </div>

        <label className="field">
          <span>Język</span>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="pl">Polski</option>
            <option value="en">English</option>
          </select>
        </label>

        <div className="result-card">
          <Settings size={22} />
          <div>
            <strong>Stan ustawień</strong>
            <p>Zapis lokalny lub synchronizacja z kontem może zostać dodana później.</p>
          </div>
        </div>

        <button className="primary-button" type="button">
          Zapisz ustawienia
        </button>
      </div>
    </ServiceScreen>
  );
}
