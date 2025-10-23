import en from '@public/locales/en/translation.json';
import hr from '@public/locales/hr/translation.json';

export const defaultNS = 'translation';

export const resources = {
	en: { translation: en },
	hr: { translation: hr }
} as const;
