import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
	children: React.ReactElement;
}

const ProtectedRoute = ({ children }: Props) => {
	const token = localStorage.getItem('accessToken');
	if (!token) {
		return <Navigate to="/login" replace />;
	}
	return children;
};

export default ProtectedRoute;
