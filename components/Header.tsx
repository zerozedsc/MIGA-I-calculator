import React from 'react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  toggleLanguage: () => void;
  t: any;
}

const Header: React.FC<HeaderProps> = ({ language, toggleLanguage, t }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             {/* Logo Placeholder - Using a generic gold icon */}
            <div className="bg-maybank-yellow p-2 rounded-lg text-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {t.title}
              </h1>
              <p className="text-sm text-gray-500">
                {t.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <span className={language === 'ms' ? 'font-bold text-gray-900' : 'text-gray-500'}>BM</span>
              <span className="text-gray-300">|</span>
              <span className={language === 'en' ? 'font-bold text-gray-900' : 'text-gray-500'}>EN</span>
            </button>
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-maybank-yellow text-black bg-opacity-50">
              {t.unofficial}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;