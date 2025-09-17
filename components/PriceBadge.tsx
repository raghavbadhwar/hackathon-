import React from 'react';
import type { PricingSuggestion } from '../types';

interface PriceBadgeProps {
  pricing: PricingSuggestion;
}

export const PriceBadge: React.FC<PriceBadgeProps> = ({ pricing }) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <h3 className="text-xl font-bold text-[#0E5A6A] border-b-2 border-[#EA580C]/20 pb-2 mb-4">Pricing Suggestion</h3>
      <div className="space-y-4">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-sm text-slate-500">Suggested Price</p>
            <p className="text-2xl md:text-3xl font-bold text-green-600">{formatCurrency(pricing.aiSuggested)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Minimum Price</p>
            <p className="text-lg md:text-xl font-semibold text-[#EA580C]">{formatCurrency(pricing.minAcceptable)}</p>
          </div>
        </div>
        <div className="bg-[#EA580C]/10 border-t border-[#EA580C]/20 pt-3 mt-4">
          <h4 className="text-sm font-semibold text-[#0E5A6A] mb-1 px-4">Reasoning:</h4>
          <p className="text-sm text-slate-600 italic px-4 pb-2">{pricing.reasoning}</p>
        </div>
      </div>
    </div>
  );
};