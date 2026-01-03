import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-primary">GlobeTrotter</span>
                        </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">{t('dashboard')}</Link>
                                <Link to="/trips" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">{t('myTrips')}</Link>
                                <Link to="/create-trip" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">{t('createTrip')}</Link>
                                <div className="relative ml-3">
                                    <div className="flex items-center space-x-4">
                                        <Link to="/profile" className="flex items-center text-gray-700 hover:text-primary">
                                            {user.avatar ? (
                                                <img className="h-8 w-8 rounded-full" src={user.avatar} alt={user.name} />
                                            ) : (
                                                <UserCircleIcon className="h-8 w-8" />
                                            )}
                                            <span className="ml-2 text-sm font-medium">{user.name}</span>
                                        </Link>
                                        <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 text-sm font-medium">{t('logout')}</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Link to="/login" className="text-primary hover:text-blue-700 font-medium">{t('login')} / {t('register')}</Link>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">{t('dashboard')}</Link>
                                <Link to="/trips" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">{t('myTrips')}</Link>
                                <Link to="/create-trip" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">{t('createTrip')}</Link>
                                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">{t('profile')}</Link>
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-red-600 hover:bg-gray-50">{t('logout')}</button>
                            </>
                        ) : (
                            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">{t('login')}</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
