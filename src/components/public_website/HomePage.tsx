import React from 'react';
import type { WebsiteContent } from '../../types';

interface HomePageProps {
    content: WebsiteContent['home'];
}

const stats = [
  { label: 'Students', value: '500+', icon: '🎓' },
  { label: 'Teachers', value: '40+', icon: '👨‍🏫' },
  { label: 'Years Established', value: '35+', icon: '📅' },
  { label: 'Awards Won', value: '25+', icon: '🏆' },
];

const features = [
  {
    title: 'Quality Education',
    description: 'Comprehensive curriculum focused on academic excellence and holistic development.',
    icon: '📚',
  },
  {
    title: 'Experienced Faculty',
    description: 'Dedicated teachers with years of experience in their respective fields.',
    icon: '👨‍🏫',
  },
  {
    title: 'Modern Facilities',
    description: 'Well-equipped labs, library, sports grounds, and digital classrooms.',
    icon: '🏛️',
  },
  {
    title: 'Extracurricular',
    description: 'Wide range of activities including sports, music, art, and clubs.',
    icon: '🎨',
  },
  {
    title: 'Safe Environment',
    description: 'Secure campus with CCTV surveillance and dedicated student support.',
    icon: '🛡️',
  },
  {
    title: 'Community Focus',
    description: 'Strong parent-teacher association and community engagement programs.',
    icon: '🤝',
  },
];

const HomePage: React.FC<HomePageProps> = ({ content }) => {
    return (
        <div>
            {/* Hero Section */}
            <section 
                className="relative bg-cover bg-center text-white overflow-hidden"
                style={{ backgroundImage: `url(${content.heroImageUrl})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48">
                    <div className="max-w-3xl">
                        <div className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-6">
                            Welcome to Excellence in Education
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                            {content.heroTitle}
                        </h1>
                        <p className="mt-6 text-lg md:text-2xl text-gray-200 max-w-2xl leading-relaxed">
                            {content.heroSubtitle}
                        </p>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <a href="#welcome" className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                                Learn More
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </a>
                            <a href="/login" className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition-all backdrop-blur-sm">
                                Portal Login
                            </a>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
            </section>

            {/* Stats Counter */}
            <section className="relative -mt-20 z-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center transform hover:-translate-y-1 transition-all duration-300">
                                <div className="text-4xl mb-3">{stat.icon}</div>
                                <div className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</div>
                                <div className="text-gray-500 mt-1 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Welcome Section */}
            <section id="welcome" className="py-24 md:py-32 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">About Our School</span>
                            <h2 className="mt-3 text-3xl md:text-5xl font-bold text-gray-900">{content.welcomeTitle}</h2>
                            <div className="mt-4 w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">{content.welcomeMessage}</p>
                            <div className="mt-8 flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">P</div>
                                <div>
                                    <p className="font-semibold text-gray-900">Principal's Message</p>
                                    <p className="text-sm text-gray-500">Shree Adarsha Secondary School</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features / Why Choose Us */}
            <section className="py-24 md:py-32 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Why Choose Us</span>
                        <h2 className="mt-3 text-3xl md:text-5xl font-bold text-gray-900">Our Key Features</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">We provide a nurturing environment that fosters academic excellence and personal growth.</p>
                        <div className="mt-4 w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <div key={i} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100 transform hover:-translate-y-1">
                                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                <div className="mt-6 w-10 h-1 bg-blue-600 rounded-full group-hover:w-20 transition-all duration-300"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold">Join Our School Community</h2>
                    <p className="mt-4 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">Enroll your child today and give them the gift of quality education.</p>
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <a href="/login" className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-blue-700 font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                            Get Started
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </a>
                        <a href="/contact" className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition-all">
                            Contact Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
