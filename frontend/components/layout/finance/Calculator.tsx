"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import ServiceScreen from "@/components/menus/ServiceScreen";

export default function CalculatorPage() {
  const [gross, setGross] = useState(6000);
  const [days, setDays] = useState(21);
  const [bonus, setBonus] = useState(0);

  const net = useMemo(() => {
    const base = gross * 0.72;
    const daily = (gross / 30) * days * 0.72;
    return Math.round(base + bonus + daily * 0.05);
  }, [gross, days, bonus]);

  return (
    <ServiceScreen eyebrow="Samodzielność" title="Kalkulator wypłaty" description="Szybki mobilny kalkulator z prostym podglądem wyniku.">
      <div className="service-form">
        <section className="form-block">
          <label className="field">
            <span>Wynagrodzenie brutto</span>
            <input type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} />
          </label>

          <label className="field">
            <span>Liczba dni</span>
            <input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} />
          </label>

          <label className="field">
            <span>Dodatki / premie</span>
            <input type="number" value={bonus} onChange={(e) => setBonus(Number(e.target.value))} />
          </label>
        </section>

        <div className="result-card">
          <Calculator size={22} />
          <div>
            <strong>Szacowana kwota netto</strong>
            <p>{net.toLocaleString("pl-PL")} zł</p>
          </div>
        </div>

        <button className="primary-button" type="button">
          Przelicz ponownie
        </button>
      </div>
    </ServiceScreen>
  );
}
