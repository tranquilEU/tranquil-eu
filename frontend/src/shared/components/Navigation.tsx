import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { Hamburger } from '@/shared/components/Hamburger';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import Logo from '@/shared/components/Logo';

import { ROUTES } from '@/shared/constants';

function Navigation() {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);

	const linkClasses = ({ isActive }: { isActive: boolean }) =>
		`block px-3 py-2 rounded-md text-base font-medium transition-colors 
    ${isActive ? 'text-blue-400 font-semibold' : 'text-white hover:text-blue-400'}`;

	return (
		<nav className="bg-gray-900 shadow-md">
			{/* Removed mx-auto max-w-7xl to make logo flush left */}
			<div className="flex h-28 items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo / Brand */}
				<Logo />

				{/* Desktop Menu */}
				<div className="hidden space-x-6 md:flex">
					<NavLink to={ROUTES.Projects} className={linkClasses}>
						{t('common.projects')}
					</NavLink>
					<NavLink to={ROUTES.About} className={linkClasses}>
						{t('common.about')}
					</NavLink>
					<NavLink to={ROUTES.Contact} className={linkClasses}>
						{t('common.contact')}
					</NavLink>
					<NavLink to={ROUTES.Dashboard} className={linkClasses}>
						{t('common.dashboard')}
					</NavLink>
				</div>

				{/* Auth Links (Desktop) */}
				<div className="hidden items-center space-x-4 md:flex">
					<LanguageSwitcher />
					<NavLink to={ROUTES.Login} className={linkClasses}>
						{t('common.login')}
					</NavLink>
					<NavLink to={ROUTES.SignUp} className={linkClasses}>
						{t('common.signUp')}
					</NavLink>
				</div>

				{/* Mobile Menu Button */}
				<Hamburger isOpen={isOpen} setIsOpen={setIsOpen} />
			</div>

			{/* Mobile Menu */}
			{isOpen && (
				<div className="space-y-1 bg-gray-800 px-2 pt-2 pb-3 md:hidden">
					<NavLink to={ROUTES.Projects} className={linkClasses}>
						{t('common.projects')}
					</NavLink>
					<NavLink to={ROUTES.About} className={linkClasses}>
						{t('common.about')}
					</NavLink>
					<NavLink to={ROUTES.Contact} className={linkClasses}>
						{t('common.contact')}
					</NavLink>
					<NavLink to={ROUTES.Dashboard} className={linkClasses}>
						{t('common.dashboard')}
					</NavLink>
					<NavLink to={ROUTES.Login} className={linkClasses}>
						{t('common.login')}
					</NavLink>
					<NavLink to={ROUTES.SignUp} className={linkClasses}>
						{t('common.signUp')}
					</NavLink>
				</div>
			)}
		</nav>
	);
}

export default Navigation;
