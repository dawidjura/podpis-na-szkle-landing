"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import { applyAnalyticsConsent } from "@/lib/analytics-consent";

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
          layout: "box",
          position: "middle center",
          equalWeightButtons: false,
          flipButtons: false,
        },
        preferencesModal: {
          layout: "box",
          position: "left",
          equalWeightButtons: true,
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
                'Używamy plików cookie niezbędnych do działania strony oraz — za Twoją zgodą — analitycznych (Google Tag Manager, Microsoft Clarity), aby ulepszać stronę. Możesz zaakceptować wszystkie lub wybrać tylko niezbędne. Więcej w <a href="#polityka-prywatnosci" class="cc-link">polityce prywatności</a>.',
              acceptAllBtn: "Akceptuj wszystkie",
              acceptNecessaryBtn: "Tylko niezbędne",
              showPreferencesBtn: "Ustawienia",
            },
            preferencesModal: {
              title: "Preferencje plików cookie",
              acceptAllBtn: "Akceptuj wszystkie",
              acceptNecessaryBtn: "Odrzuć opcjonalne",
              savePreferencesBtn: "Zapisz wybór",
              closeIconLabel: "Zamknij",
              sections: [
                {
                  title: "Używanie plików cookie",
                  description:
                    "Pliki cookie pomagają nam zapewnić podstawowe funkcje strony oraz — za zgodą — mierzyć ruch i poprawiać doświadczenie użytkownika.",
                },
                {
                  title: "Niezbędne",
                  description: "Wymagane do prawidłowego działania strony. Zawsze aktywne.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Analityczne",
                  description:
                    "Google Tag Manager i Microsoft Clarity — statystyki odwiedzin i zachowań na stronie (np. mapy ciepła, nagrania sesji).",
                  linkedCategory: "analytics",
                },
              ],
            },
          },
        },
      },
      onConsent: syncAnalyticsFromPreferences,
      onChange: syncAnalyticsFromPreferences,
    });

    if (CookieConsent.validConsent()) {
      syncAnalyticsFromPreferences();
    }
  }, []);

  return null;
}
