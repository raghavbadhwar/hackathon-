import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  preview: string | null;
  onValidationError: (message: string) => void;
}

const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, preview, onValidationError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onValidationError(''); // Clear previous errors

      if (!ALLOWED_TYPES.includes(file.type)) {
        onValidationError(`Invalid file type. Please upload a PNG, JPG, or WEBP.`);
        return;
      }
    
      if (file.size > MAX_SIZE_BYTES) {
        onValidationError(`File is too large. Please upload an image under 4MB.`);
        return;
      }

      onImageUpload(file);
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={ALLOWED_TYPES.join(',')}
      />
      <div
        onClick={handleAreaClick}
        className="w-full h-64 sm:h-80 border-2 border-dashed border-[#EA580C]/50 rounded-lg flex items-center justify-center text-center p-4 cursor-pointer hover:bg-[#EA580C]/10 transition-colors"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
        ) : (
          <div className="text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 font-semibold">Click to upload an image</p>
            <p className="text-sm">PNG, JPG, or WEBP (Max 4MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};