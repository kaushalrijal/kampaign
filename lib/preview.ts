import renderTemplate from "./template/render";
import { ContactRow } from "./types";

export interface RenderedPreview {
  subject: string;
  html: string;
}

export function renderEmailPreview(
  subject: string,
  htmlOutput: string,
  contact: ContactRow | null
): RenderedPreview {
  if (!contact) {
    return { subject: "", html: "" };
  }

  return {
    subject: renderTemplate(subject, contact),
    html: renderTemplate(htmlOutput, contact),
  };
}

export function getRandomContact(contacts: ContactRow[]): ContactRow | null {
  if (contacts.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * contacts.length);
  return contacts[randomIndex];
}
