"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface ServiceButtonProps {
  icon: ReactNode;
  label: string;
  href: string;
  badge?: number;
}

export default function ServiceButton({ icon, label, href, badge }: ServiceButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <button className={`service-button ${isActive ? "active" : ""}`} onClick={() => router.push(href)} type="button">
      <div className="service-icon">{icon}</div>

      <span className="service-label">
        {label.replace("_", " ")} {/* Zamiana dashboard_analytics na Dashboard Analytics */}
      </span>

      <div className="service-chevron">
        <ChevronRight size={16} color="#9298b0" />
      </div>
    </button>
  );
}
