import React from 'react';
import type { WebsiteContent } from '../../types';

interface AboutPageProps {
    content: WebsiteContent['about'];
}

const milestones = [
  { year: '1985', label: 'Founded' },
  { year: '1995', label: 'Secondary Level' },
  { year: '2005', label: 'Science Lab' },
  { year: '2015', label: 'Digital Classroom' },
  { year: '2024', label: 'Smart Campus' },
];

const AboutPage: React.FC<AboutPageProps> = ({ content }) => {
    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold">{content.title}</h1>
                    <p className="mt-4 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">Discover our journey of excellence in education since 1985</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">{content.content}</p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                            <div className="text-4xl mb-4">🎯</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                            <p className="text-gray-600 leading-relaxed">To provide quality education that fosters intellectual and personal growth, equipping students with the skills and values necessary to succeed in a rapidly changing world.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                            <div className="text-4xl mb-4">👁️</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed">To be a leading educational institution that nurtures innovative thinkers, creative problem solvers, and inspired learners prepared to thrive in the twenty-first century.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-16">
                        <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Our Journey</span>
                        <h2 className="mt-3 text-3xl md:text-5xl font-bold text-gray-900">School Milestones</h2>
                        <div className="mt-4 w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                    </div>
                    <div className="relative">
                        <div className="absolute right-1/2 top-0 bottom-0 w-1 bg-blue-200 hidden md:block"></div>
                        <div className="space-y-12">
                            {milestones.map((m, i) => (
                                <div key={i} className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                    <div className={`flex-1 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 inline-block">
                                            <span className="text-3xl font-bold text-blue-600">{m.year}</span>
                                            <p className="text-gray-600 mt-1">{m.label}</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex w-8 h-8 rounded-full bg-blue-600 border-4 border-blue-200 z-10 shrink-0"></div>
                                    <div className="flex-1"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
