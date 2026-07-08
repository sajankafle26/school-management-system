import React from 'react';
import type { WebsiteContent } from '../../types';

interface ContactPageProps {
    content: WebsiteContent['contact'];
}

const ContactPage: React.FC<ContactPageProps> = ({ content }) => {
    return (
        <div className="bg-white py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800">Contact Us</h1>
                    <p className="mt-4 text-lg text-gray-600">We'd love to hear from you. Please feel free to reach out.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Location</h2>
                        <div className="space-y-3 text-gray-600">
                            <p><strong>Address:</strong> {content.address}</p>
                            <p><strong>Phone:</strong> {content.phone}</p>
                            <p><strong>Email:</strong> {content.email}</p>
                        </div>
                    </div>
                    <div>
                        <iframe
                            src={content.mapEmbedUrl}
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="rounded-lg shadow-md"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
