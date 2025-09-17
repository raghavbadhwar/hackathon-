import React from 'react';
import { KalaMitraIcon } from './Icon';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-[#F8F4E8] flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <KalaMitraIcon className="h-16 w-16 mx-auto" />
        <h1 className="mt-6 text-4xl font-bold text-[#0E5A6A] tracking-tight">
          Welcome to KalaMitra
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Your AI partner in craft.
        </p>
        <div className="mt-10">
          <button
            onClick={onLogin}
            className="w-full bg-[#EA580C] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#c2410c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EA580C] transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Login as an Artisan
          </button>
        </div>
      </div>
    </div>
  );
};
