import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { Hamburger } from '@/shared/components/Hamburger';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import Logo from '@/shared/components/Logo';

import { useToken } from '@/shared/hooks/useToken';

import { ROUTES } from '@/shared/constants';

function Navigation() {
	const { t } = useTranslation();
	const { token } = useToken();
	const [isOpen, setIsOpen] = useState(false);

	const linkClasses = ({ isActive }: { isActive: boolean }) =>
		`block px-3 py-2 rounded-md text-base font-medium transition-colors 
	${isActive ? 'text-blue-400 font-semibold ' : 'text-white hover:text-blue-400'}`;

	const mainLinks: { to: string; label: string }[] = [
		{ to: ROUTES.Skills, label: t('common.skills') },
		{ to: ROUTES.Projects, label: t('common.projects') },
		{ to: ROUTES.About, label: t('common.about') },
		{ to: ROUTES.Contact, label: t('common.contact') }
	];

	const authLinks: { to: string; label: string }[] = [];

	if (token) {
		mainLinks.push({ to: ROUTES.Dashboard, label: t('common.dashboard') });
	} else {
		authLinks.push({ to: ROUTES.Login, label: t('common.login') });
	}
	const renderLinks = (links: { to: string; label: string }[]) =>
		links.map(({ to, label }) => (
			<NavLink key={to} to={to} className={linkClasses}>
				<span className="font-bold">{label}</span>
			</NavLink>
		));

	return (
		<nav className="bg-gray-900 shadow-md">
			<div className="flex h-28 items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo / Brand */}
				<Logo />

				{/* Desktop Menu */}
				<div className="hidden space-x-6 md:flex">{renderLinks(mainLinks)}</div>

				{/* Auth Links (Desktop) */}
				<div className="hidden items-center space-x-4 md:flex">
					<LanguageSwitcher defaultLanguage={'en'} />
					{renderLinks(authLinks)}
				</div>

				{/* Mobile Menu Button */}
				<Hamburger isOpen={isOpen} setIsOpen={setIsOpen} />
			</div>

			{/* Mobile Menu */}
			{isOpen && (
				<div className="space-y-1 bg-gray-800 px-2 pt-2 pb-3 md:hidden">
					{renderLinks([...mainLinks, ...authLinks])}
				</div>
			)}
		</nav>
	);
}

export default Navigation;
