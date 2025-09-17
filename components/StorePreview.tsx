import React from 'react';
import type { ProductListing } from '../types';
import { PhotoshootGallery } from './PhotoshootGallery';
import { ProvenanceCard } from './ProvenanceCard';
import { BuyerCopilot } from './BuyerCopilot';

interface StorePreviewProps {
    productListing: ProductListing | null;
}

const Card: React.FC<{title: string; children: React.ReactNode, className?: string}> = ({ title, children, className }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md border border-slate-200 ${className}`}>
        <h3 className="text-xl font-bold text-[#0E5A6A] border-b-2 border-[#EA580C]/20 pb-2 mb-4">{title}</h3>
        {children}
    </div>
);

export const StorePreview: React.FC<StorePreviewProps> = ({ productListing }) => {
    if (!productListing) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-[#0E5A6A]">Store Preview</h2>
                <p className="mt-4 text-slate-600">
                    Generate a product listing first to see a preview of its store page here.
                </p>
            </div>
        );
    }

    const { title, attributes, care, description, story, pricing, originalImagePreview, generatedImage } = productListing;

    return (
        <>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-[#0E5A6A]">Store Page Preview</h1>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
                    This is how your product will look to buyers. You can interact with the chat assistant to test it.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Images & Details */}
                <div className="lg:col-span-2 space-y-8">
                    <PhotoshootGallery originalImage={originalImagePreview || null} generatedImage={generatedImage || null} />
                     <Card title="Description">
                        <p className="text-slate-700 leading-relaxed">{description}</p>
                    </Card>
                    <ProvenanceCard story={story} />
                </div>

                {/* Right Column - Purchase & Chat */}
                <div className="space-y-8">
                    <div className="lg:sticky top-24 space-y-8">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                            <h2 className="text-3xl font-bold text-[#0E5A6A] mb-4">{title}</h2>
                            {pricing && (
                               <p className="text-3xl font-bold text-green-600 mb-6">{pricing.aiSuggested.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}</p>
                            )}
                             <ul className="space-y-3 text-slate-700 mb-6">
                                <li><strong>Material:</strong> {attributes.material}</li>
                                <li><strong>Dimensions:</strong> {attributes.dimensions}</li>
                            </ul>
                            <button className="w-full bg-[#EA580C] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#c2410c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EA580C] transition-colors">
                                Add to Cart
                            </button>
                        </div>

                        <Card title="Care Instructions">
                            <ul className="space-y-2 list-disc list-inside text-slate-700">
                                {care.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                        </Card>

                        <BuyerCopilot productListing={productListing} isWidget={true} />
                    </div>
                </div>
            </div>
        </>
    );
};