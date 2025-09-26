
import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImagesUploaded: (files: FileList) => void;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUploaded, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && !disabled) {
      onImagesUploaded(e.dataTransfer.files);
    }
  }, [onImagesUploaded, disabled]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && !disabled) {
      onImagesUploaded(e.target.files);
    }
  };

  return (
    <div className="w-full p-4">
      <label
        htmlFor="image-upload"
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200
        ${disabled ? 'bg-neutral-light cursor-not-allowed' : 'bg-white hover:bg-neutral-light'}
        ${isDragging ? 'border-primary-light' : 'border-neutral'}`}
      >
        <div
          className="absolute inset-0 w-full h-full"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        />
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <svg className="w-10 h-10 mb-4 text-neutral-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <p className="mb-2 text-sm text-neutral-dark"><span className="font-semibold">Click para subir</span> o arrastra y suelta</p>
          <p className="text-xs text-neutral-dark/80">SVG, PNG, JPG o WEBP</p>
        </div>
        <input id="image-upload" type="file" className="hidden" multiple accept="image/*" onChange={handleChange} disabled={disabled} />
      </label>
    </div>
  );
};

export default ImageUploader;
   