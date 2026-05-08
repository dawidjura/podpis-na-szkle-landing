"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useCallback } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <nav className="nav-bar" aria-label="Główna nawigacja">
      <a className="nav-logo" href="#top">
        <img src="/assets/logo.8fea627a.svg" alt="Euvic" width={178} height={32} />
      </a>

      <button
        className="nav-hamburger"
        aria-label={open ? "Zamknij menu" : "Otwórz menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`hamburger-line ${open ? "open" : ""}`} />
      </button>

      <div className={`nav-right ${open ? "nav-open" : ""}`}>
        <div className="nav-links">
          <a href="#agenda" onClick={close}>Agenda</a>
          <a href="#dla-kogo" onClick={close}>Dla kogo jest webinar</a>
          <a href="#prelegenci" onClick={close}>Prelegenci</a>
          <a href="#oferta" onClick={close}>Oferta dla logistyki</a>
          <a href="#organizatorzy" onClick={close}>Organizatorzy</a>
          <a href="#polityka-prywatnosci" onClick={close}>Polityka prywatności</a>
        </div>
        <a className="nav-cta" href="#rejestracja" onClick={close}>Zapisz się</a>
      </div>
    </nav>
  );
}
