"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import Services from "@/components/layout/Services";

export default function Home() {
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, login } = useAuth();

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (login(password)) {
      setError("");
      return;
    }

    setError("Nieprawidłowe hasło.");
  };

  if (isAuthenticated) {
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
