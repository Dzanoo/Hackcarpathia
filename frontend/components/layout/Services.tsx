"use client";
import { LayoutDashboard, FileSearch, Scale, Wallet, ShieldCheck, History, Settings, HelpCircle, MessageSquareMore } from "lucide-react";
import ServiceButton from "../menus/ServiceButton";

export default function Services() {
  return (
    <div id="services" className="">
      <h1>mPrzyszłość</h1>

      {/* GŁÓWNE NARZĘDZIA AI */}
      <div className="servicesGroup">
        <p>Analiza AI</p>
        <div className="servicesButtons">
          <ServiceButton icon={<FileSearch size={20} />} label="Tłumacz Pism" href="/analyze/translator" />
          <ServiceButton icon={<Scale size={20} />} label="Weryfikacja Umów" href="/analyze/contracts" />
          <ServiceButton icon={<History size={20} />} label="Historia Analiz" href="/analyze/history" />
        </div>
      </div>

      {/* MODUŁY EDUKACYJNO-FINANSOWE */}
      <div className="servicesGroup">
        <p>Samodzielność</p>
        <div className="servicesButtons">
          <ServiceButton icon={<Wallet size={20} />} label="Kalkulator Wypłaty" href="/finance/calculator" />
          <ServiceButton icon={<ShieldCheck size={20} />} label="Twoje Prawa" href="/legal/rights" />
          <ServiceButton icon={<LayoutDashboard size={20} />} label="Baza Wiedzy" href="/edu/guide" />
        </div>
      </div>

      {/* POMOC I KONFIGURACJA */}
      <div className="servicesGroup">
        <p>Inne</p>
        <div className="servicesButtons">
          <ServiceButton icon={<MessageSquareMore size={20} />} label="Wsparcie" href="/other/support" badge={2} />
          <ServiceButton icon={<Settings size={20} />} label="Ustawienia Profilu" href="/other/settings" />
          <ServiceButton icon={<HelpCircle size={20} />} label="Pomoc" href="/other/help" />
        </div>
      </div>
    </div>
  );
}
