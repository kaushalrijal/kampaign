import { ContactRow } from "../types";

const PLACEHOLDER_REGEX = /\{([^}]+)\}/g;

export default function renderTemplate(template: string, contact: ContactRow): string{

    return template.replace(PLACEHOLDER_REGEX, (fullMatch, rawKey) => {
        const key = rawKey.trim();

        if(!(key in contact)){
            return fullMatch // leave as iti s
        }

        const value = contact[key];

        if(value===null || value===undefined || value === ""){
            return fullMatch;
        }
        return String(value)
    })
}