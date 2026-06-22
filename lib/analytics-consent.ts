export const GTM_ID = "GTM-MTWKBGLT";
export const CLARITY_PROJECT_ID = "x8z7grnd3f";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
  }
}

function pushGtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export function updateGoogleConsent(analyticsGranted: boolean) {
  const state = analyticsGranted ? "granted" : "denied";
  pushGtag("consent", "update", {
    analytics_storage: state,
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    functionality_storage: "granted",
    personalization_storage: state,
  });
}

export function sendClarityConsent(analyticsGranted: boolean) {
  const state = analyticsGranted ? "granted" : "denied";
  window.clarity =
    window.clarity ||
    function (...args: unknown[]) {
      (window.clarity!.q = window.clarity!.q || []).push(args);
    };
  window.clarity("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: state,
  });
}

let gtmLoaded = false;
let clarityLoaded = false;

export function loadGtm() {
  if (gtmLoaded || typeof document === "undefined") return;
  gtmLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  script.dataset.gtm = GTM_ID;
  document.head.appendChild(script);
}

export function loadClarity() {
  if (clarityLoaded || typeof document === "undefined") return;
  clarityLoaded = true;

  window.clarity =
    window.clarity ||
    function (...args: unknown[]) {
      (window.clarity!.q = window.clarity!.q || []).push(args);
    };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  script.dataset.clarity = CLARITY_PROJECT_ID;
  document.head.appendChild(script);
}

export function applyAnalyticsConsent(analyticsGranted: boolean) {
  if (analyticsGranted) {
    loadGtm();
    loadClarity();
    updateGoogleConsent(true);
    sendClarityConsent(true);
    return;
  }

  updateGoogleConsent(false);
  if (clarityLoaded) {
    sendClarityConsent(false);
  }
}
