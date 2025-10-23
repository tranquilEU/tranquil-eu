// src/components/LanguageSwitcher.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

// Map languages to labels and flag emojis
const languages: Record<string, { nativeName: string; flag: string }> = {
	en: { nativeName: 'English', flag: '🇬🇧' },
	hr: { nativeName: 'Croatian', flag: '🇭🇷' }
};

export const LanguageSwitcher: React.FC = () => {
	const { i18n } = useTranslation();

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		i18n.changeLanguage(e.target.value);
	};

	return (
		<div style={{ marginTop: '1rem' }}>
			<select value={i18n.language} onChange={handleChange}>
				{Object.keys(languages).map(lng => (
					<option key={lng} value={lng}>
						{languages[lng].flag} {languages[lng].nativeName}
					</option>
				))}
			</select>
		</div>
	);
};
