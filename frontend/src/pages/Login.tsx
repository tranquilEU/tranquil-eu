import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Paragraph } from '@/shared/components/Paragraph';
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

import { usePostApiAuthLogin } from '@/shared/api/client';

const Login = () => {
	const navigate = useNavigate();
	const { t } = useTranslation('translation');

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { mutate, isPending, isError } = usePostApiAuthLogin({
		mutation: {
			onSuccess: data => {
				localStorage.setItem('accessToken', data.accessToken ?? '');
				localStorage.setItem('refreshToken', data.refreshToken ?? '');
				navigate(ROUTES.Dashboard);
			},
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onError: (error: any) => {
				setErrorMessage(error.response?.data?.message || 'Login failed');
			}
		}
	});

	const handleSignUp = (e: React.FormEvent) => {
		e.preventDefault();
		navigate(ROUTES.SignUp);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutate({ data: { email, password } });
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-blue-300 p-4">
			<form onSubmit={handleSubmit} className="w-full max-w-md">
				<Card className="mx-auto w-full max-w-md">
					<CardHeader>
						<CardTitle>{t('login.title')}</CardTitle>
						<CardDescription>{t('login.description')}</CardDescription>
						<CardAction>
							<Button variant="link" onClick={handleSignUp}>
								{t('common.signUp')}
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
								<div className="flex items-center">
									<Paragraph htmlFor="password">
										{t('common.password')}
									</Paragraph>
									<Button
										variant="link"
										onClick={() => navigate(ROUTES.ForgotPassword)}
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										{t('login.forgotPassword')}
									</Button>
								</div>
								<Input
									id="password"
									type="password"
									onChange={e => setPassword(e.target.value)}
									required
								/>
								{isError && (
									<Paragraph type="error">
										{errorMessage || t('login.loginFailed')}
									</Paragraph>
								)}
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex-col gap-2">
						<Button type="submit" className="w-full">
							{isPending ? t('login.loggingIn') : t('login.submitButton')}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</div>
	);
};

export default Login;
