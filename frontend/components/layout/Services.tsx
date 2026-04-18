"use client";
import { LayoutDashboard, Users, ShoppingCart, Kanban, BarChart, Calendar, Mail, Settings } from "lucide-react";
import ServiceButton from "../menus/ServiceButton";

export default function Services() {
  return (
    <div id="services" className="">
      <div className="servicesGroup">
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">mPrzyszłość</h1>
        <ServiceButton icon={<LayoutDashboard size={20} />} label="Dashboard" href="/crm/dashboard" />
        <ServiceButton icon={<Users size={20} />} label="Clients" href="/crm/clients" />
        <ServiceButton icon={<ShoppingCart size={20} />} label="Orders" href="/crm/orders" />
      </div>

      <div className="servicesGroup">
        <p>Events</p>
        <ServiceButton icon={<Calendar size={20} />} label="Calendar" href="/events/calendar" />
      </div>

      <div className="servicesGroup">
        <p>Others</p>
        <ServiceButton icon={<Mail size={20} />} label="Mail" href="/other/mail" badge={5} />
        <ServiceButton icon={<Settings size={20} />} label="Settings" href="/other/settings" />
      </div>
    </div>
  );
}
