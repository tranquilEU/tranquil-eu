import { Heading } from '@/shared/components/Heading';
import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/shared/constants';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LanguageSwitcher } from '../shared/components/LanguageSwitcher';

const Home: React.FC = () => {
	const { t } = useTranslation('translation');
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<Heading size="h2" className="text-blue-500">
					{t('login.title')}
				</Heading>
				<LanguageSwitcher />
				<Button type="button" onClick={() => navigate(ROUTES.Login)}>
					{t('common.login')}
				</Button>
			</form>
		</div>
	);
};

export default Home;
