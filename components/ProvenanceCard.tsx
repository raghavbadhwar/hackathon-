import React from 'react';

interface ProvenanceCardProps {
  story: string;
}

export const ProvenanceCard: React.FC<ProvenanceCardProps> = ({ story }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <h3 className="text-xl font-bold text-[#0E5A6A] border-b-2 border-[#EA580C]/20 pb-2 mb-4">Provenance Story</h3>
      <div className="bg-[#EA580C]/10 border-l-4 border-[#EA580C] text-[#9A3412] p-4 rounded-r-lg" role="note">
        <p className="leading-relaxed">{story}</p>
      </div>
    </div>
  );
};