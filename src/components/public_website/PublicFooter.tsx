import React from 'react';
import type { WebsiteContent } from '../../types';

interface PublicFooterProps {
    content: WebsiteContent;
}

const PublicFooter: React.FC<PublicFooterProps> = ({ content }) => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-lg font-semibold">{content.schoolName}</h3>
                        <p className="mt-2 text-gray-400">{content.contact.address}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Contact Us</h3>
                        <p className="mt-2 text-gray-400">Phone: {content.contact.phone}</p>
                        <p className="text-gray-400">Email: {content.contact.email}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <ul className="mt-2 space-y-1 text-gray-400">
                            <li><a href="#" className="hover:text-white">Home</a></li>
                            <li><a href="#" className="hover:text-white">About Us</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} {content.schoolName}. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
