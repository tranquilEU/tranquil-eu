import { Toaster } from '@/shared/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './shared/i18n/i18n';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<Suspense fallback="...is loading">
				<App />
				<Toaster />
			</Suspense>
		</QueryClientProvider>
	</React.StrictMode>
);
