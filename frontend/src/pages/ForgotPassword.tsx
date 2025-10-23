import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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

import { usePostApiAuthForgotPassword } from '@/shared/api/client';

const ForgotPassword = () => {
	const { t } = useTranslation('translation');
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { mutate: sendForgotPasswordEmail, isPending } =
		usePostApiAuthForgotPassword();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		sendForgotPasswordEmail(
			{ data: { email } },
			{
				onSuccess: () => {
					toast.success(t('forgotPassword.emailSent'));
					setErrorMessage(null);
					navigate(ROUTES.Login);
				},
				onError: () => {
					setErrorMessage(t('forgotPassword.errorResponse'));
					toast.error(t('forgotPassword.errorResponse'));
				}
			}
		);
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-green-300 p-4">
			<form onSubmit={handleSubmit} className="w-full max-w-md">
				<Card className="mx-auto w-full max-w-md">
					<CardHeader>
						<CardTitle>{t('forgotPassword.title')}</CardTitle>
						<CardDescription>{t('forgotPassword.description')}</CardDescription>
						<CardAction>
							<Button variant="link" onClick={() => navigate(ROUTES.Login)}>
								{t('forgotPassword.backToLogin')}
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
									placeholder={t('common.emailPlaceholder')}
									value={email}
									onChange={e => setEmail(e.target.value)}
									required
								/>
								{errorMessage && (
									<Paragraph type="error">{errorMessage}</Paragraph>
								)}
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex-col gap-2">
						<Button type="submit" className="w-full" disabled={isPending}>
							{isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								t('forgotPassword.submitButton')
							)}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</div>
	);
};

export default ForgotPassword;
