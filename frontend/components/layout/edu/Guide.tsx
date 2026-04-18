"use client";

import { useState, useMemo } from "react";
import { BookOpen, LayoutDashboard, Search, Clock, ChevronRight } from "lucide-react";
import ServiceScreen from "@/components/menus/ServiceScreen";

// Dane wyciągnięte do stałej (docelowo mogą pochodzić z API/CMS)
const ARTICLES = [
  { id: 1, title: "Jak czytać pismo urzędowe", desc: "Przewodnik krok po kroku", cat: "guide" },
  { id: 2, title: "Jak przygotować dokument", desc: "Najczęstsze błędy i wskazówki", cat: "check" },
  { id: 3, title: "Podpis kwalifikowany", desc: "Wszystko o e-podpisie", cat: "guide" },
  { id: 4, title: "Odwoływanie się od decyzji", desc: "Procedura i terminy", cat: "guide" },
  { id: 5, title: "Checklist dokumentów do pracy", desc: "Co musisz mieć przygotowane", cat: "check" },
  { id: 6, title: "Prawa pracownika - poradnik", desc: "Podstawowe informacje", cat: "guide" },
  { id: 7, title: "Checklist wynajmu mieszkania", desc: "Wszystko na start", cat: "check" },
  { id: 8, title: "Jak złożyć skargę", desc: "Krok po kroku", cat: "guide" },
  { id: 9, title: "Podatki - poradnik początkujący", desc: "Podstawy PIT i VAT", cat: "guide" },
  { id: 10, title: "Checklist umowy o pracę", desc: "Co sprawdzić przed podpisaniem", cat: "check" },
  { id: 11, title: "Bezpieczeństwo w sieci", desc: "Jak chronić dane", cat: "guide" },
  { id: 12, title: "Checklist wyjazdowy", desc: "Przygotowanie do wyjazdu zagranicę", cat: "check" },
];

export default function GuidePage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Logika filtrowania
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter(art => {
      const matchesQuery = art.title.toLowerCase().includes(query.toLowerCase());
      const matchesTab = activeTab === "all" || 
                        (activeTab === "guide" && art.cat === "guide") ||
                        (activeTab === "check" && art.cat === "check");
      return matchesQuery && matchesTab;
    });
  }, [query, activeTab]);

  return (
    <ServiceScreen eyebrow="Samodzielność" title="Baza wiedzy" description="Krótkie poradniki i materiały pomocnicze.">
      <div className="service-form">
        
        {/* Wyszukiwarka z przyciskiem czyszczenia */}
        <label className="search-field relative">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Szukaj poradnika..." 
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-xs font-bold uppercase p-2">Clear</button>
          )}
        </label>

        {/* Kategorie jako interaktywne filtry */}
        <div className="category-grid">
          <button 
            onClick={() => setActiveTab(activeTab === "guide" ? "all" : "guide")}
            className={`category-card ${activeTab === "guide" ? "active" : "soft"}`}
          >
            <BookOpen size={18} />
            <span>Poradniki</span>
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === "check" ? "all" : "check")}
            className={`category-card ${activeTab === "check" ? "active" : "soft"}`}
          >
            <LayoutDashboard size={18} />
            <span>Checklisty</span>
          </button>
        </div>

        {/* Dynamiczna lista */}
        <div className="list-card mt-4">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((art) => (
              <div key={art.id} className="list-item hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="list-item-body">
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="text-sm">{art.title}</strong>
                  </div>
                  <span className="text-xs text-gray-500">{art.desc}</span>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              Nie znaleźliśmy nic o "{query}"... 
            </div>
          )}
        </div>
      </div>
    </ServiceScreen>
  );
}