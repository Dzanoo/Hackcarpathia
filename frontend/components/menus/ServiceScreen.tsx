import React from "react";

type ServiceScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function ServiceScreen({ eyebrow, title, description, children }: ServiceScreenProps) {
  return (
    <main className="service-page">
      <section className="service-page-shell">
        <header className="service-page-header">
          <p className="service-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="service-subtitle">{description}</p>
        </header>

        <div className="service-card">{children}</div>
      </section>
    </main>
  );
}
