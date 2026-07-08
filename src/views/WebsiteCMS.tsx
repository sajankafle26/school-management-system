import React, { useState } from 'react';
import type { WebsiteContent, Gallery, GalleryImage } from '../types';
import { TrashIcon, UploadIcon } from '../components/icons';

interface WebsiteCMSProps {
    content: WebsiteContent;
    setContent: React.Dispatch<React.SetStateAction<WebsiteContent>>;
}

type CmsTab = 'General' | 'Home' | 'About' | 'Contact' | 'Gallery';

const WebsiteCMS: React.FC<WebsiteCMSProps> = ({ content, setContent }) => {
    const [activeTab, setActiveTab] = useState<CmsTab>('General');
    const [formData, setFormData] = useState<WebsiteContent>(JSON.parse(JSON.stringify(content))); // Deep copy

    const handleSave = async () => {
        try {
            const res = await fetch('/api/website-content', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Failed to save');
            const saved = await res.json();
            setContent(saved);
            setFormData(saved);
            alert('Website content updated successfully!');
        } catch (err) {
            alert('Failed to save website content. Please try again.');
        }
    };

    const handleInputChange = (section: keyof WebsiteContent, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] as object),
                [field]: value,
            },
        }));
    };
    
    const handleGalleryTitleChange = (galleryId: number, newTitle: string) => {
        setFormData(prev => ({
            ...prev,
            galleries: prev.galleries.map(g => g.id === galleryId ? { ...g, title: newTitle } : g)
        }));
    };

    const handleAddGallery = () => {
        const newGallery: Gallery = {
            id: Date.now(),
            title: 'New Album',
            images: [],
        };
        setFormData(prev => ({ ...prev, galleries: [...prev.galleries, newGallery] }));
    };

    const handleRemoveGallery = (galleryId: number) => {
        if (window.confirm('Are you sure you want to delete this gallery and all its images?')) {
            setFormData(prev => ({ ...prev, galleries: prev.galleries.filter(g => g.id !== galleryId) }));
        }
    };
    
    const handleAddImage = (galleryId: number) => {
        // In a real app, this would open a file dialog and upload the image.
        // Here we simulate it by adding a placeholder image.
        const newImage: GalleryImage = {
            id: Date.now(),
            url: `https://picsum.photos/seed/${Date.now()}/800/600`,
            caption: 'New Image',
        };
         setFormData(prev => ({
            ...prev,
            galleries: prev.galleries.map(g => g.id === galleryId ? { ...g, images: [...g.images, newImage] } : g)
        }));
    };

    const handleRemoveImage = (galleryId: number, imageId: number) => {
         setFormData(prev => ({
            ...prev,
            galleries: prev.galleries.map(g => g.id === galleryId ? { ...g, images: g.images.filter(img => img.id !== imageId) } : g)
        }));
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'General': return <GeneralSettingsTab formData={formData} setFormData={setFormData} />;
            case 'Home': return <HomePageTab formData={formData} handleInputChange={handleInputChange} />;
            case 'About': return <AboutPageTab formData={formData} handleInputChange={handleInputChange} />;
            case 'Contact': return <ContactPageTab formData={formData} handleInputChange={handleInputChange} />;
            case 'Gallery': return <GalleryTab galleries={formData.galleries} onAddGallery={handleAddGallery} onRemoveGallery={handleRemoveGallery} onAddImage={handleAddImage} onRemoveImage={handleRemoveImage} onTitleChange={handleGalleryTitleChange}/>;
        }
    }

    const tabs: {id: CmsTab, label: string}[] = [
        { id: 'General', label: 'General Settings' },
        { id: 'Home', label: 'Home Page' },
        { id: 'About', label: 'About Page' },
        { id: 'Contact', label: 'Contact Page' },
        { id: 'Gallery', label: 'Photo Gallery' },
    ];
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Website Content Management</h1>
                <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Save Changes
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${activeTab === tab.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >{tab.label}</button>
                        ))}
                    </nav>
                </div>
                <div>
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

// Sub-components for Tabs
const GeneralSettingsTab: React.FC<{formData: WebsiteContent, setFormData: React.Dispatch<React.SetStateAction<WebsiteContent>>}> = ({formData, setFormData}) => (
    <div className="space-y-4 max-w-lg">
        <div>
            <label className="block text-sm font-medium text-gray-700">School Name</label>
            <input type="text" value={formData.schoolName} onChange={e => setFormData(p => ({...p, schoolName: e.target.value}))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
         <div>
            <label className="block text-sm font-medium text-gray-700">School Logo</label>
            <div className="mt-2 flex items-center space-x-4">
                <img src={formData.logoUrl} alt="Logo Preview" className="w-16 h-16 rounded-full object-contain border p-1 bg-gray-50" />
                <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <span>Upload Logo</span>
                    <input type="file" className="sr-only" accept="image/*" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const previewUrl = URL.createObjectURL(file);
                            setFormData(p => ({...p, logoUrl: previewUrl}));
                        }
                    }} />
                </label>
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Theme Color</label>
            <input type="color" value={formData.themeColor} onChange={e => setFormData(p => ({...p, themeColor: e.target.value}))} className="mt-1 h-10 w-full p-1 border border-gray-300 rounded-md shadow-sm"/>
        </div>

        <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Top Bar Settings</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={formData.topBar?.showTopBar ?? false} 
                        onChange={e => setFormData(p => ({...p, topBar: {...(p.topBar || {showTopBar: false, phone:'', email:''}), showTopBar: e.target.checked}}))}
                        className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
            <div className={`mt-4 space-y-4 ${(formData.topBar?.showTopBar ?? false) ? '' : 'opacity-50 pointer-events-none'}`}>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Top Bar Phone Number</label>
                    <input 
                        type="text" 
                        value={formData.topBar?.phone ?? ''} 
                        onChange={e => setFormData(p => ({...p, topBar: {...(p.topBar || {showTopBar: false, phone:'', email:''}), phone: e.target.value}}))}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Top Bar Email</label>
                    <input 
                        type="email" 
                        value={formData.topBar?.email ?? ''} 
                        onChange={e => setFormData(p => ({...p, topBar: {...(p.topBar || {showTopBar: false, phone:'', email:''}), email: e.target.value}}))}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
            </div>
        </div>
    </div>
);

const HomePageTab: React.FC<{formData: WebsiteContent, handleInputChange: any}> = ({formData, handleInputChange}) => (
    <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700">Hero Title</label>
            <input type="text" value={formData.home.heroTitle} onChange={e => handleInputChange('home', 'heroTitle', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Hero Subtitle</label>
            <input type="text" value={formData.home.heroSubtitle} onChange={e => handleInputChange('home', 'heroSubtitle', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Hero Background Image URL</label>
            <input type="text" value={formData.home.heroImageUrl} onChange={e => handleInputChange('home', 'heroImageUrl', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Welcome Section Title</label>
            <input type="text" value={formData.home.welcomeTitle} onChange={e => handleInputChange('home', 'welcomeTitle', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Welcome Message</label>
            <textarea rows={5} value={formData.home.welcomeMessage} onChange={e => handleInputChange('home', 'welcomeMessage', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
    </div>
);

const AboutPageTab: React.FC<{formData: WebsiteContent, handleInputChange: any}> = ({formData, handleInputChange}) => (
    <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700">Page Title</label>
            <input type="text" value={formData.about.title} onChange={e => handleInputChange('about', 'title', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea rows={10} value={formData.about.content} onChange={e => handleInputChange('about', 'content', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
    </div>
);

const ContactPageTab: React.FC<{formData: WebsiteContent, handleInputChange: any}> = ({formData, handleInputChange}) => (
    <div className="space-y-4 max-w-lg">
        <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" value={formData.contact.address} onChange={e => handleInputChange('contact', 'address', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="text" value={formData.contact.phone} onChange={e => handleInputChange('contact', 'phone', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" value={formData.contact.email} onChange={e => handleInputChange('contact', 'email', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Google Maps Embed URL</label>
            <input type="text" value={formData.contact.mapEmbedUrl} onChange={e => handleInputChange('contact', 'mapEmbedUrl', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
    </div>
);

const GalleryTab: React.FC<{galleries: Gallery[], onAddGallery: ()=>void, onRemoveGallery: (id:number)=>void, onAddImage: (id:number)=>void, onRemoveImage: (gid:number, iid:number)=>void, onTitleChange: (id:number, title:string)=>void}> = ({galleries, onAddGallery, onRemoveGallery, onAddImage, onRemoveImage, onTitleChange}) => (
    <div>
        <div className="text-right mb-4">
            <button onClick={onAddGallery} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Add New Album</button>
        </div>
        <div className="space-y-6">
            {galleries.map(gallery => (
                <div key={gallery.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                         <input type="text" value={gallery.title} onChange={e => onTitleChange(gallery.id, e.target.value)} className="text-lg font-bold text-gray-800 p-2 border rounded-md w-1/2"/>
                         <button onClick={() => onRemoveGallery(gallery.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {gallery.images.map(image => (
                            <div key={image.id} className="relative group">
                                <img src={image.url} alt={image.caption} className="w-full h-24 object-cover rounded-md"/>
                                <button onClick={() => onRemoveImage(gallery.id, image.id)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                         <button onClick={() => onAddImage(gallery.id)} className="w-full h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100">
                             <UploadIcon className="w-6 h-6"/>
                             <span className="text-xs mt-1">Add Image</span>
                         </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default WebsiteCMS;