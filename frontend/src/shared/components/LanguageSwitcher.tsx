import { useTranslation } from 'react-i18next';

import { Select } from '@/shared/components/Select';

type TLanguages = {
	nativeName: string;
	flag: string;
};

type LanguageSwitcherProps = {
	defaultLanguage?: string;
};

const languages: Record<string, TLanguages> = {
	en: { nativeName: 'English', flag: '🇬🇧' },
	hr: { nativeName: 'Croatian', flag: '🇭🇷' }
};

export const LanguageSwitcher = ({
	defaultLanguage
}: LanguageSwitcherProps) => {
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
			defaultValue={defaultLanguage}
		/>
	);
};
