import React, { useState } from 'react';
import type { PhotoshootMode, ImageQuality } from '../types';

interface AIEditorProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  isDisabled: boolean;
  consent: boolean;
  onConsentChange: (consent: boolean) => void;
  mode: PhotoshootMode;
  onModeChange: (mode: PhotoshootMode) => void;
  quality: ImageQuality;
  onQualityChange: (quality: ImageQuality) => void;
}

const modes: { value: PhotoshootMode; label: string; description: string; placeholder: string; requiresPrompt: boolean }[] = [
    { value: 'lifestyle', label: 'Lifestyle Scene', description: 'Place your product in a realistic setting.', placeholder: "Describe the scene, e.g., 'on a rustic wooden table with a cup of chai'.", requiresPrompt: true },
    { value: 'background_replace', label: 'Background Replace', description: 'Change the background of your product photo.', placeholder: "Describe the new background, e.g., 'a clean, white marble surface'.", requiresPrompt: true },
    { value: 'colorway', label: 'Colorway', description: 'Change the color of the product.', placeholder: "Describe the new color palette, e.g., 'change the pot from red to a deep blue'.", requiresPrompt: true },
    { value: 'scene_lighting', label: 'Adjust Lighting', description: 'Change the lighting of the scene.', placeholder: "Describe the lighting style, e.g., 'soft morning light' or 'golden hour'.", requiresPrompt: true },
    { value: 'pose_adjust', label: 'Minor Pose Adjust', description: 'Make a subtle change to product position.', placeholder: "Describe the minor adjustment, e.g., 'tilt the vase slightly to the right'.", requiresPrompt: true },
    { value: 'cleanup', label: 'Cleanup', description: 'Clean the background and remove blemishes.', placeholder: 'No details needed. The AI will automatically clean the image.', requiresPrompt: false },
];

const PROMPT_MAX_LENGTH = 1000;

export const AIEditor: React.FC<AIEditorProps> = ({ onGenerate, isLoading, isDisabled, consent, onConsentChange, mode, onModeChange, quality, onQualityChange }) => {
  const [prompt, setPrompt] = useState('');
  const selectedMode = modes.find(m => m.value === mode) ?? modes[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMode.requiresPrompt || prompt.trim()) {
      onGenerate(prompt);
    }
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onModeChange(e.target.value as PhotoshootMode);
    setPrompt(''); // Clear prompt when mode changes
  }

  return (
    <div className={`transition-opacity duration-500 ${isDisabled ? 'pointer-events-none' : ''}`}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="mode" className="block text-md font-medium text-[#0E5A6A] mb-2">
            Editing Mode
          </label>
          <select
            id="mode"
            value={mode}
            onChange={handleModeChange}
            className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] transition shadow-sm bg-white"
            disabled={isDisabled}
          >
            {modes.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <p className="text-sm text-slate-500 mt-1">{selectedMode.description}</p>
        </div>
        
        {selectedMode.requiresPrompt && (
          <div className="mb-4">
            <label htmlFor="prompt" className="block text-md font-medium text-[#0E5A6A] mb-2">
              Details
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={selectedMode.placeholder}
              className="w-full h-28 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] transition shadow-sm"
              disabled={isDisabled}
              maxLength={PROMPT_MAX_LENGTH}
            />
            <p className="text-right text-sm text-slate-500 mt-1">
                {prompt.length} / {PROMPT_MAX_LENGTH}
            </p>
          </div>
        )}

        <div className="mb-6">
          <fieldset>
            <legend className="block text-md font-medium text-[#0E5A6A] mb-2">Quality Setting</legend>
            <div role="radiogroup" className="flex space-x-4 rounded-md bg-slate-100 p-1">
              <label className={`w-full cursor-pointer py-2 px-3 text-sm font-medium rounded-md transition-colors text-center ${quality === 'fast' ? 'bg-[#EA580C] text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}>
                <input
                  type="radio"
                  name="quality"
                  value="fast"
                  checked={quality === 'fast'}
                  onChange={() => onQualityChange('fast')}
                  className="sr-only"
                  disabled={isDisabled}
                />
                Fast Preview
              </label>
              <label className={`w-full cursor-pointer py-2 px-3 text-sm font-medium rounded-md transition-colors text-center ${quality === 'high' ? 'bg-[#EA580C] text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}>
                <input
                  type="radio"
                  name="quality"
                  value="high"
                  checked={quality === 'high'}
                  onChange={() => onQualityChange('high')}
                  className="sr-only"
                  disabled={isDisabled}
                />
                High Quality
              </label>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {quality === 'fast' ? 'Quicker generation for concepts.' : 'Slower, more detailed generation for final images.'}
            </p>
          </fieldset>
        </div>

        <div className="mb-6 mt-6">
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input 
                        id="consent"
                        name="consent"
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => onConsentChange(e.target.checked)}
                        className="focus:ring-[#EA580C] h-4 w-4 text-[#EA580C] border-slate-300 rounded"
                        disabled={isDisabled}
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="consent" className="font-medium text-[#0E5A6A]">
                        I consent to using AI
                    </label>
                    <p className="text-slate-500">I understand this feature uses generative AI to create a new image based on my photo and prompt. The result is not guaranteed.</p>
                </div>
            </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || isDisabled || !consent || (selectedMode.requiresPrompt && !prompt.trim())}
          className="w-full bg-[#EA580C] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#c2410c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EA580C] disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
             '✨ Generate Photoshoot Image'
          )}
        </button>
      </form>
    </div>
  );
};