"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Calculator } from "lucide-react";
import ServiceScreen from "@/components/menus/ServiceScreen";

export default function CalculatorPage() {
  const [gross, setGross] = useState(6000);
  const [days, setDays] = useState(21);
  const [bonus, setBonus] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const calculations = useMemo(() => {
    const socialIns = gross * 0.1371;
    const healthIns = (gross - socialIns) * 0.09;
    const tax = (gross - socialIns) * 0.12;
    const dailyBase = (gross / 30) * days * 0.72;
    const totalNet = Math.round((gross * 0.72) + bonus + (dailyBase * 0.05));

    return {
      net: totalNet,
      breakdown: [
        { label: "Ubezpieczenie społeczne", value: Math.round(socialIns) },
        { label: "Ubezpieczenie zdrowotne", value: Math.round(healthIns) },
        { label: "Zaliczka na podatek (PIT)", value: Math.round(tax) },
        { label: "Premie i dodatki", value: bonus },
      ],
    };
  }, [gross, days, bonus]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        bubbleRef.current &&
        !bubbleRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setShowBubble(false);
      }
    }
    if (showBubble) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showBubble]);

  return (
    <ServiceScreen
      eyebrow="Samodzielność"
      title="Kalkulator wypłaty"
      description="Szybki mobilny kalkulator z prostym podglądem wyniku."
    >
      <div className="service-form">
        <section className="form-block">
          <label className="field">
            <span>Wynagrodzenie brutto</span>
            <input
              type="number"
              value={gross}
              onChange={(e) => setGross(Number(e.target.value))}
            />
          </label>

          <label className="field">
            <span>Liczba dni</span>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            />
          </label>

          <label className="field">
            <span>Dodatki / premie</span>
            <input
              type="number"
              value={bonus}
              onChange={(e) => setBonus(Number(e.target.value))}
            />
          </label>
        </section>

        {/* result-card z position:relative jako kotwica dymka */}
        <div className="result-card" style={{ position: "relative", display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Calculator size={22} />
          <div>
            <strong>Szacowana kwota netto</strong>
            <p>{calculations.net.toLocaleString("pl-PL")} zł</p>
          </div>
        </div>

          {/* Wrapper dla przycisku + dymka */}
          <div style={{ position: "relative" }}>
            <button
              ref={btnRef}
              onClick={() => setShowBubble((v) => !v)}
              className="primary-button"
              style={{ width: "auto", padding: "0 18px", minHeight: 40 }}
            >
              Szczegóły
            </button>

            {showBubble && (
              <div
                ref={bubbleRef}
                className="response-section"
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: "calc(100% + 12px)",
                  width: 320,
                  margin: 0,
                  zIndex: 50,
                }}
              >
                {/* Nagłówek */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h2 style={{ margin: 0, fontSize: "0.95rem" }}>Szczegóły potrąceń</h2>
                  <button
                    onClick={() => setShowBubble(false)}
                    className="remove-button"
                    style={{ padding: "4px 10px" }}
                  >
                    ✕
                  </button>
                </div>

                {/* Wiersze potrąceń */}
                {calculations.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="response-kpi"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      borderRadius: 12,
                      marginBottom: idx < calculations.breakdown.length - 1 ? 6 : 0,
                    }}
                  >
                    <span style={{ margin: 0, fontSize: "0.84rem", color: "var(--llm-muted)" }}>
                      {item.label}
                    </span>
                    <strong className="risk-chip wysokie">
                      −{item.value.toLocaleString("pl-PL")} zł
                    </strong>
                  </div>
                ))}

                {/* Strzałka dymka */}
                <div
                  style={{
                    position: "absolute",
                    right: 20,
                    bottom: -8,
                    width: 16,
                    height: 9,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      background: "var(--llm-card)",
                      border: "1px solid var(--llm-border)",
                      transform: "rotate(45deg)",
                      margin: "-6px 0 0 2px",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <button className="primary-button" type="button">
          Przelicz ponownie
        </button>
      </div>
    </ServiceScreen>
  );
}