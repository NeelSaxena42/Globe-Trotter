import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-bold">GlobeTrotter</h3>
                        <p className="text-gray-400 text-sm mt-2">{t('footerDescription')}</p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-white">{t('aboutUs')}</a>
                        <a href="#" className="text-gray-400 hover:text-white">{t('privacyPolicy')}</a>
                        <a href="#" className="text-gray-400 hover:text-white">{t('termsOfService')}</a>
                        <a href="#" className="text-gray-400 hover:text-white">{t('contact')}</a>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} GlobeTrotter. {t('allRightsReserved')}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
