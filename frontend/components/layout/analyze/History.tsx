"use client";

import { useMemo, useState } from "react";
import { Clock3, FileText, Search } from "lucide-react";
import ServiceScreen from "@/components/menus/ServiceScreen";

const mockHistory = [
  { title: "Umowa zlecenia", date: "2026-04-18", status: "Gotowe" },
  { title: "Pismo z urzędu", date: "2026-04-16", status: "Do poprawy" },
  { title: "Regulamin sklepu", date: "2026-04-14", status: "Gotowe" },
];

export default function HistoryPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return mockHistory.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <ServiceScreen eyebrow="Analiza AI" title="Historia analiz" description="Przegląd ostatnich dokumentów i wyników.">
      <div className="service-form">
        <label className="search-field">
          <Search size={18} />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj w historii..." />
        </label>

        <div className="list-card">
          {filtered.map((item) => (
            <article className="list-item" key={item.title}>
              <div className="list-item-icon">
                <FileText size={18} />
              </div>

              <div className="list-item-body">
                <strong>{item.title}</strong>
                <span>
                  <Clock3 size={14} /> {item.date}
                </span>
              </div>

              <span className={`status-badge ${item.status === "Gotowe" ? "ok" : "warn"}`}>{item.status}</span>
            </article>
          ))}

          {filtered.length === 0 && <p className="empty-state">Brak wyników.</p>}
        </div>
      </div>
    </ServiceScreen>
  );
}
