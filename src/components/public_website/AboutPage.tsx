import React from 'react';
import type { WebsiteContent } from '../../types';

interface AboutPageProps {
    content: WebsiteContent['about'];
}

const AboutPage: React.FC<AboutPageProps> = ({ content }) => {
    return (
        <div className="bg-white py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">{content.title}</h1>
                <div className="prose lg:prose-xl mx-auto text-gray-700">
                    <p>{content.content}</p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
