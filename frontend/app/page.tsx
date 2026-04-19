"use client";

import { FormEvent, useState, useSyncExternalStore } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import Services from "@/components/layout/Services";

const APP_PASSWORD = "hackcarpathia";
const AUTH_STORAGE_KEY = "hackcarpathia-authenticated";

export default function Home() {
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const hasStoredAccess =
    isClient && window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password === APP_PASSWORD) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
      setIsAuthenticated(true);
      setError("");
      return;
    }

    setError("Nieprawidłowe hasło.");
  };

  if (!isClient) {
    return null;
  }

  if (isAuthenticated || hasStoredAccess) {
    return (
      <div id="MainPage" suppressHydrationWarning={true}>
        <Services />
      </div>
    );
  }

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-card">
          <div className="login-icon">
            <LockKeyhole size={28} />
          </div>

          <div className="login-copy">
            <p className="login-eyebrow">Dostęp</p>
            <h1>Zaloguj się hasłem</h1>
            <p className="login-description">Aby wejść do aplikacji, wpisz hasło i kliknij „Zaloguj”.</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <label className="field" htmlFor="password">
              <span>Hasło</span>
              <div className="password-field">
                <input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Wpisz hasło"
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={isPasswordVisible ? "Ukryj hasło" : "Pokaż hasło"}
                  onClick={() => setIsPasswordVisible((current) => !current)}
                >
                  {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-button" disabled={!password.trim()}>
              Zaloguj
            </button>

            <button type="button" className="login-link">
              Nie pamiętam hasła
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
