"use client";

import { useState } from "react";
import { FileText, Paperclip, ShieldAlert, X } from "lucide-react";
import ServiceScreen from "@/components/menus/ServiceScreen";

export default function ContractsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [focus, setFocus] = useState("");
  const [riskLevel, setRiskLevel] = useState("średnie");

  return (
    <ServiceScreen eyebrow="Analiza AI" title="Weryfikacja umów" description="Dodaj umowę i wskaż, na czym ma skupić się analiza.">
      <div className="service-form">
        <section className="form-block">
          <div className="form-block-top">
            <div>
              <h2>Plik umowy</h2>
              <p>Dodaj PDF lub dokument tekstowy.</p>
            </div>

            <label className="icon-button" aria-label="Dodaj plik">
              <Paperclip size={18} />
              <input type="file" className="hidden-input" onChange={(e) => setFile(e.target.files?.[0] ?? null)} accept=".pdf,.doc,.docx,.txt" />
            </label>
          </div>

          {!file ? (
            <div className="dropzone">
              <ShieldAlert size={30} />
              <span>Brak załączonej umowy</span>
              <small>Wybierz plik, aby rozpocząć analizę.</small>
            </div>
          ) : (
            <div className="file-preview">
              <div className="file-meta">
                <div className="file-icon">
                  <FileText size={18} />
                </div>
                <div className="file-text">
                  <strong>{file.name}</strong>
                  <span>{file.type || "nieznany typ"}</span>
                </div>
              </div>

              <button type="button" className="remove-button" onClick={() => setFile(null)}>
                <X size={16} />
                Usuń
              </button>
            </div>
          )}
        </section>

        <section className="form-block">
          <label htmlFor="focus">Na czym skupić analizę</label>
          <textarea id="focus" value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="Np. kary umowne, wypowiedzenie, termin płatności, ukryte ryzyka..." rows={7} />
          <div className="hint-row">
            <span>{focus.length} znaków</span>
          </div>
        </section>

        <section className="grid-2">
          <label className="field">
            <span>Poziom ostrożności</span>
            <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}>
              <option>niski</option>
              <option>średnie</option>
              <option>wysoki</option>
            </select>
          </label>

          <div className="info-pill">
            <strong>Cel</strong>
            <span>wyłapać ryzyka i niejasności</span>
          </div>
        </section>

        <button className="primary-button" type="button" disabled={!file && !focus.trim()}>
          Analizuj umowę
        </button>
      </div>
    </ServiceScreen>
  );
}
