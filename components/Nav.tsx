"use client";
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef } from "react";
import PrivacyPdfLink from "./PrivacyPdfLink";

const MOBILE_NAV_ID = "nav-mobile-toggle";

function NavMenuBody({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <div className="nav-links">
        <a href="#agenda" onClick={onNavigate}>
          Agenda
        </a>
        <a href="#dla-kogo" onClick={onNavigate}>
          Dla kogo jest webinar
        </a>
        <a href="#prelegenci" onClick={onNavigate}>
          Prelegenci
        </a>
        <a href="#organizatorzy" onClick={onNavigate}>
          Organizatorzy
        </a>
        <PrivacyPdfLink onOpenPreview={onNavigate}>
          Polityka prywatności
        </PrivacyPdfLink>
      </div>
      <a className="nav-cta" href="#rejestracja" onClick={onNavigate}>
        Zapisz się
      </a>
    </>
  );
}

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLInputElement>(null);

  const closeMobile = useCallback(() => {
    const cb = toggleRef.current;
    if (!cb?.checked) return;
    cb.checked = false;
    document.body.style.overflow = "";
  }, []);

  const syncBodyScroll = useCallback(() => {
    const open = toggleRef.current?.checked ?? false;
    document.body.style.overflow = open ? "hidden" : "";
  }, []);

  useEffect(() => {
    const cb = toggleRef.current;
    if (!cb) return;
    const onChange = () => syncBodyScroll();
    cb.addEventListener("change", onChange);
    syncBodyScroll();
    return () => {
      cb.removeEventListener("change", onChange);
      document.body.style.overflow = "";
    };
  }, [syncBodyScroll]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && toggleRef.current?.checked) closeMobile();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMobile]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1531px)");
    const onMq = () => {
      if (mq.matches) closeMobile();
    };
    mq.addEventListener("change", onMq);
    onMq();
    return () => mq.removeEventListener("change", onMq);
  }, [closeMobile]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const mq = window.matchMedia("(min-width: 1531px)");

    const readScrollY = () =>
      Math.max(
        window.scrollY ?? 0,
        window.pageYOffset ?? 0,
        document.documentElement.scrollTop ?? 0,
        document.body.scrollTop ?? 0,
      );

    let scrollCleanup: (() => void) | undefined;

    const bindDesktopScroll = () => {
      scrollCleanup?.();
      scrollCleanup = undefined;

      if (!mq.matches) {
        nav.classList.remove("nav-scrolled");
        return;
      }

      let ticking = false;
      const apply = () => {
        nav.classList.toggle("nav-scrolled", readScrollY() > 10);
        ticking = false;
      };

      const schedule = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(apply);
        }
      };

      apply();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);

      scrollCleanup = () => {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
      };
    };

    bindDesktopScroll();
    mq.addEventListener("change", bindDesktopScroll);

    return () => {
      mq.removeEventListener("change", bindDesktopScroll);
      scrollCleanup?.();
      nav.classList.remove("nav-scrolled");
    };
  }, []);

  return (
    <nav ref={navRef} className="nav-bar" aria-label="Główna nawigacja">
      {/* Pierwszy w <nav> — selektory #…:checked ~ … w CSS */}
      <input
        ref={toggleRef}
        type="checkbox"
        id={MOBILE_NAV_ID}
        className="nav-mobile-toggle"
        aria-hidden="true"
        tabIndex={-1}
      />

      <a className="nav-logo" href="#top">
        <img src="/assets/logo.8fea627a.svg" alt="Euvic" width={178} height={32} />
      </a>

      <label
        htmlFor={MOBILE_NAV_ID}
        className="nav-hamburger"
        aria-label="Otwórz lub zamknij menu"
        aria-controls="nav-mobile-sheet"
      >
        <span className="hamburger-line" aria-hidden="true" />
      </label>

      <div className="nav-right nav-right--desktop">
        <NavMenuBody onNavigate={closeMobile} />
      </div>

      <label htmlFor={MOBILE_NAV_ID} className="nav-mobile-backdrop" aria-label="Zamknij menu" />

      <div
        className="nav-mobile-sheet"
        id="nav-mobile-sheet"
        role="navigation"
        aria-label="Menu nawigacji strony"
      >
        <NavMenuBody onNavigate={closeMobile} />
      </div>
    </nav>
  );
}
