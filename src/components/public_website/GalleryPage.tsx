'use client';

import React, { useState } from 'react';
import type { Gallery } from '../../types';
import GalleryModal from './GalleryModal';

interface GalleryPageProps {
    galleries: Gallery[];
}

const GalleryPage: React.FC<GalleryPageProps> = ({ galleries }) => {
    const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const filters = ['All', ...galleries.map(g => g.title)];

    const filtered = activeFilter === 'All' ? galleries : galleries.filter(g => g.title === activeFilter);

    return (
        <div>
            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold">Photo Gallery</h1>
                    <p className="mt-4 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">A glimpse into our school life and events.</p>
                </div>
            </section>

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {galleries.length > 0 ? (
                        <>
                            {/* Filter */}
                            <div className="flex flex-wrap justify-center gap-3 mb-12">
                                {filters.map((f, i) => (
                                    <button key={i} onClick={() => setActiveFilter(f)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeFilter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'}`}>
                                        {f}
                                    </button>
                                ))}
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filtered.map(gallery => (
                                    <div key={gallery.id} className="group relative cursor-pointer" onClick={() => setSelectedGallery(gallery)}>
                                        <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-[4/3]">
                                            <img src={gallery.images[0]?.url || 'https://picsum.photos/800/600'} alt={gallery.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                                <h3 className="text-white text-xl font-bold">{gallery.title}</h3>
                                                <p className="text-gray-200 text-sm mt-1">{gallery.images.length} photos</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-6">📸</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Galleries Yet</h3>
                            <p className="text-gray-500">Photo galleries will appear here once they are added.</p>
                        </div>
                    )}
                </div>
            </section>

            {selectedGallery && (
                <GalleryModal gallery={selectedGallery} onClose={() => setSelectedGallery(null)} />
            )}
        </div>
    );
};

export default GalleryPage;
