export type WebinarSignupRow = {
  name: string;
  surname: string;
  phone_number: string;
  email: string;
  /** Opcjonalna zgoda na komunikację handlową (checkbox w formularzu). */
  consent_marketing: boolean;
};
