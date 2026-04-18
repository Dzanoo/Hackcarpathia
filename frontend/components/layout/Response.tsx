"use client";

import Loader from "@/components/animations/loading";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AlertTriangle, FileText, Info, ListChecks, ShieldAlert, ShieldCheck } from "lucide-react";

type RiskLevel = "niskie" | "srednie" | "wysokie" | "nielegalne";

type RiskFlag = {
  fragment: string;
  explanation: string;
  level: RiskLevel;
  legal_basis: string | null;
  recommendation: string;
};

type ResponseData = {
  document_type: "umowa_o_prace" | "umowa_zlecenie" | "umowa_o_dzielo" | "pismo_zus" | "pismo_us" | "umowa_najmu" | "inne";
  summary: string;
  key_points: string[];
  risk_flags: RiskFlag[];
  overall_risk: RiskLevel;
};

const MOCK_RESPONSE: ResponseData = {
  document_type: "umowa_o_prace",
  summary:
    "Dokument wygląda na standardową umowę o pracę, ale zawiera kilka zapisów wymagających doprecyzowania. Największą uwagę zwracają zasady wypowiedzenia, ewentualne kary oraz zapisy dotyczące czasu pracy i wynagrodzenia.",
  key_points: ["Rodzaj umowy: umowa o pracę", "Występują zapisy, które warto zweryfikować przed podpisaniem", "Warto sprawdzić okres wypowiedzenia i odpowiedzialność finansową"],
  risk_flags: [
    {
      fragment: "pracodawca może nałożyć karę w wysokości ustalonej jednostronnie",
      explanation: "Zapis jest nieprecyzyjny i może działać na niekorzyść pracownika.",
      level: "wysokie",
      legal_basis: "null",
      recommendation: "Poproś o doprecyzowanie kwoty, podstawy i trybu nałożenia kary.",
    },
    {
      fragment: "czas pracy ustala się według potrzeb firmy",
      explanation: "Sformułowanie jest zbyt ogólne i może prowadzić do niejasności.",
      level: "srednie",
      legal_basis: "null",
      recommendation: "Doprecyzuj harmonogram, normy czasu pracy i zasady nadgodzin.",
    },
    {
      fragment: "okres wypowiedzenia wynosi 1 tydzień",
      explanation: "Może być zgodne tylko w określonych przypadkach i wymaga sprawdzenia.",
      level: "wysokie",
      legal_basis: "Art. 36 KP",
      recommendation: "Zweryfikuj, czy okres wypowiedzenia jest zgodny z typem umowy i stażem.",
    },
  ],
  overall_risk: "wysokie",
};

function getRiskLabel(level: RiskLevel) {
  switch (level) {
    case "niskie":
      return "Niskie";
    case "srednie":
      return "Średnie";
    case "wysokie":
      return "Wysokie";
    case "nielegalne":
      return "Nielegalne";
  }
}

function getRiskIcon(level: RiskLevel) {
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

function normalizeLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ResponsePage() {
  const params = useParams<{ id?: string }>();
  const id = typeof params?.id === "string" ? params.id : "mock";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ResponseData | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setData(MOCK_RESPONSE);
      setLoading(false);
    }, 1200);

    return () => clearTimeout(t);
  }, [id]);

  const riskCount = useMemo(() => {
    if (!data) return 0;
    return data.risk_flags.length;
  }, [data]);

  if (loading || !data) {
    return (
      <div className="response-loading">
        <Loader />
      </div>
    );
  }

  return (
    <main className="response-page">
      <section className="response-shell">
        <header className="response-topbar">
          <span className={`risk-badge ${data.overall_risk}`}>
            {getRiskIcon(data.overall_risk)}
            {getRiskLabel(data.overall_risk)}
          </span>
        </header>

        <section className="response-hero">
          <p className="response-eyebrow">Wynik analizy AI</p>
          <h1>{normalizeLabel(data.document_type)}</h1>
          <p className="response-summary">{data.summary}</p>

          <div className="response-kpis">
            <div className="response-kpi">
              <span>Poziom ryzyka</span>
              <strong>{getRiskLabel(data.overall_risk)}</strong>
            </div>

            <div className="response-kpi">
              <span>Wskaźniki ryzyka</span>
              <strong>{riskCount}</strong>
            </div>
          </div>
        </section>

        <section className="response-section">
          <h2>
            <ListChecks size={18} />
            Kluczowe punkty
          </h2>

          <div className="pill-list">
            {data.key_points.map((point) => (
              <span className="pill" key={point}>
                {point}
              </span>
            ))}
          </div>
        </section>

        <section className="response-section">
          <h2>
            <AlertTriangle size={18} />
            Zapisane ryzyka
          </h2>

          <div className="risk-list">
            {data.risk_flags.map((flag, index) => (
              <article className="risk-item" key={`${flag.fragment}-${index}`}>
                <div className="risk-head">
                  <span className={`risk-chip ${flag.level}`}>{getRiskLabel(flag.level)}</span>
                  <span className="risk-basis">{flag.legal_basis ? flag.legal_basis : "Brak podstawy"}</span>
                </div>

                <p className="risk-fragment">„{flag.fragment}”</p>
                <p className="risk-explanation">{flag.explanation}</p>

                <div className="risk-recommendation">
                  <strong>Rekomendacja</strong>
                  <p>{flag.recommendation}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="response-section">
          <details className="raw-json">
            <summary>Surowy JSON</summary>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </details>
        </section>
      </section>
    </main>
  );
}
