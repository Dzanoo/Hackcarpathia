"use client";

import ServiceScreen from "@/components/menus/ServiceScreen";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Jak dodać dokument?",
    a: "Wejdź w odpowiedni moduł i użyj przycisku załącznika.",
  },
  {
    q: "Czy działa LLM?",
    a: "Na razie interfejs jest gotowy, a integracja z modelem jest do podłączenia później.",
  },
  {
    q: "Czy działa na telefonie?",
    a: "Tak. Układ jest projektowany najpierw pod mobile.",
  },
];

export default function HelpPage() {
  return (
    <ServiceScreen eyebrow="Inne" title="Pomoc" description="Najczęstsze pytania i podstawowe informacje.">
      <div className="service-form">
        <div className="info-card">
          <HelpCircle size={22} />
          <div>
            <strong>Pomoc techniczna</strong>
            <p>Znajdziesz tu odpowiedzi na najczęstsze pytania.</p>
          </div>
        </div>

        <div className="list-card">
          {faqs.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </ServiceScreen>
  );
}
