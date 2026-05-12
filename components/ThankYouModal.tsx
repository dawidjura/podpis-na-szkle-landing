"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ThankYouModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ThankYouModal({ open, onClose }: ThankYouModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Potwierdzenie zapisu">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <img className="modal-bg" src="/assets/popup-bg.svg" alt="" aria-hidden="true" />

        <button type="button" className="modal-close" onClick={onClose} aria-label="Zamknij">
          &times;
        </button>

        <div className="modal-content">
          <div className="modal-logos">
            <img src="/assets/logo-euvic-white.svg" alt="Euvic" className="modal-logo-euvic" />
            <img src="/assets/gs1-logo.png" alt="GS1 Polska" className="modal-logo-gs1" />
          </div>

          <h2 className="modal-title">Dziękujemy za zapis na webinar!</h2>

          <div className="modal-body">
            <p>
              Potwierdzenie zapisu oraz najważniejsze informacje o wydarzeniu wysłaliśmy na podany adres e-mail.
              <br />
              Jeśli nie widzisz wiadomości, sprawdź folder SPAM.
            </p>
          </div>

          <div className="modal-footer-info">
            <p>Podpis na szkle | 20 czerwca 2026 | 13:00 | 60 minut</p>
            <img src="/assets/popup-arrows.svg" alt="" aria-hidden="true" className="modal-arrows" />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
