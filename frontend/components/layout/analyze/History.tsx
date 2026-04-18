"use client";

import { useMemo, useState, useEffect } from "react";
import Loader from "@/components/animations/loading";
import { Clock3, FileText, Search } from "lucide-react";
import ServiceScreen from "@/components/menus/ServiceScreen";

type HistoryContent = {
  document_type: string;
  summary: string;
  key_points?: string[];
  observations?: string[];
  risk_flags?: unknown[];
  overall_risk: string;
  file_name?: string;
};

type HistoryItem = {
  date?: string;
  created_at?: string;
  status?: string;
  content: HistoryContent;
};

type ApiResponse = {
  history?: HistoryItem[];
};

function normalizeHistoryItem(item: HistoryItem): HistoryItem {
  let content: HistoryContent = item.content;

  if (typeof content === "string") {
    try {
      content = JSON.parse(content) as HistoryContent;
    } catch {
      // fallback – zostaw surowe
    }
  }

  return {
    ...item,
    content,
    date: item.date ?? item.created_at,
  };
}

export default function HistoryPage() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://172.16.16.13:8000/history");
        const data: ApiResponse = await res.json();

        console.log(data);

        setHistory(Array.isArray(data?.history) ? data.history.map(normalizeHistoryItem) : []);
      } catch (err) {
        console.error("History fetch error:", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();

    return history.filter((item) => {
      const title = (item.content.file_name ?? "").toLowerCase();
      const type = (item.content?.document_type ?? "").toLowerCase();
      const summary = (item.content?.summary ?? "").toLowerCase();
      console.log(item);

      return title.includes(q) || type.includes(q) || summary.includes(q);
    });
  }, [query, history]);

  if (loading) {
    return (
      <div className="response-loading">
        <Loader />
      </div>
    );
  }

  return (
    <ServiceScreen eyebrow="Analiza AI" title="Historia analiz" description="Przegląd ostatnich dokumentów i wyników.">
      <div className="service-form">
        <label className="search-field">
          <Search size={18} />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj w historii..." />
        </label>

        <div className="list-card">
          {filtered.map((item, idx) => (
            <article className="list-item" key={idx}>
              <div className="list-item-icon">
                <FileText size={18} />
              </div>

              <div className="list-item-body">
                <strong>{item.content.file_name ?? item.content?.document_type ?? "Brak tytułu"}</strong>

                <span>
                  <Clock3 size={14} /> {item.date ?? "brak daty"}
                </span>
              </div>

              <span className={`status-badge ${item.status === "Gotowe" ? "ok" : "warn"}`}>{item.status ?? "—"}</span>
            </article>
          ))}

          {filtered.length === 0 && <p className="empty-state">Brak wyników.</p>}
        </div>
      </div>
    </ServiceScreen>
  );
}
