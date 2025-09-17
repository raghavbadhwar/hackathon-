import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Photoshoot } from './components/Photoshoot';
import { ListingCreator } from './components/ListingCreator';
import { BuyerCopilot } from './components/BuyerCopilot';
import { StorePreview } from './components/StorePreview';
import { Login } from './components/Login';
import { Onboarding } from './components/Onboarding';
import type { ProductListing, GeminiResponse, PhotoshootMode, ImageQuality } from './types';

type View = 'photoshoot' | 'listing' | 'copilot' | 'store';

interface OriginalImage {
  file: File;
  preview: string;
  base64: string;
  mimeType: string;
}

const ONBOARDING_KEY = 'kalamitra_onboarding_complete';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [view, setView] = useState<View>('photoshoot');
  const [productListing, setProductListing] = useState<ProductListing | null>(null);
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeminiResponse | null>(null);

  // Lifted state for Photoshoot form to preserve settings across tabs
  const [photoshootMode, setPhotoshootMode] = useState<PhotoshootMode>('lifestyle');
  const [photoshootConsent, setPhotoshootConsent] = useState<boolean>(false);
  const [imageQuality, setImageQuality] = useState<ImageQuality>('fast');

  const handleLogin = () => {
    setIsLoggedIn(true);
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  };

  const handleFinishOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem(ONBOARDING_KEY, 'true');
  };

  const handleListingGenerated = (listing: ProductListing) => {
    setProductListing(listing);
    // Automatically switch to the listing result view, assuming that's what ListingCreator shows
  };
  
  const handleImageGenerated = (image: GeminiResponse) => {
    setGeneratedImage(image);
  };

  const handleImageUploaded = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      const base64 = preview.split(',')[1];
      setOriginalImage({
        file,
        preview,
        base64,
        mimeType: file.type
      });
      setGeneratedImage(null); // Clear previous AI image when new original is uploaded
      setProductListing(null); // Clear previous listing
    };
    reader.readAsDataURL(file);
  };

  const enrichedProductListing: ProductListing | null = productListing ? {
    ...productListing,
    originalImagePreview: originalImage?.preview || null,
    generatedImage
  } : null;

  const isFlowActive = !!productListing;

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F4E8] text-[#0E5A6A] flex flex-col">
      {showOnboarding && <Onboarding onFinish={handleFinishOnboarding} />}
      
      <Header 
        currentView={view} 
        onViewChange={setView}
        isCopilotDisabled={!isFlowActive}
        isStoreDisabled={!isFlowActive}
      />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-8">
        {view === 'photoshoot' && (
          <Photoshoot 
            onImageGenerated={handleImageGenerated} 
            onImageUploaded={handleImageUploaded}
            originalImage={originalImage}
            generatedImage={generatedImage}
            mode={photoshootMode}
            onModeChange={setPhotoshootMode}
            consent={photoshootConsent}
            onConsentChange={setPhotoshootConsent}
            quality={imageQuality}
            onQualityChange={setImageQuality}
          />
        )}
        {view === 'listing' && (
          <ListingCreator 
            onListingGenerated={handleListingGenerated} 
            originalImage={originalImage}
          />
        )}
        {view === 'copilot' && <BuyerCopilot productListing={enrichedProductListing} />}
        {view === 'store' && <StorePreview productListing={enrichedProductListing} />}
      </main>
      <Footer />
    </div>
  );
};

export default App;