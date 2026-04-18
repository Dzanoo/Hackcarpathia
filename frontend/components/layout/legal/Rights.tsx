"use client";

import { useState } from "react";
import { Scale, Search } from "lucide-react";
import ServiceScreen from "@/components/menus/ServiceScreen";

export default function RightsPage() {
  const [query, setQuery] = useState("");

  return (
    <ServiceScreen eyebrow="Samodzielność" title="Twoje prawa" description="Wyszukaj podstawowe informacje i sprawdź kategorie wsparcia.">
      <div className="service-form">
        <label className="search-field">
          <Search size={18} />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj prawa, tematu lub instytucji..." />
        </label>

        <div className="category-grid">
          {["Praca", "Najem", "Urząd", "Reklamacja", "Szkoła", "Umowa"].map((item) => (
            <button key={item} type="button" className="category-card">
              <Scale size={18} />
              <span>{item}</span>
            </button>
          ))}
        </div>

        <div className="info-card">
          <strong>Przykładowy wynik</strong>
          <p>Po wpisaniu zapytania system pokaże krótkie wyjaśnienie, listę kroków i możliwe dokumenty do przygotowania.</p>
        </div>
      </div>
    </ServiceScreen>
  );
}
