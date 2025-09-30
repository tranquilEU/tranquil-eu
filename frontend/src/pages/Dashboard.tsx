import { Heading } from '@/shared/components/Heading';
import { Paragraph } from '@/shared/components/Paragraph';
import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/shared/constants';
import { useNavigate } from 'react-router-dom';

import { useGetApiMe, usePostApiAuthLogout } from '../shared/api/client';

const Dashboard = () => {
	const navigate = useNavigate();
	const { data, isLoading, isError } = useGetApiMe();
	const { mutate } = usePostApiAuthLogout({
		mutation: {
			onSuccess: () => {
				navigate(ROUTES.Home);
			}
		}
	});

	const handleLogout = () => {
		mutate({
			data: {
				refreshToken: localStorage.getItem('refreshToken') ?? ''
			}
		});
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
	};

	if (isLoading) return <Paragraph>Loading...</Paragraph>;
	if (isError) return <Paragraph type="error">Failed to load user</Paragraph>;

	return (
		<div style={{ padding: '2rem' }}>
			<Heading size="h1">Dashboard</Heading>
			<Paragraph>Welcome, {data?.email}</Paragraph>
			<Button onClick={handleLogout}>Logout</Button>
		</div>
	);
};

export default Dashboard;
