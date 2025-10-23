import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { Paragraph } from '@/shared/components/Paragraph';
import { Spinner } from '@/shared/components/Spinner';
import { Button } from '@/shared/components/ui/button';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

import { ROUTES } from '@/shared/constants';

import { usePostApiAuthResetPassword } from '@/shared/api/client';

const ResetPassword = () => {
	const { t } = useTranslation('translation');
	const { token } = useParams<{ token: string }>();
	const navigate = useNavigate();

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { mutateAsync: resetPassword, isPending } =
		usePostApiAuthResetPassword();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!token) {
			toast.error(t('resetPassword.errorResponse'));
			return;
		}
		if (password !== confirmPassword) {
			setErrorMessage(t('resetPassword.passwordMismatch'));
			return;
		}
		try {
			const res = await resetPassword({ data: { token, password } });
			if (res.status === 'success') {
				toast.success(t('resetPassword.success'));
				navigate(ROUTES.Login);
			} else {
				toast.error(t('resetPassword.errorResponse'));
			}
		} catch {
			toast.error(t('resetPassword.errorResponse'));
		}
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-green-300 p-4">
			<form onSubmit={handleSubmit} className="w-full max-w-md">
				<Card className="mx-auto w-full max-w-md">
					<CardHeader>
						<CardTitle>{t('resetPassword.title')}</CardTitle>
						<CardDescription>{t('resetPassword.description')}</CardDescription>
						<CardAction>
							<Button variant="link" onClick={() => navigate(ROUTES.Login)}>
								{t('resetPassword.backToLogin')}
							</Button>
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Paragraph htmlFor="password">{t('common.password')}</Paragraph>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={e => setPassword(e.target.value)}
									placeholder={t('common.passwordPlaceholder')}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Paragraph htmlFor="confirmPassword">
									{t('resetPassword.confirmPassword')}
								</Paragraph>
								<Input
									id="confirmPassword"
									type="password"
									value={confirmPassword}
									onChange={e => setConfirmPassword(e.target.value)}
									placeholder={t('common.passwordPlaceholder')}
									required
								/>
								{errorMessage && (
									<Paragraph type="error">{errorMessage}</Paragraph>
								)}
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex-col gap-2">
						<Button type="submit" className="w-full">
							{isPending ? <Spinner /> : t('resetPassword.submitButton')}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</div>
	);
};

export default ResetPassword;
