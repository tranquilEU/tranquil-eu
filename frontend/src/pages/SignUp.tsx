import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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

import { usePostApiAuthRegister } from '@/shared/api/client';

const SignUp = () => {
	const navigate = useNavigate();
	const { t } = useTranslation('translation');

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { mutate, isPending, isError } = usePostApiAuthRegister({
		mutation: {
			onSuccess: data => {
				localStorage.setItem('accessToken', data.accessToken ?? '');
				localStorage.setItem('refreshToken', data.refreshToken ?? '');
				navigate(ROUTES.Dashboard);
				toast.success(t('signUp.registrationSuccessful'));
			},
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onError: (error: any) => {
				setErrorMessage(error.response?.data?.message);
			}
		}
	});

	const handleLoginRedirect = (e: React.FormEvent) => {
		e.preventDefault();
		navigate(ROUTES.Login);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setErrorMessage(t('signUp.passwordMismatch'));
			return;
		}
		mutate({ data: { email, password } });
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-green-300 p-4">
			<form onSubmit={handleSubmit} className="w-full max-w-md">
				<Card className="mx-auto w-full max-w-md">
					<CardHeader>
						<CardTitle>{t('signUp.title')}</CardTitle>
						<CardDescription>{t('signUp.description')}</CardDescription>
						<CardAction>
							<Button variant="link" onClick={handleLoginRedirect}>
								{t('signUp.alreadyHaveAccount')}
							</Button>
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Paragraph htmlFor="email">{t('common.email')}</Paragraph>
								<Input
									id="email"
									type="email"
									onChange={e => setEmail(e.target.value)}
									placeholder={t('common.emailPlaceholder')}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Paragraph htmlFor="password">{t('common.password')}</Paragraph>
								<Input
									id="password"
									type="password"
									onChange={e => setPassword(e.target.value)}
									placeholder={t('common.passwordPlaceholder')}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Paragraph htmlFor="confirmPassword">
									{t('signUp.confirmPassword')}
								</Paragraph>
								<Input
									id="confirmPassword"
									type="password"
									placeholder={t('common.passwordPlaceholder')}
									onChange={e => setConfirmPassword(e.target.value)}
									required
								/>
								{password !== confirmPassword && confirmPassword.length > 0 && (
									<Paragraph type="error">{errorMessage}</Paragraph>
								)}
								{isError && (
									<Paragraph type="error">
										{errorMessage || t('signUp.signUpFailed')}
									</Paragraph>
								)}
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex-col gap-2">
						<Button type="submit" className="w-full">
							{isPending ? <Spinner /> : t('signUp.submitButton')}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</div>
	);
};

export default SignUp;
