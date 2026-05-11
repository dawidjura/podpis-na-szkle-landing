type PhoneValidationResult =
  | { ok: true; phone: string }
  | { ok: false; error: string };

export function normalizePhoneNumber(input: string): PhoneValidationResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { ok: false, error: "Podaj numer telefonu." };
  }

  if (/[a-ząćęłńóśźż]/i.test(trimmed)) {
    return { ok: false, error: "Numer telefonu nie może zawierać liter." };
  }

  const cleaned = trimmed.replace(/[\s-]+/g, "");

  if (!/^\+?\d+$/.test(cleaned)) {
    return {
      ok: false,
      error: "Numer telefonu może zawierać tylko cyfry, spacje, myślniki oraz opcjonalny prefiks +48 lub 0048.",
    };
  }

  let localNumber = cleaned;

  if (localNumber.startsWith("+")) {
    if (!localNumber.startsWith("+48")) {
      return { ok: false, error: "Obsługiwany jest tylko opcjonalny prefiks +48 lub 0048." };
    }
    localNumber = localNumber.slice(3);
  } else if (localNumber.startsWith("0048")) {
    localNumber = localNumber.slice(4);
  }

  if (!/^\d+$/.test(localNumber)) {
    return { ok: false, error: "Numer telefonu może zawierać tylko cyfry po prefiksie." };
  }

  if (localNumber.length < 9) {
    return { ok: false, error: "Numer telefonu jest za krótki. Podaj dokładnie 9 cyfr." };
  }

  if (localNumber.length > 9) {
    return { ok: false, error: "Numer telefonu jest za długi. Podaj dokładnie 9 cyfr." };
  }

  if (!/^[1-9]\d{8}$/.test(localNumber)) {
    return { ok: false, error: "Numer telefonu powinien składać się z 9 cyfr i zaczynać od cyfry 1-9." };
  }

  return { ok: true, phone: localNumber };
}
