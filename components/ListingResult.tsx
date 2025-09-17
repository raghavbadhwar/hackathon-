import React, { useState } from 'react';
import type { ProductListing } from '../types';
import { PriceBadge } from './PriceBadge';
import { ProvenanceCard } from './ProvenanceCard';
import { publishToInstagram, publishToONDC } from '../services/socialService';
import { logEvent } from '../services/analyticsService';

interface ListingResultProps {
  listing: ProductListing;
}

const Card: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h3 className="text-xl font-bold text-[#0E5A6A] border-b-2 border-[#EA580C]/20 pb-2 mb-4">{title}</h3>
        {children}
    </div>
);

export const ListingResult: React.FC<ListingResultProps> = ({ listing }) => {
  const [isPublishingInsta, setIsPublishingInsta] = useState(false);
  const [instaPublishStatus, setInstaPublishStatus] = useState<{success: boolean, message: string} | null>(null);
  const [isPublishingONDC, setIsPublishingONDC] = useState(false);
  const [ondcPublishStatus, setOndcPublishStatus] = useState<{success: boolean, message: string} | null>(null);

  const handlePublishToInstagram = async () => {
    setIsPublishingInsta(true);
    setInstaPublishStatus(null);
    try {
      const result = await publishToInstagram(listing);
      setInstaPublishStatus({ success: result.success, message: result.message });
      if (result.success) {
        logEvent('insta_published', {
          productId: listing.title,
          material: listing.attributes.material,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during publishing.";
      setInstaPublishStatus({ success: false, message: errorMessage });
    } finally {
      setIsPublishingInsta(false);
    }
  };

  const handleShareToWhatsApp = () => {
    // Using a placeholder URL as requested
    const productUrl = `https://kalamitra.store/p/mock-${listing.title.toLowerCase().replace(/\s+/g, '-')}`;
    const message = `Check out this amazing product: ${listing.title}\n\n${productUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePublishToONDC = async () => {
    setIsPublishingONDC(true);
    setOndcPublishStatus(null);
    try {
      const result = await publishToONDC(listing);
      setOndcPublishStatus({ success: result.success, message: result.message });
      if (result.success) {
        logEvent('ondc_published', {
          productId: listing.title,
          material: listing.attributes.material,
          price: listing.pricing?.aiSuggested,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during ONDC publishing.";
      setOndcPublishStatus({ success: false, message: errorMessage });
    } finally {
      setIsPublishingONDC(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center bg-white p-6 rounded-2xl shadow-lg border">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0E5A6A]">{listing.title}</h2>
      </div>

      {listing.pricing && <PriceBadge pricing={listing.pricing} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Product Details">
            <ul className="space-y-3 text-slate-700">
                <li><strong>Material:</strong> {listing.attributes.material}</li>
                <li><strong>Dimensions:</strong> {listing.attributes.dimensions}</li>
                <li><strong>Time to Make:</strong> Approx. {listing.attributes.timeToMakeHrs} hours</li>
                <li><strong>Style:</strong> {listing.attributes.style}</li>
            </ul>
        </Card>
        
        <Card title="Care Instructions">
            <ul className="space-y-2 list-disc list-inside text-slate-700">
                {listing.care.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        </Card>
      </div>

      <Card title="Description">
        <p className="text-slate-700 leading-relaxed">{listing.description}</p>
      </Card>

      <Card title="Key Features (SEO Bullets)">
        <ul className="space-y-2 list-disc list-inside text-slate-700">
            {listing.seoBullets.map((bullet, index) => <li key={index}>{bullet}</li>)}
        </ul>
      </Card>

      <ProvenanceCard story={listing.story} />

      <Card title="Publish Channels">
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049 1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm6.406-11.845a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-slate-700">Instagram Shop</span>
                </div>
                <button
                    onClick={handlePublishToInstagram}
                    disabled={isPublishingInsta}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-slate-400 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center w-full sm:w-auto sm:min-w-[140px]"
                >
                    {isPublishingInsta ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Publishing...</span>
                        </>
                    ) : (
                        'Publish'
                    )}
                </button>
            </div>
            {instaPublishStatus && (
                <div className={`p-3 rounded-md text-sm text-center ${instaPublishStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {instaPublishStatus.message}
                </div>
            )}
            
            <hr className="border-slate-200" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871-.118.571-.355 1.639-1.879 1.875-2.525.237-.648.237-1.195.162-1.319z"/>
                    </svg>
                    <span className="font-semibold text-slate-700">WhatsApp</span>
                </div>
                <button
                    onClick={handleShareToWhatsApp}
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 flex items-center justify-center w-full sm:w-auto sm:min-w-[140px]"
                >
                    Share
                </button>
            </div>
            
            <hr className="border-slate-200" />
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0v-4m0 4h5m0 0v-4m0 4h5m0 0v-4m0 4h5M9 7h6m-6 4h6m-6 4h6"></path>
                    </svg>
                    <span className="font-semibold text-slate-700">ONDC Network</span>
                </div>
                <button
                    onClick={handlePublishToONDC}
                    disabled={isPublishingONDC}
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center w-full sm:w-auto sm:min-w-[140px]"
                >
                    {isPublishingONDC ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Publishing...</span>
                        </>
                    ) : (
                        'Publish'
                    )}
                </button>
            </div>
             {ondcPublishStatus && (
                <div className={`p-3 rounded-md text-sm text-center ${ondcPublishStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {ondcPublishStatus.message}
                </div>
            )}

        </div>
      </Card>


      {/* Add fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};