import React from 'react';
import { KalaMitraIcon } from './Icon';

type View = 'photoshoot' | 'listing' | 'copilot' | 'store';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isCopilotDisabled: boolean;
  isStoreDisabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, isCopilotDisabled, isStoreDisabled }) => {
  const navItemClasses = "cursor-pointer py-2 px-3 rounded-lg transition-colors text-sm md:text-base font-medium disabled:cursor-not-allowed disabled:text-slate-400 disabled:bg-slate-200";
  const activeClasses = "bg-[#EA580C] text-white shadow";
  const inactiveClasses = "text-[#0E5A6A] hover:bg-[#EA580C]/10";

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-slate-200">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <KalaMitraIcon className="h-8 w-8" />
          <span className="text-2xl font-bold text-[#0E5A6A] tracking-tight">
            KalaMitra
          </span>
        </div>
        
        <nav className="flex flex-wrap justify-center items-center gap-1 bg-slate-100/80 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => onViewChange('photoshoot')}
            className={`${navItemClasses} ${currentView === 'photoshoot' ? activeClasses : inactiveClasses}`}
            aria-current={currentView === 'photoshoot' ? 'page' : undefined}
          >
            AI Photoshoot
          </button>
          <button
            onClick={() => onViewChange('listing')}
            className={`${navItemClasses} ${currentView === 'listing' ? activeClasses : inactiveClasses}`}
            aria-current={currentView === 'listing' ? 'page' : undefined}
          >
            Listing Creator
          </button>
           <button
            onClick={() => onViewChange('copilot')}
            className={`${navItemClasses} ${currentView === 'copilot' ? activeClasses : inactiveClasses}`}
            aria-current={currentView === 'copilot' ? 'page' : undefined}
            disabled={isCopilotDisabled}
            title={isCopilotDisabled ? 'Generate a listing first to enable the copilot' : 'Ask questions about your product'}
          >
            Buyer Copilot
          </button>
          <button
            onClick={() => onViewChange('store')}
            className={`${navItemClasses} ${currentView === 'store' ? activeClasses : inactiveClasses}`}
            aria-current={currentView === 'store' ? 'page' : undefined}
            disabled={isStoreDisabled}
            title={isStoreDisabled ? 'Generate a listing first to see the store preview' : 'Preview your product page'}
          >
            Store Preview
          </button>
        </nav>
      </div>
    </header>
  );
};