'use client';

import React, { useState } from 'react';
import type { WebsiteContent } from '../../types';
import type { PublicPage } from '../../views/PublicWebsite';
import { DashboardIcon } from '../icons';

interface PublicHeaderProps {
    content: WebsiteContent;
    currentPage: PublicPage;
    setCurrentPage: (page: PublicPage) => void;
    isPreview?: boolean;
    setIsViewingWebsite?: (viewing: boolean) => void;
    onShowLogin?: () => void;
}

const NavLink: React.FC<{ label: PublicPage; currentPage: PublicPage; setCurrentPage: (page: PublicPage) => void; themeColor: string }> = ({ label, currentPage, setCurrentPage, themeColor }) => {
    const isActive = currentPage === label;
    return (
        <button onClick={() => setCurrentPage(label)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`} style={isActive ? { backgroundColor: themeColor } : {}}>
            {label}
        </button>
    );
};

const PublicHeader: React.FC<PublicHeaderProps> = ({ content, currentPage, setCurrentPage, isPreview, setIsViewingWebsite, onShowLogin }) => {
    const navItems: PublicPage[] = ['Home', 'About', 'Gallery', 'Notices', 'Contact'];
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
            {content.topBar?.showTopBar && (
                <div className="bg-gray-900 text-white text-xs">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center sm:justify-between items-center h-auto sm:h-9 py-1.5">
                        <div className="flex items-center gap-6">
                            {content.topBar.phone && (
                                <a href={`tel:${content.topBar.phone}`} className="flex items-center hover:text-blue-300 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    <span>{content.topBar.phone}</span>
                                </a>
                            )}
                            {content.topBar.email && (
                                <a href={`mailto:${content.topBar.email}`} className="flex items-center hover:text-blue-300 transition-colors hidden sm:flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    <span>{content.topBar.email}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isPreview && setIsViewingWebsite && (
                <div className="bg-yellow-400 text-center py-2 text-sm font-semibold text-yellow-900">
                    You are in Preview Mode.
                    <button onClick={() => setIsViewingWebsite(false)} className="mr-2 underline font-bold">Return to Dashboard</button>
                </div>
            )}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-3">
                        <img className="h-10 w-auto" src={content.logoUrl} alt="School Logo" />
                        <span className="text-xl font-bold text-gray-800">{content.schoolName}</span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-2">
                        {navItems.map(item => (
                            <NavLink key={item} label={item} currentPage={currentPage} setCurrentPage={setCurrentPage} themeColor={content.themeColor} />
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-3">
                        {!isPreview ? (
                            <button onClick={onShowLogin} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 shadow-sm" style={{ backgroundColor: content.themeColor }}>
                                Admin Login
                            </button>
                        ) : (
                            setIsViewingWebsite && (
                                <button onClick={() => setIsViewingWebsite(false)} className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm">
                                    <DashboardIcon className="w-4 h-4 ml-2" />
                                    Dashboard
                                </button>
                            )
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden pb-4 border-t border-gray-100 pt-4">
                        <nav className="flex flex-col gap-2">
                            {navItems.map(item => (
                                <button key={item} onClick={() => { setCurrentPage(item); setMobileOpen(false); }} className={`px-4 py-3 rounded-xl text-sm font-medium text-right transition-all ${currentPage === item ? 'text-white' : 'text-gray-600 hover:bg-gray-100'}`} style={currentPage === item ? { backgroundColor: content.themeColor } : {}}>
                                    {item}
                                </button>
                            ))}
                            <hr className="my-2 border-gray-100" />
                            {!isPreview ? (
                                <button onClick={onShowLogin} className="px-4 py-3 rounded-xl text-sm font-medium text-white text-right transition-all" style={{ backgroundColor: content.themeColor }}>Admin Login</button>
                            ) : (
                                setIsViewingWebsite && <button onClick={() => setIsViewingWebsite(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-white bg-blue-600 text-right">Dashboard</button>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default PublicHeader;
