import React, { useState } from 'react';
import { generateListing } from '../services/geminiService';
import type { ProductListing } from '../types';
import { ListingResult } from './ListingResult';

interface OriginalImage {
    preview: string;
    base64: string;
    mimeType: string;
}

interface ListingCreatorProps {
    onListingGenerated: (listing: ProductListing) => void;
    originalImage: OriginalImage | null;
}

const TRANSCRIPTION_MAX_LENGTH = 2000;
const NOTES_MAX_LENGTH = 500;

export const ListingCreator: React.FC<ListingCreatorProps> = ({ onListingGenerated, originalImage }) => {
    const [transcription, setTranscription] = useState('');
    const [notes, setNotes] = useState('');
    const [language, setLanguage] = useState('English');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [listing, setListing] = useState<ProductListing | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!originalImage) {
            setError("Please upload an image in the 'AI Photoshoot' tab first.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setListing(null);

        try {
            const imagePayload = { data: originalImage.base64, mimeType: originalImage.mimeType };
            const result = await generateListing(imagePayload, transcription, notes, language);
            setListing(result);
            onListingGenerated(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!originalImage) {
        return (
             <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-[#0E5A6A] mb-4">Start with an Image</h2>
                <p className="mt-4 text-slate-600 text-lg">
                Please go to the <strong className="text-[#EA580C]">AI Photoshoot</strong> tab to upload a product image. The listing will be generated based on that image.
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-[#0E5A6A]">AI Listing Creator</h1>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
                   The AI will analyze your product image below. Add optional voice notes to provide more context.
                </p>
            </div>

            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 space-y-6">
                    <div>
                        <label className="block text-lg font-semibold text-[#0E5A6A] mb-2">
                           Product Image
                        </label>
                        <div className="w-32 h-32 rounded-lg border-2 border-slate-200 p-1 overflow-hidden">
                           <img src={originalImage.preview} alt="Product" className="w-full h-full object-cover rounded-md" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="transcription" className="block text-lg font-semibold text-[#0E5A6A] mb-2">
                            Voice Note Transcription (Optional)
                        </label>
                        <textarea
                            id="transcription"
                            value={transcription}
                            onChange={(e) => setTranscription(e.target.value)}
                            placeholder="e.g., 'This was made by my grandmother, reviving a lost weaving technique from our village. The motifs represent a bountiful harvest...'"
                            className="w-full h-32 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] transition shadow-sm"
                            maxLength={TRANSCRIPTION_MAX_LENGTH}
                        />
                         <div className="text-sm text-slate-500 mt-1">
                            <span>Provide context that isn't visible in the image, like the story or materials.</span>
                            <span className="float-right">{transcription.length} / {TRANSCRIPTION_MAX_LENGTH}</span>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="notes" className="block text-lg font-semibold text-[#0E5A6A] mb-2">
                            Optional Notes
                        </label>
                        <input
                            type="text"
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g., 'Mention it is for indoor use only.'"
                            className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] transition shadow-sm"
                            maxLength={NOTES_MAX_LENGTH}
                        />
                        <p className="text-right text-sm text-slate-500 mt-1">
                            {notes.length} / {NOTES_MAX_LENGTH}
                        </p>
                    </div>

                    <div>
                        <label htmlFor="language" className="block text-lg font-semibold text-[#0E5A6A] mb-2">
                            Output Language
                        </label>
                        <select 
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] transition shadow-sm bg-white"
                        >
                            <option>English</option>
                            <option>Hindi</option>
                            <option>Bengali</option>
                            <option>Tamil</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !originalImage}
                        className="w-full bg-[#EA580C] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#c2410c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EA580C] disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center text-lg"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating Listing...
                            </>
                        ) : (
                            '📝 Generate Listing from Image'
                        )}
                    </button>
                </form>
            </div>

            {error && (
                <div className="mt-8 max-w-3xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {listing && (
                <div className="mt-12">
                    <ListingResult listing={listing} />
                </div>
            )}
        </>
    );
};