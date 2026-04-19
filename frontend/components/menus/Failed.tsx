"use client";

import { useRouter } from "next/navigation";
import { WifiOff, ServerCrash, FileX2, FileScan, Clock, FileQuestion, RefreshCw, ArrowLeft, AlertTriangle } from "lucide-react";

// ─────────────────────────────────────────────
//  Typy
// ─────────────────────────────────────────────

export type FailReason =
  | "network" // brak połączenia z backendem
  | "not_found" // 404 – dokument / wynik nie istnieje
  | "server_error" // 5xx – błąd po stronie serwera
  | "timeout" // przekroczono czas oczekiwania
  | "ocr_failed" // nie udało się odczytać dokumentu
  | "invalid_format" // nieobsługiwany format pliku
  | "unknown"; // wszystko inne

interface FailedProps {
  reason?: FailReason;
  /** Opcjonalnie – surowy komunikat błędu z backendu */
  detail?: string;
  /** Czy pokazać przycisk "Wróć" */
  showBack?: boolean;
  /** Czy pokazać przycisk "Spróbuj ponownie" */
  onRetry?: () => void;
}

// ─────────────────────────────────────────────
//  Dane per-błąd
// ─────────────────────────────────────────────

const ERROR_CONFIG: Record<
  FailReason,
  {
    icon: React.ReactNode;
    color: string;
    title: string;
    description: string;
    hint: string;
  }
> = {
  network: {
    icon: <WifiOff size={32} />,
    color: "#ef4444",
    title: "Brak połączenia z serwerem",
    description: "Nie udało się nawiązać połączenia z backendem. Sprawdź, czy serwer działa i czy masz dostęp do sieci.",
    hint: "Upewnij się, że backend jest uruchomiony pod właściwym adresem.",
  },
  not_found: {
    icon: <FileX2 size={32} />,
    color: "#f59e0b",
    title: "Wynik nie został znaleziony",
    description: "Dokument o podanym identyfikatorze nie istnieje lub mógł zostać usunięty.",
    hint: "Wróć do historii i wybierz inny wynik analizy.",
  },
  server_error: {
    icon: <ServerCrash size={32} />,
    color: "#ef4444",
    title: "Błąd serwera",
    description: "Serwer napotkał nieoczekiwany problem podczas przetwarzania Twojego żądania.",
    hint: "Spróbuj ponownie za chwilę. Jeśli problem się powtarza – zgłoś to w zakładce Wsparcie.",
  },
  timeout: {
    icon: <Clock size={32} />,
    color: "#f59e0b",
    title: "Przekroczono czas oczekiwania",
    description: "Serwer nie odpowiedział w wymaganym czasie. Analiza dużego dokumentu może trwać dłużej niż zwykle.",
    hint: "Odśwież stronę lub prześlij dokument ponownie.",
  },
  ocr_failed: {
    icon: <FileScan size={32} />,
    color: "#f59e0b",
    title: "Nie udało się odczytać dokumentu",
    description: "System OCR nie mógł wyciągnąć tekstu z przesłanego pliku. Zdjęcie mogło być zbyt ciemne, rozmyte lub obrócone.",
    hint: "Zrób wyraźne zdjęcie przy dobrym oświetleniu lub prześlij plik PDF z warstwą tekstową.",
  },
  invalid_format: {
    icon: <FileQuestion size={32} />,
    color: "#8b5cf6",
    title: "Nieobsługiwany format pliku",
    description: "Przesłany plik nie jest obsługiwany. Akceptujemy dokumenty PDF oraz zdjęcia w formatach JPG i PNG.",
    hint: "Przekonwertuj plik do obsługiwanego formatu i spróbuj ponownie.",
  },
  unknown: {
    icon: <AlertTriangle size={32} />,
    color: "#ef4444",
    title: "Wystąpił nieznany błąd",
    description: "Coś poszło nie tak. Przepraszamy za utrudnienia — nasz zespół już nad tym pracuje.",
    hint: "Spróbuj ponownie lub skontaktuj się z pomocą techniczną.",
  },
};

// ─────────────────────────────────────────────
//  Helper: mapuj HTTP status → FailReason
// ─────────────────────────────────────────────

export function httpStatusToReason(status: number): FailReason {
  if (status === 404) return "not_found";
  if (status === 408 || status === 504) return "timeout";
  if (status >= 500) return "server_error";
  return "unknown";
}

// ─────────────────────────────────────────────
//  Komponent
// ─────────────────────────────────────────────

export default function Failed({ reason = "unknown", detail, showBack = true, onRetry }: FailedProps) {
  const router = useRouter();
  const cfg = ERROR_CONFIG[reason];

  return (
    <main className="response-page failed-page">
      <div className="failed-shell">
        {/* ── Ilustracja / ikona ── */}
        <div className="failed-icon-wrap" style={{ "--fail-color": cfg.color } as React.CSSProperties}>
          <div className="failed-icon-ring">
            <div className="failed-icon">{cfg.icon}</div>
          </div>
        </div>

        {/* ── Treść ── */}
        <div className="failed-content">
          <span className="failed-eyebrow">Błąd</span>
          <h1 className="failed-title">{cfg.title}</h1>
          <p className="failed-description">{cfg.description}</p>

          <div className="failed-hint">
            <span>💡</span>
            <p>{cfg.hint}</p>
          </div>

          {/* Surowy komunikat z backendu – tylko dla developerów */}
          {detail && (
            <details className="failed-detail">
              <summary>Szczegóły techniczne</summary>
              <code>{detail}</code>
            </details>
          )}
        </div>

        {/* ── Akcje ── */}
        <div className="failed-actions">
          {onRetry && (
            <button className="failed-btn failed-btn-primary" onClick={onRetry}>
              <RefreshCw size={16} />
              Spróbuj ponownie
            </button>
          )}

          {showBack && (
            <button className="failed-btn failed-btn-secondary" onClick={() => router.back()}>
              <ArrowLeft size={16} />
              Wróć
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
