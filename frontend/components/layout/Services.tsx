"use client";
import { LayoutDashboard, FileSearch, Scale, Wallet, ShieldCheck, History, Settings, HelpCircle, MessageSquareMore } from "lucide-react";
import ServiceButton from "../menus/ServiceButton";

export default function Services() {
  return (
    <div id="services" className="">
      <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">mPrzyszłość</h1>
      <div className="servicesGroup">
        <ServiceButton icon={<LayoutDashboard size={20} />} label="Dashboard" href="/crm/dashboard" />
        <ServiceButton icon={<Users size={20} />} label="Clients" href="/crm/clients" />
        <ServiceButton icon={<ShoppingCart size={20} />} label="Orders" href="/crm/orders" />
      </div>

      {/* MODUŁY EDUKACYJNO-FINANSOWE */}
      <div className="servicesGroup">
        <p>Samodzielność</p>
        <ServiceButton icon={<Wallet size={20} />} label="Kalkulator Wypłaty" href="/finance/calculator" />
        <ServiceButton icon={<ShieldCheck size={20} />} label="Twoje Prawa" href="/legal/rights" />
        <ServiceButton icon={<LayoutDashboard size={20} />} label="Baza Wiedzy" href="/edu/guide" />
      </div>

      {/* POMOC I KONFIGURACJA */}
      <div className="servicesGroup">
        <p>Inne</p>
        <ServiceButton icon={<MessageSquareMore size={20} />} label="Wsparcie" href="/other/support" badge={2} />
        <ServiceButton icon={<Settings size={20} />} label="Ustawienia Profilu" href="/other/settings" />
        <ServiceButton icon={<HelpCircle size={20} />} label="Pomoc" href="/other/help" />
      </div>
    </div>
  );
}
