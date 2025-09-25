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
import { Label } from '@/shared/components/ui/label';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { usePostApiAuthLogin } from '../shared/api/client';

const Login = () => {
	const { t } = useTranslation('translation');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const { mutate, isPending, isError } = usePostApiAuthLogin({
		mutation: {
			onSuccess: data => {
				localStorage.setItem('accessToken', data.accessToken ?? '');
				localStorage.setItem('refreshToken', data.refreshToken ?? '');
				navigate('/dashboard');
			},
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onError: (error: any) => {
				alert(error.response?.data?.message || 'Login failed');
			}
		}
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutate({ data: { email, password } });
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-blue-300 p-4">
			<form onSubmit={handleSubmit} className="w-full max-w-md">
				<Card className="mx-auto w-full max-w-md">
					<CardHeader>
						<CardTitle>Login to your account</CardTitle>
						<CardDescription>
							Enter your email below to login to your account
						</CardDescription>
						<CardAction>
							<Button variant="link">Sign Up</Button>
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									onChange={e => setEmail(e.target.value)}
									placeholder="m@example.com"
									required
								/>
							</div>
							<div className="grid gap-2">
								<div className="flex items-center">
									<Label htmlFor="password">Password</Label>
									<a
										href="#"
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										Forgot your password?
									</a>
								</div>
								<Input
									id="password"
									type="password"
									onChange={e => setPassword(e.target.value)}
									required
								/>
								{isError && <p>{t('login.loginFailed')}</p>}
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex-col gap-2">
						<Button type="submit" className="w-full">
							{isPending ? t('login.loggingIn') : t('login.loginButton')}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</div>
	);
};

export default Login;
