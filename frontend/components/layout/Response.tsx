"use client";

import Loader from "@/components/animations/loading";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, ShieldCheck, Info, AlertTriangle, ShieldAlert, ListChecks } from "lucide-react";

type RiskLevel = "niskie" | "srednie" | "wysokie" | "nielegalne";

type RiskFlag = {
  fragment: string;
  explanation: string;
  level: RiskLevel;
  legal_basis: string | null;
  recommendation: string;
};

type ApiResponse = {
  session_id: string | null;
  extracted_text_length: number;
  result: {
    document_type: string;
    summary: string;
    key_points: string[];
    risk_flags: RiskFlag[];
    overall_risk: RiskLevel;
  };
};

const MOCK: ApiResponse = {
  session_id: null,
  extracted_text_length: 119,
  result: {
    document_type: "faktura",
    summary: "Faktura za usługę związaną ze ślubem Anny Kowalskiej, opiewająca na kwotę 12000 zł, oznaczona jako zapłacona.",
    overall_risk: "niskie",
    key_points: ["Kwota do zapłaty: 12000 zł", "Usługa dotyczy ślubu", "Faktura została opłacona", "Brak zaległości"],
    risk_flags: [],
  },
};

function riskLabel(level: RiskLevel) {
  return {
    niskie: "Niskie",
    srednie: "Średnie",
    wysokie: "Wysokie",
    nielegalne: "Nielegalne",
  }[level];
}

function riskIcon(level: RiskLevel) {
  switch (level) {
    case "niskie":
      return <ShieldCheck size={18} />;
    case "srednie":
      return <Info size={18} />;
    case "wysokie":
      return <AlertTriangle size={18} />;
    case "nielegalne":
      return <ShieldAlert size={18} />;
  }
}

function formatLabel(str: string) {
  return str && str.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
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
        console.log(data);
        setData(data);
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

  const result = data.result;

  return (
    <main className="response-page">
      <section className="response-shell">
        {/* TOP */}
        <div className="response-topbar">
          <div className="response-id">
            <FileText size={16} />
            <span>{formatLabel(result.document_type)}</span>
          </div>

          <div className={`risk-badge ${result.overall_risk}`}>
            {riskIcon(result.overall_risk)}
            {riskLabel(result.overall_risk)}
          </div>
        </div>

        {/* HERO */}
        <section className="response-hero">
          <h1>{formatLabel(result.document_type)}</h1>
          <p className="response-summary">{result.summary}</p>

          <div className="response-kpis">
            <div className="response-kpi">
              <span>Poziom ryzyka</span>
              <strong>{riskLabel(result.overall_risk)}</strong>
            </div>

            <div className="response-kpi">
              <span>Długość tekstu</span>
              <strong>{data.extracted_text_length} znaków</strong>
            </div>
          </div>
        </section>

        {/* KEY POINTS */}
        {result.key_points && result.key_points?.length > 0 && (
          <section className="response-section">
            <h2>
              <ListChecks size={18} />
              Kluczowe informacje
            </h2>

            <div className="pill-list">
              {result.key_points.map((p, i) => (
                <span className="pill" key={i}>
                  {p}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* RISK FLAGS */}
        <section className="response-section">
          <h2>
            <AlertTriangle size={18} />
            Ryzyka
          </h2>

          {!result.risk_flags || result.risk_flags.length === 0 ? (
            <p className="empty-state">Brak wykrytych zagrożeń. Dokument wygląda bezpiecznie.</p>
          ) : (
            <div className="risk-list">
              {result.risk_flags.map((r, i) => (
                <div className="risk-item" key={i}>
                  <div className="risk-head">
                    <span className={`risk-chip ${r.level}`}>{riskLabel(r.level)}</span>
                  </div>

                  <p className="risk-fragment">„{r.fragment}”</p>
                  <p className="risk-explanation">{r.explanation}</p>

                  <div className="risk-recommendation">
                    <strong>Rekomendacja</strong>
                    <p>{r.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
