"use client";

import Loader from "@/components/animations/loading";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, ShieldCheck, Info, AlertTriangle, ShieldAlert, ListChecks } from "lucide-react";
import Failed, { httpStatusToReason, FailReason } from "@/components/menus/Failed";

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
    file_name: string;
    document_type: string;
    summary: string;
    key_points: string[];
    risk_flags: RiskFlag[];
    overall_risk: RiskLevel;
  };
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
  const [error, setError] = useState<FailReason | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    fetch(`http://172.16.16.13:8000/result/${id}`)
      .then((res) => {
        if (!res.ok) throw { status: res.status };
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((err) => {
        setError(httpStatusToReason(err?.status));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (error)
    return (
      <Failed
        reason={error}
        onRetry={() => {
          setError(null);
          setLoading(true);
        }}
      />
    );

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
          <div className={`risk-badge ${result.overall_risk}`}>
            {riskIcon(result.overall_risk)}
            {riskLabel(result.overall_risk)}
          </div>
        </div>

        {/* HERO */}
        <section className="response-hero">
          <p className="response-eyebrow">{formatLabel(result.document_type)}</p>
          <h1>{result.file_name ?? formatLabel(result.document_type)}</h1>
          <p className="response-summary">{result.summary}</p>
          <div className="response-kpis">
            <div className="response-kpi">
              <span>Poziom ryzyka</span>
              <strong>{riskLabel(result.overall_risk)}</strong>
            </div>
          </div>
        </section>

        {/* KEY POINTS */}
        {result.key_points && result.key_points.length > 0 && (
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
                    <span className={`risk-chip ${r.level}`}>
                      {riskIcon(r.level)}
                      {riskLabel(r.level)}
                    </span>
                    {r.legal_basis && <span className="risk-basis">{r.legal_basis}</span>}
                  </div>
                  <p className="risk-fragment">„{r.fragment}"</p>
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
