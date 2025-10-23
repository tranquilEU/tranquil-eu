import React from 'react';
import { useTranslation } from 'react-i18next';

import { Select } from '@/shared/components/Select';

const languages: Record<string, { nativeName: string; flag: string }> = {
	en: { nativeName: 'English', flag: '🇬🇧' },
	hr: { nativeName: 'Croatian', flag: '🇭🇷' }
};

export const LanguageSwitcher: React.FC = () => {
	const { i18n } = useTranslation();

	const handleChange = (value: string) => {
		i18n.changeLanguage(value);
	};

	return (
		<Select
			options={Object.keys(languages).map(lng => ({
				label: `${languages[lng].flag} ${languages[lng].nativeName}`,
				value: lng
			}))}
			placeholder={i18n.t('common.selectLanguage')}
			onChange={handleChange}
		/>
	);
};
