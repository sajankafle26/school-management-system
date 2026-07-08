import React, { useState, useEffect } from 'react';
import type { WebsiteContent, Notice } from '../types';
import PublicHeader from '../components/public_website/PublicHeader';
import PublicFooter from '../components/public_website/PublicFooter';
import HomePage from '../components/public_website/HomePage';
import AboutPage from '../components/public_website/AboutPage';
import ContactPage from '../components/public_website/ContactPage';
import GalleryPage from '../components/public_website/GalleryPage';
import NoticesPage from '../components/public_website/NoticesPage';

interface PublicWebsiteProps {
    content: WebsiteContent;
    isPreview?: boolean;
    setIsViewingWebsite?: (viewing: boolean) => void;
    onShowLogin?: () => void;
}

export type PublicPage = 'Home' | 'About' | 'Gallery' | 'Notices' | 'Contact';

const PublicWebsite: React.FC<PublicWebsiteProps> = ({ content, isPreview = false, setIsViewingWebsite, onShowLogin }) => {
    const [currentPage, setCurrentPage] = useState<PublicPage>('Home');
    const [publicNotices, setPublicNotices] = useState<Notice[]>([]);

    useEffect(() => {
        fetch('/api/notices')
            .then(res => res.json())
            .then((data: Notice[]) => setPublicNotices(data.filter(n => n.targetClass === 'All' && n.targetSection === 'All')))
            .catch(console.error);
    }, []);

    const renderPage = () => {
        switch(currentPage) {
            case 'Home': return <HomePage content={content.home} />;
            case 'About': return <AboutPage content={content.about} />;
            case 'Gallery': return <GalleryPage galleries={content.galleries} />;
            case 'Notices': return <NoticesPage notices={publicNotices} />;
            case 'Contact': return <ContactPage content={content.contact} />;
            default: return <HomePage content={content.home} />;
        }
    };
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <PublicHeader
                content={content}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                isPreview={isPreview}
                setIsViewingWebsite={setIsViewingWebsite}
                onShowLogin={onShowLogin}
            />
            <main className="flex-grow">
                {renderPage()}
            </main>
            <PublicFooter content={content} />
        </div>
    );
};

export default PublicWebsite;
