import React from 'react';
import type { WebsiteContent } from '../../types';

interface HomePageProps {
    content: WebsiteContent['home'];
}

const HomePage: React.FC<HomePageProps> = ({ content }) => {
    return (
        <div>
            {/* Hero Section */}
            <section 
                className="relative bg-cover bg-center text-white py-32 md:py-48" 
                style={{ backgroundImage: `url(${content.heroImageUrl})` }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{content.heroTitle}</h1>
                    <p className="mt-4 text-lg md:text-2xl">{content.heroSubtitle}</p>
                </div>
            </section>

            {/* Welcome Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800">{content.welcomeTitle}</h2>
                        <p className="mt-6 text-lg text-gray-600 leading-relaxed">{content.welcomeMessage}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
