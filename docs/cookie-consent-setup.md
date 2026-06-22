# Cookie consent — konfiguracja GTM i Clarity

Landing używa [vanilla-cookieconsent](https://cookieconsent.orestbida.com/) (MIT). GTM (`GTM-MTWKBGLT`) i Clarity (`x8z7grnd3f`) ładują się dopiero po akceptacji kategorii **Analityczne**.

## Kod (repo)

| Plik | Rola |
|------|------|
| [`app/layout.tsx`](../app/layout.tsx) | `gtag('consent','default', … denied)` przed interakcją |
| [`components/CookieConsentProvider.tsx`](../components/CookieConsentProvider.tsx) | Banner PL, sync zgody |
| [`lib/analytics-consent.ts`](../lib/analytics-consent.ts) | Inject GTM/Clarity + Consent Mode v2 + `clarity('consentv2')` |

## Checklist — Google Tag Manager

1. **Admin → Container Settings → Enable consent overview** (Consent Overview).
2. Dla każdego tagu GA4 / Google Ads ustaw **Built-in consent checks**:
   - GA4 → wymaga `analytics_storage`
   - Ads / remarketing → wymaga `ad_storage`, `ad_user_data`, `ad_personalization`
3. Dodaj tag **Consent Initialization** (jeśli brak) z triggerem **Consent Initialization – All Pages** — domyślnie `denied` (kod w `layout.tsx` robi to przed GTM).
4. **Preview mode**: odrzuć cookies → tagi analityczne nie powinny fire; zaakceptuj → tagi fire po `consent update`.
5. Opublikuj kontener po weryfikacji.

## Checklist — Microsoft Clarity

1. Projekt `x8z7grnd3f` → **Settings → Consent mode** → włącz.
2. Po deploy: DevTools → Application → Cookies:
   - **Przed** zgodą: brak `_clck`, `_clsk`
   - **Po** „Akceptuj wszystkie”: cookies Clarity obecne
   - **Po** „Odrzuć”: brak cookies Clarity (no-consent mode)
3. W nagraniach sesji sprawdź, że nowe sesje po odrzuceniu nie zapisują pełnych danych cross-page.

## Test manualny (formularz + dead clicki)

Viewporty: **375**, **390**, **768**, **1024**, **1280** px (Chrome DevTools + iPhone Safari / Android Chrome).

| Akcja | Oczekiwany efekt |
|-------|------------------|
| Tap w label pola (np. „Imię”) | Focus w input |
| Tap w pustą przestrzeń w `.field` obok inputu | Focus w input |
| Tap w kwadrat checkboxa (nie tekst) | Checkbox toggle |
| Submit bez zgód | Komunikat błędu widoczny |
| Podwójny tap Submit w trakcie wysyłki | „Wysyłamy zgłoszenie, proszę czekać…” |
| Enter w polu e-mail | Submit formularza |

**Clarity (po 5–7 dniach):** porównaj **Dead clicks** na `#rejestracja` z baseline 66,67% (6/9 sesji).

## Autofill

Pola mają `autoComplete="given-name" | "family-name" | "tel" | "email"` — autofill to **przeglądarka/OS**. Brak zapisanych danych w przeglądarce = brak podpowiedzi (nie bug frontu).
