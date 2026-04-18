"use client";

import { useRouter } from "next/navigation";
import Loader from "@/components/animations/loading";
import { useEffect, useMemo, useRef, useState } from "react";
import { FileText, Paperclip, Send, X, FileSpreadsheet, Camera } from "lucide-react";
import ServiceScreen from "@/components/menus/ServiceScreen";

export default function TranslatorPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl(null);
      (async () => {
        const res = await fetch("http://172.16.16.13:8000/session/new");
        const data = await res.json();
        setSessionId(data.session_id);
      })();
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const fileInfo = useMemo(() => {
    if (!file) return null;
    return {
      sizeMb: (file.size / (1024 * 1024)).toFixed(2),
      isImage: file.type.startsWith("image/"),
    };
  }, [file]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    if (message === "mock") router.push("/response/mock");

    const formData = new FormData();
    formData.append("session_id", sessionId ?? "");
    formData.append("message", message);
    if (file) formData.append("file", file);
    console.log(formData);
    setLoading(true);
    const res = await fetch("http://172.16.16.13:8000/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    router.push(`/response/${data.id}`);
  };

  if (loading) {
    return (
      <div className="response-loading">
        <Loader />
      </div>
    );
  }

  return (
    <ServiceScreen eyebrow="Analiza AI" title="Analizuj dokument" description="Załącz dokument i opisz co chciałbyś się dowiedzieć.">
      <form className="service-form" onSubmit={onSubmit}>
        <section className="form-block">
          <div className="form-block-top">
            <div>
              <h2>Dodaj dokument</h2>
              <p>PDF, DOCX, TXT, PNG, JPG, WEBP.</p>
            </div>

            <div className="button-row">
              <div className="button-container">
                <button type="button" className="icon-button" onClick={() => fileInputRef.current?.click()} aria-label="Z urządzenia">
                  <FileSpreadsheet size={18} color="blue" />
                </button>
                <h2>Z urządzenia</h2>
                <p>PDF, DOCX, TXT...</p>
              </div>
              <div className="button-container">
                <button type="button" className="icon-button greenBtn" onClick={() => alert("Funkcja niedostępna w tej wersji")} aria-label="Zrób zdjęcie">
                  <Camera size={18} color="green" />
                </button>
                <h2>Zrób zdjęcie</h2>
                <p>Jedno lub kilka</p>
              </div>
            </div>
          </div>

          <input ref={fileInputRef} type="file" className="hidden-input" onChange={(e) => setFile(e.target.files?.[0] ?? null)} accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp" />

          {file !== null && (
            <div className="file-preview">
              <div className="file-meta">
                <div className="file-icon">
                  <FileText size={18} />
                </div>
                <div className="file-text">
                  <strong>{file.name}</strong>
                  <span>
                    {file.type || "nieznany typ"} · {fileInfo?.sizeMb} MB
                  </span>
                </div>
              </div>

              <button type="button" className="remove-button" onClick={() => setFile(null)}>
                <X size={16} />
                Usuń
              </button>
            </div>
          )}

          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Podgląd pliku" />
            </div>
          )}
        </section>

        <section className="form-block">
          <label htmlFor="message">Twoje pytanie</label>
          <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Np. przetłumacz na prosty język i wypisz najważniejsze punkty..." rows={8} />
        </section>

        <button className="primary-button" type="submit">
          <Send size={18} />
          <h2>Analizuj dokument</h2>
        </button>
      </form>
    </ServiceScreen>
  );
}
