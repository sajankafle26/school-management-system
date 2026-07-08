import React from 'react';
import type { Notice } from '../../types';

interface NoticesPageProps {
    notices: Notice[];
}

const NoticeCard: React.FC<{ notice: Notice }> = ({ notice }) => {
    const date = new Date(notice.date);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();

    return (
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 sm:w-28 flex sm:flex-col items-center justify-center gap-1 shrink-0">
                    <span className="text-3xl font-bold">{day}</span>
                    <span className="text-sm font-medium uppercase tracking-wider">{month}</span>
                    <span className="text-xs text-blue-200">{year}</span>
                </div>
                <div className="p-6 flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{notice.title}</h2>
                        <span className="shrink-0 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full whitespace-nowrap">{notice.author}</span>
                    </div>
                    <p className="mt-3 text-gray-600 leading-relaxed">{notice.content}</p>
                </div>
            </div>
        </div>
    );
};

const NoticesPage: React.FC<NoticesPageProps> = ({ notices }) => {
    const sortedNotices = [...notices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div>
            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold">School Notice Board</h1>
                    <p className="mt-4 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">Latest news, announcements, and updates from the school administration.</p>
                </div>
            </section>

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    {sortedNotices.length > 0 ? (
                        <div className="space-y-6">
                            {sortedNotices.map(notice => (
                                <NoticeCard key={notice.id} notice={notice} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-6">📋</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Notices Yet</h3>
                            <p className="text-gray-500">There are currently no public notices to display. Please check back later.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default NoticesPage;
