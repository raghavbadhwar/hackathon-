import React, { useState, useCallback } from 'react';
import { ImageUploader } from './ImageUploader';
import { AIEditor } from './AIEditor';
import { ResultDisplay } from './ResultDisplay';
import { editImageWithGemini } from '../services/geminiService';
import type { GeminiResponse, PhotoshootMode, ImageQuality } from '../types';

interface OriginalImage {
  file: File;
  preview: string;
  base64: string;
  mimeType: string;
}

interface PhotoshootProps {
  onImageGenerated: (image: GeminiResponse) => void;
  onImageUploaded: (file: File) => void;
  originalImage: OriginalImage | null;
  generatedImage: GeminiResponse | null;
  mode: PhotoshootMode;
  onModeChange: (mode: PhotoshootMode) => void;
  consent: boolean;
  onConsentChange: (consent: boolean) => void;
  quality: ImageQuality;
  onQualityChange: (quality: ImageQuality) => void;
}

export const Photoshoot: React.FC<PhotoshootProps> = ({ 
  onImageGenerated, 
  onImageUploaded, 
  originalImage, 
  generatedImage,
  mode,
  onModeChange,
  consent,
  onConsentChange,
  quality,
  onQualityChange
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    onImageUploaded(file);
    setError(null);
    setUploadError(null);
  };
  
  const handleValidationError = (message: string) => {
    setUploadError(message);
  }

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!originalImage || !consent) {
      setError(consent ? "Please upload an image first." : "Please provide consent to use AI image generation.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const { base64, mimeType } = originalImage;
      const result = await editImageWithGemini(base64, mimeType, prompt, mode, quality);
      onImageGenerated(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred during generation.");
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, consent, mode, quality, onImageGenerated]);

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0E5A6A]">AI Photoshoot Studio</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Transform your product photos into stunning lifestyle scenes. Upload a photo, choose a mode, and describe your vision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-semibold text-[#0E5A6A] mb-4 border-b pb-2">Step 1: Upload Your Photo</h2>
          <ImageUploader 
            onImageUpload={handleImageUpload} 
            preview={originalImage?.preview || null} 
            onValidationError={handleValidationError}
          />
          {uploadError && (
            <div className="mt-4 text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <span className="block sm:inline">{uploadError}</span>
            </div>
          )}
        </div>
        <div className={`bg-white p-6 rounded-2xl shadow-lg border border-slate-200 transition-opacity duration-500 ${originalImage ? 'opacity-100' : 'opacity-50'}`}>
          <h2 className="text-2xl font-semibold text-[#0E5A6A] mb-4 border-b pb-2">Step 2: Describe Your Scene</h2>
          <AIEditor 
            onGenerate={handleGenerate} 
            isLoading={isLoading} 
            isDisabled={!originalImage}
            consent={consent}
            onConsentChange={onConsentChange}
            mode={mode}
            onModeChange={onModeChange}
            quality={quality}
            onQualityChange={onQualityChange}
          />
        </div>
      </div>
      
      {error && (
          <div className="mt-8 text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Oops! </strong>
              <span className="block sm:inline">{error}</span>
          </div>
      )}

      {isLoading && (
        <div className="mt-8 text-center">
           <div className="inline-flex items-center bg-white p-4 rounded-lg shadow-md">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-[#EA580C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-semibold text-slate-700">AI is creating your masterpiece... Please wait.</span>
            </div>
        </div>
      )}

      {generatedImage && (
        <div className="mt-12">
          <ResultDisplay 
            originalImage={originalImage?.preview || null} 
            generatedImage={generatedImage} 
          />
        </div>
      )}
    </>
  );
};