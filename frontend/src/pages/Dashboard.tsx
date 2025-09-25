import { Heading } from '@/shared/components/Heading';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { useNavigate } from 'react-router-dom';

import { useGetApiMe, usePostApiAuthLogout } from '../shared/api/client';

const Dashboard = () => {
	const navigate = useNavigate();
	const { data, isLoading, isError } = useGetApiMe();
	const { mutate } = usePostApiAuthLogout({
		mutation: {
			onSuccess: () => {
				navigate('/login');
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

	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Failed to load user</p>;

	return (
		<div style={{ padding: '2rem' }}>
			<Heading size="h1">Dashboard</Heading>
			<Label>Welcome, {data?.email}</Label>
			<Button onClick={handleLogout}>Logout</Button>
		</div>
	);
};

export default Dashboard;
