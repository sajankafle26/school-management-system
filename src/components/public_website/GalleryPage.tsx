import React, { useState } from 'react';
import type { Gallery } from '../../types';
import GalleryModal from './GalleryModal';

interface GalleryPageProps {
    galleries: Gallery[];
}

const GalleryPage: React.FC<GalleryPageProps> = ({ galleries }) => {
    const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);

    return (
        <div className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800">Photo Gallery</h1>
                    <p className="mt-4 text-lg text-gray-600">A glimpse into our school life and events.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {galleries.map(gallery => (
                        <div 
                            key={gallery.id} 
                            className="group relative cursor-pointer"
                            onClick={() => setSelectedGallery(gallery)}
                        >
                            <img 
                                src={gallery.images[0]?.url || 'https://picsum.photos/800/600'} 
                                alt={gallery.title} 
                                className="w-full h-64 object-cover rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h2 className="text-white text-2xl font-bold">{gallery.title}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedGallery && (
                <GalleryModal 
                    gallery={selectedGallery} 
                    onClose={() => setSelectedGallery(null)} 
                />
            )}
        </div>
    );
};

export default GalleryPage;
