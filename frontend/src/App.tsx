import { ROUTES } from '@/shared/constants';
import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './shared/components/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={ROUTES.Home} element={<Home />} />
				<Route path={ROUTES.Login} element={<Login />} />
				<Route path={ROUTES.SignUp} element={<SignUp />} />
				<Route path={ROUTES.ForgotPassword} element={<ForgotPassword />} />
				<Route
					path={ROUTES.Dashboard}
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<Navigate to={ROUTES.Login} replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
