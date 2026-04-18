"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FileText, Paperclip, Send, X } from "lucide-react";
import ServiceScreen from "@/components/menus/ServiceScreen";

export default function TranslatorPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl(null);
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
    formData.append("message", message);
    if (file) formData.append("file", file);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    router.push(`/response/${data.id}`);
  };

  return (
    <ServiceScreen eyebrow="Analiza AI" title="Tłumacz pism" description="Załącz dokument i opisz co chciałbyś się dowiedzieć.">
      <form className="service-form" onSubmit={onSubmit}>
        <section className="form-block">
          <div className="form-block-top">
            <div>
              <h2>Załącz dokument</h2>
              <p>PDF, DOCX, TXT, PNG, JPG, WEBP.</p>
            </div>

            <button type="button" className="icon-button" onClick={() => fileInputRef.current?.click()} aria-label="Dodaj plik">
              <Paperclip size={18} />
            </button>
          </div>

          <input ref={fileInputRef} type="file" className="hidden-input" onChange={(e) => setFile(e.target.files?.[0] ?? null)} accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp" />

          {!file ? (
            <button type="button" className="dropzone" onClick={() => fileInputRef.current?.click()}>
              <FileText size={30} />
              <span>Dotknij, aby wybrać plik</span>
              <small>Plik będzie dołączony do wiadomości.</small>
            </button>
          ) : (
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
          <label htmlFor="message">Wiadomość do LLM</label>
          <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Np. przetłumacz na prosty język i wypisz najważniejsze punkty..." rows={8} />
          <div className="hint-row">
            <span>Wersja tymczasowa bez integracji z modelem.</span>
            <span>{message.length} znaków</span>
          </div>
        </section>

        <button className="primary-button" type="submit">
          <Send size={18} />
        </button>
      </form>
    </ServiceScreen>
  );
}
