"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useCallback, useEffect } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const updateScrolled = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setScrolled(scrollTop > 4);
    };

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    window.addEventListener("resize", updateScrolled);

    return () => {
      window.removeEventListener("scroll", updateScrolled);
      window.removeEventListener("resize", updateScrolled);
    };
  }, []);

  return (
    <nav className={`nav-bar${scrolled ? " nav-scrolled" : ""}${open ? " nav-opened" : ""}`} aria-label="Główna nawigacja">
      <a className="nav-logo" href="#top">
        <img src="/assets/logo.8fea627a.svg" alt="Euvic" width={178} height={32} />
      </a>

      <input
        id="nav-toggle"
        className="nav-toggle"
        type="checkbox"
        checked={open}
        onChange={(event) => setOpen(event.target.checked)}
      />
      <label
        htmlFor="nav-toggle"
        className="nav-hamburger"
        aria-label={open ? "Zamknij menu" : "Otwórz menu"}
        aria-expanded={open}
        role="button"
      >
        <span className={`hamburger-line ${open ? "open" : ""}`} />
      </label>

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
