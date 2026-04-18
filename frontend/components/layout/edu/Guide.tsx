"use client";

import { useState } from "react";
import { BookOpen, LayoutDashboard, Search } from "lucide-react";
import ServiceScreen from "@/components/menus/ServiceScreen";

export default function GuidePage() {
  const [query, setQuery] = useState("");

  return (
    <ServiceScreen eyebrow="Samodzielność" title="Baza wiedzy" description="Krótkie poradniki i materiały pomocnicze w układzie mobilnym.">
      <div className="service-form">
        <label className="search-field">
          <Search size={18} />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj poradnika..." />
        </label>

        <div className="category-grid">
          <article className="category-card soft">
            <BookOpen size={18} />
            <span>Poradniki</span>
          </article>
          <article className="category-card soft">
            <LayoutDashboard size={18} />
            <span>Checklisty</span>
          </article>
        </div>

        <div className="list-card">
          <div className="list-item">
            <div className="list-item-body">
              <strong>Jak czytać pismo urzędowe</strong>
              <span>Krótki przewodnik krok po kroku</span>
            </div>
          </div>
          <div className="list-item">
            <div className="list-item-body">
              <strong>Jak przygotować dokument</strong>
              <span>Najczęstsze błędy i wskazówki</span>
            </div>
          </div>
        </div>
      </div>
    </ServiceScreen>
  );
}
