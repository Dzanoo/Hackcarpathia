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
          <ServiceButton icon={<FileSearch size={20} color="purple" />} label="Tłumacz Pism" href="/analyze/translator" />
          <ServiceButton icon={<History size={20} color="purple" />} label="Historia Analiz" href="/analyze/history" />
        </div>
      </div>

      {/* MODUŁY EDUKACYJNO-FINANSOWE */}
      <div className="servicesGroup">
        <p>Samodzielność</p>
        <div className="servicesButtons">
          <ServiceButton icon={<Wallet size={20} color="green" />} label="Kalkulator Wypłaty" href="/finance/calculator" />
          <ServiceButton icon={<ShieldCheck size={20} color="green" />} label="Twoje Prawa" href="/legal/rights" />
          <ServiceButton icon={<LayoutDashboard size={20} color="green" />} label="Baza Wiedzy" href="/edu/guide" />
        </div>
      </div>

      {/* POMOC I KONFIGURACJA */}
      <div className="servicesGroup">
        <p>Inne</p>
        <div className="servicesButtons">
          <ServiceButton icon={<MessageSquareMore size={20} color="blue" />} label="Wsparcie" href="/other/support" badge={2} />
          <ServiceButton icon={<Settings size={20} color="blue" />} label="Ustawienia Profilu" href="/other/settings" />
          <ServiceButton icon={<HelpCircle size={20} color="blue" />} label="Pomoc" href="/other/help" />
        </div>
      </div>
    </div>
  );
}
