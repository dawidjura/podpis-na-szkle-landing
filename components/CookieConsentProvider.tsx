"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import { applyAnalyticsConsent } from "@/lib/analytics-consent";

const RODO_URL = "https://www.euvic.com/pl/rodo/";

function arrangeConsentButtons(modal: HTMLElement) {
  const btns = modal.querySelector(".cm__btns");
  if (!btns || btns.classList.contains("cm__btns--euvic")) return;

  btns.classList.add("cm__btns--euvic");
  btns.querySelectorAll(".cm__btn-group").forEach((group) => {
    group.classList.add("cm__btn-group--euvic");
  });

  const customize = modal.querySelector('[data-role="show"]');
  if (customize instanceof HTMLButtonElement) {
    customize.classList.add("cm__btn", "cm__btn--secondary");
  }
}

function syncAnalyticsFromPreferences() {
  const prefs = CookieConsent.getUserPreferences();
  const analyticsAccepted = prefs.acceptedCategories.includes("analytics");
  applyAnalyticsConsent(analyticsAccepted);
}

export default function CookieConsentProvider() {
  useEffect(() => {
    CookieConsent.run({
      disablePageInteraction: true,
      autoShow: true,
      hideFromBots: true,
      mode: "opt-in",
      cookie: {
        name: "cc_cookie",
        expiresAfterDays: 182,
      },
      guiOptions: {
        consentModal: {
          layout: "box wide",
          position: "middle center",
          equalWeightButtons: false,
          flipButtons: false,
        },
        preferencesModal: {
          layout: "box",
          position: "middle center",
          equalWeightButtons: false,
          flipButtons: false,
        },
      },
      categories: {
        necessary: {
          readOnly: true,
          enabled: true,
        },
        analytics: {
          enabled: false,
          autoClear: {
            cookies: [
              { name: /^_cl/ },
              { name: /^_ga/ },
              { name: /^_gid/ },
              { name: /^_gat/ },
            ],
          },
          services: {
            gtm: {
              label: "Google Tag Manager",
            },
            clarity: {
              label: "Microsoft Clarity",
            },
          },
        },
      },
      language: {
        default: "pl",
        translations: {
          pl: {
            consentModal: {
              title: "Pliki cookie na tej stronie",
              description:
                `Zapisujemy Twoją decyzję o plikach cookie. Za Twoją zgodą stosujemy też pliki analityczne (Google Tag Manager, Microsoft Clarity), aby ulepszać stronę. Więcej w <a href="${RODO_URL}" class="cc-link" target="_blank" rel="noopener noreferrer">polityce prywatności</a>.`,
              acceptAllBtn: "Akceptuj wszystkie",
              acceptNecessaryBtn: "Odrzuć",
              showPreferencesBtn: "Dostosuj",
            },
            preferencesModal: {
              title: "Preferencje plików cookie",
              acceptAllBtn: "Akceptuj wszystkie",
              acceptNecessaryBtn: "Odrzuć",
              savePreferencesBtn: "Zapisz wybór",
              closeIconLabel: "Zamknij",
              serviceCounterLabel: "Usługi",
              sections: [
                {
                  title: "Używanie plików cookie",
                  description:
                    `Tutaj wybierasz pliki cookie. Ściśle niezbędne służą wyłącznie zapamiętaniu Twojej decyzji i na mocy prawa UE nie wymagają osobnej zgody. Analityczne włączysz tylko, jeśli wyrazisz na nie zgodę. Więcej w <a href="${RODO_URL}" class="cc-link" target="_blank" rel="noopener noreferrer">polityce prywatności</a>.`,
                },
                {
                  title: "Ściśle niezbędne",
                  description:
                    "Pliki cookie zapisujące Twój wybór w banerze. Bez nich musielibyśmy pytać o zgodę przy każdej wizycie.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Analityczne",
                  description:
                    "Google Tag Manager i Microsoft Clarity: statystyki odwiedzin, zachowania na stronie (mapy ciepła, nagrania sesji) i ulepszanie strony.",
                  linkedCategory: "analytics",
                },
              ],
            },
          },
        },
      },
      onConsent: syncAnalyticsFromPreferences,
      onChange: syncAnalyticsFromPreferences,
      onModalReady: ({ modalName, modal }) => {
        if (modalName === "consentModal") {
          arrangeConsentButtons(modal);
        }
      },
    });

    if (CookieConsent.validConsent()) {
      syncAnalyticsFromPreferences();
    }
  }, []);

  return null;
}
