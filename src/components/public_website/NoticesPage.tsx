import React from 'react';
import type { Notice } from '../../types';

interface NoticesPageProps {
    notices: Notice[];
}

const NoticesPage: React.FC<NoticesPageProps> = ({ notices }) => {
    const sortedNotices = [...notices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="bg-white py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800">School Notice Board</h1>
                    <p className="mt-4 text-lg text-gray-600">Latest news, announcements, and updates from the school administration.</p>
                </div>

                <div className="space-y-8">
                    {sortedNotices.length > 0 ? (
                        sortedNotices.map(notice => (
                            <div key={notice.id} className="p-6 border rounded-lg shadow-lg bg-gray-50 border-l-4 border-yellow-500">
                                <h2 className="text-2xl font-bold text-gray-800">{notice.title}</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Posted on {new Date(notice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} by <span className="font-semibold">{notice.author}</span>
                                </p>
                                <p className="text-gray-700 mt-4 whitespace-pre-wrap">{notice.content}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-10 border-2 border-dashed rounded-lg">
                            <p className="text-gray-500">There are currently no public notices to display. Please check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoticesPage;
