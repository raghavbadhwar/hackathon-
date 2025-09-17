
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-12 py-6 border-t">
      <div className="container mx-auto px-4 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} KalaMitra. Helping Indian artisans thrive.</p>
      </div>
    </footer>
  );
};
