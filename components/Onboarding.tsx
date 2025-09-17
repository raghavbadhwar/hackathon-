import React, { useState } from 'react';

interface OnboardingProps {
  onFinish: () => void;
}

const onboardingSteps = [
  {
    icon: (
      <svg className="h-16 w-16 text-[#EA580C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
    title: 'AI Photoshoot Studio',
    description: 'Upload a simple photo of your product. Our AI will help you place it in beautiful lifestyle scenes, change backgrounds, adjust lighting, and more.'
  },
  {
    icon: (
      <svg className="h-16 w-16 text-[#EA580C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    title: 'Listing Creator',
    description: 'Once you have an image, the AI can analyze it to automatically write a compelling product title, description, SEO keywords, and even a story about its origins.'
  },
  {
    icon: (
      <svg className="h-16 w-16 text-[#EA580C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    title: 'Buyer Copilot',
    description: 'Test the customer experience! The Buyer Copilot is an AI chat assistant that can answer questions about your product, based on the listing you just created.'
  },
  {
    icon: (
      <svg className="h-16 w-16 text-[#EA580C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25H4.5A2.25 2.25 0 002.25 13.5V21M6 4.5h12M6 4.5v16.5m12-16.5v16.5" />
      </svg>
    ),
    title: 'Store Preview & Publish',
    description: 'See how your final product page will look to customers. When you are ready, you can publish your listing to channels like Instagram or the ONDC network.'
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const currentStep = onboardingSteps[step];
  const isLastStep = step === onboardingSteps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 transform transition-all animate-slide-in-up">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-[#EA580C]/10">
            {currentStep.icon}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-[#0E5A6A]">{currentStep.title}</h2>
          <p className="mt-2 text-slate-600">{currentStep.description}</p>
        </div>

        <div className="flex justify-center my-8 space-x-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === step ? 'w-6 bg-[#EA580C]' : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="w-full bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={isLastStep ? onFinish : () => setStep(s => s + 1)}
            className="w-full bg-[#EA580C] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#c2410c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EA580C] transition-colors"
          >
            {isLastStep ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slide-in-up {
          animation: slideInUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
