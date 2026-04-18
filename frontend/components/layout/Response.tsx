"use client";

import Loader from "@/components/animations/loading";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, ShieldCheck, AlertTriangle, Lightbulb, ListChecks, TrendingUp } from "lucide-react";

type PodsumowanieUmowy = {
  typ_umowy: string;
  strony: string;
  cel: string;
  kluczowe_postanowienia: string[];
};

type AnalizaKluczowychPostanowien = {
  wynagrodzenie_i_rozliczenia: Record<string, string>;
  odpowiedzialnosc_materialna: Record<string, string>;
  poufność_i_tajemnica_przedsiebiorstwa: Record<string, string>;
  warunki_wypowiedzenia: Record<string, string>;
  kary_umowne: Record<string, string>;
  postanowienia_koncowe: Record<string, string>;
};

type RyzykaIKorzysci = {
  ryzyka: string[];
  korzyści: string[];
  uwagi: string;
};

type PraktyczneWskazowki = {
  rekomendacje: string[];
  ostrzeżenia: string[];
};

type ApiResponse = {
  session_id: string | null;
  extracted_text_length: number;
  result: {
    podsumowanie_umowy: PodsumowanieUmowy;
    analiza_kluczowych_postanowien: AnalizaKluczowychPostanowien;
    identyfikacja_potencjalnych_ryzyk_i_korzysci_dla_zleceniobiorcy: RyzykaIKorzysci;
    praktyczne_wskazowki_dla_zleceniobiorcy: PraktyczneWskazowki;
  };
};

function formatLabel(str: string) {
  return str.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ResponsePage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`http://172.16.16.13:8000/result/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, [id]);

  if (loading || !data) {
    return (
      <div className="response-loading">
        <Loader />
      </div>
    );
  }

  const {
    podsumowanie_umowy: summary,
    analiza_kluczowych_postanowien: analysis,
    identyfikacja_potencjalnych_ryzyk_i_korzysci_dla_zleceniobiorcy: risks,
    praktyczne_wskazowki_dla_zleceniobiorcy: tips,
  } = data.result;

  return (
    <main className="response-page">
      <section className="response-shell">
        {summary && (
          <>
            {/* TOP */}
            <div className="response-topbar">
              <div className="response-id">
                <FileText size={16} />
                <span>{summary.typ_umowy}</span>
              </div>
            </div>

            {/* HERO */}
            <section className="response-hero">
              <h1>{summary.typ_umowy}</h1>
              <p className="response-summary">{summary.cel}</p>
              <div className="response-kpis">
                <div className="response-kpi">
                  <span>Strony</span>
                  <strong>{summary.strony}</strong>
                </div>
              </div>
            </section>

            {/* KLUCZOWE POSTANOWIENIA */}
            {summary.kluczowe_postanowienia?.length > 0 && (
              <section className="response-section">
                <h2>
                  <ListChecks size={18} />
                  Kluczowe postanowienia
                </h2>
                <div className="pill-list">
                  {summary.kluczowe_postanowienia.map((p, i) => (
                    <span className="pill" key={i}>
                      {p}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* ANALIZA SZCZEGÓŁOWA */}
        {analysis && (
          <section className="response-section">
            <h2>
              <FileText size={18} />
              Szczegóły postanowień
            </h2>
            <div className="detail-grid">
              {Object.entries(analysis).map(([key, value]) => (
                <div className="detail-card" key={key}>
                  <h3>{formatLabel(key)}</h3>
                  {Object.entries(value).map(([k, v]) => (
                    <div className="detail-row" key={k}>
                      <span className="detail-label">{formatLabel(k)}</span>
                      <span className="detail-value">{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RYZYKA */}
        {risks && (
          <section className="response-section">
            <h2>
              <AlertTriangle size={18} />
              Ryzyka dla zleceniobiorcy
            </h2>
            <div className="risk-list">
              {risks.ryzyka.map((r, i) => (
                <div className="risk-item wysokie" key={i}>
                  <p>{r}</p>
                </div>
              ))}
            </div>
            {risks.uwagi && <p className="risk-note">{risks.uwagi}</p>}
          </section>
        )}

        {/* KORZYŚCI */}
        {risks && (
          <section className="response-section">
            <h2>
              <TrendingUp size={18} />
              Korzyści dla zleceniobiorcy
            </h2>
            <div className="benefit-list">
              {risks.korzyści.map((k, i) => (
                <div className="benefit-item" key={i}>
                  <p>{k}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* WSKAZÓWKI PRAKTYCZNE */}
        {tips && (
          <section className="response-section">
            <h2>
              <Lightbulb size={18} />
              Rekomendacje
            </h2>
            <div className="tips-list">
              {tips.rekomendacje.map((r, i) => (
                <div className="tip-item" key={i}>
                  <p>{r}</p>
                </div>
              ))}
            </div>

            <h2 style={{ marginTop: "1rem" }}>
              <ShieldCheck size={18} />
              Ostrzeżenia
            </h2>
            <div className="warning-list">
              {tips.ostrzeżenia.map((o, i) => (
                <div className="warning-item" key={i}>
                  <p>{o}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
