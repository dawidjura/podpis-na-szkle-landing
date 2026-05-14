"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const PRIVACY_POLICY_PDF =
  "/assets/2026-01-02-klauzula-EUV-dla-osob-rejestrujacych-sie-na-wydarzenia.pdf";

function PrivacyPdfModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="privacy-pdf-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Polityka prywatności (PDF)"
    >
      <div className="privacy-pdf-panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="privacy-pdf-close" onClick={onClose} aria-label="Zamknij">
          &times;
        </button>
        <iframe
          title="Polityka prywatności"
          src={`${PRIVACY_POLICY_PDF}#toolbar=0`}
          className="privacy-pdf-frame"
        />
      </div>
    </div>,
    document.body,
  );
}

type PrivacyPdfLinkProps = {
  className?: string;
  children: React.ReactNode;
  /** Wywoływane przy otwarciu nakładki (np. zamknięcie menu mobilnego). */
  onOpenPreview?: () => void;
};

/** Zwykły klik otwiera PDF w nakładce; Ctrl/Cmd/środkowy klik — domyślne zachowanie przeglądarki (nowa karta itd.). */
export default function PrivacyPdfLink({ className, children, onOpenPreview }: PrivacyPdfLinkProps) {
  const [open, setOpen] = useState(false);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      onOpenPreview?.();
      setOpen(true);
    },
    [onOpenPreview],
  );

  return (
    <>
      <a href={PRIVACY_POLICY_PDF} className={className} rel="noopener noreferrer" onClick={onClick}>
        {children}
      </a>
      <PrivacyPdfModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
