import {
  emailButton,
  emailList,
  emailParagraph,
  escAttr,
  wrapEmailBody,
  type EmailBanner,
} from "./layout";

export const PRE_WEBINAR_LANDING_URL = "https://podpis-na-szkle.euvic.io/";

export interface PreWebinarReminderParams {
  /** Osobisty auto-login ClickMeeting. */
  joinUrl?: string;
  banner?: EmailBanner;
}

const WEBINAR_FULL_TITLE =
  "Podpis na szkle – dowód dostawy nie do podważenia – Webinar GS1 &amp; Euvic";

const LINK_STYLE =
  "color:#006eb8;text-decoration:underline;font-weight:inherit;";

function webinarTitleLink(): string {
  return `<a href="${escAttr(
    PRE_WEBINAR_LANDING_URL,
  )}" target="_blank" rel="noopener noreferrer" style="${LINK_STYLE}">${WEBINAR_FULL_TITLE}</a>`;
}

export function buildPreWebinarReminderHtml(
  params: PreWebinarReminderParams,
): string {
  const { joinUrl, banner } = params;
  const titleLink = webinarTitleLink();

  const parts: string[] = [
    emailParagraph("Cześć,"),
    emailParagraph(
      `Już za godzinę rozpoczynamy webinar ${titleLink}.`,
    ),
    emailParagraph("Startujemy dzisiaj, o godzinie 14:00."),
    emailParagraph(
      "W celu wzięcia udziału w wydarzeniu, kliknij w poniższy przycisk.",
    ),
  ];

  if (joinUrl?.trim()) {
    parts.push(emailButton(joinUrl.trim(), "Dołącz do webinaru"));
  }

  parts.push(
    emailParagraph("<strong>Podczas webinaru porozmawiamy o tym:</strong>", false, 24),
    emailList([
      "skąd najczęściej biorą się trudności związane z potwierdzaniem realizacji dostaw,",
      "jak wykorzystanie standardów GS1 usprawnia identyfikację jednostek logistycznych,",
      "w jaki sposób elektroniczne potwierdzenie dostawy pomaga ograniczyć liczbę reklamacji i sporów,",
      "jakie dane warto rejestrować, aby dowód dostawy był pełny, rzetelny i łatwy do zweryfikowania.",
    ]),
    emailParagraph(
      "<strong>Po zakończeniu spotkania uczestnicy będą mogli umówić się na bezpłatną konsultację, podczas której:</strong>",
      false,
      24,
    ),
    emailList([
      "przeanalizujemy poziom cyfryzacji procesów logistycznych w organizacji,",
      "omówimy obszary generujące najwięcej niejasności i wyzwań w łańcuchu dostaw,",
      "przedstawimy rozwiązania wspierające skuteczne monitorowanie i dokumentowanie realizacji dostaw.",
    ]),
    emailParagraph(
      "<strong>Do zobaczenia już o 14:00!</strong><br /><strong>Zespół GS1 &amp; Euvic</strong>",
      true,
      24,
    ),
  );

  return wrapEmailBody(parts.join("\n"), banner);
}

export const PRE_WEBINAR_SUBJECT =
  'Już za godzinę webinar "Podpis na szkle" - startujemy dzisiaj, o 14:00';
