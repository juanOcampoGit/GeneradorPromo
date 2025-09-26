import React from 'react';
import type { ImageFile } from '../types';
import { EditOption } from '../types';
import Spinner from './Spinner';
import ImageComparator from './ImageComparator';

interface ImageEditorCardProps {
  image: ImageFile;
  onOptionChange: (id: string, option: EditOption) => void;
  onDelete: (id: string) => void;
}

const ImageEditorCard: React.FC<ImageEditorCardProps> = ({ image, onOptionChange, onDelete }) => {
  const editedImageSrc = image.editOption !== EditOption.KEEP ? image.editedStates[image.editOption] : null;
  const showComparator = !!editedImageSrc;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl relative">
      <div className="relative">
        {showComparator ? (
          <ImageComparator
            originalSrc={image.originalBase64}
            editedSrc={editedImageSrc}
            alt={image.file.name}
          />
        ) : (
          <img src={image.originalBase64} alt={image.file.name} className="w-full h-48 object-cover" />
        )}
        
        {image.isLoading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <div className="text-center text-white">
              <Spinner />
              <p className="text-sm mt-2 font-semibold">Aplicando magia...</p>
              <p className="text-xs">Esto puede tardar un momento.</p>
            </div>
          </div>
        )}

        <button
          onClick={() => onDelete(image.id)}
          className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-red-500 transition-colors z-30"
          aria-label="Delete image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="p-4">
        <p className="text-sm text-neutral-dark truncate font-medium mb-3">{image.file.name}</p>
        <div className="space-y-2">
          {(Object.values(EditOption) as EditOption[]).map(option => (
            <label key={option} className="flex items-center text-sm text-neutral-dark cursor-pointer">
              <input
                type="radio"
                name={`option-${image.id}`}
                value={option}
                checked={image.editOption === option}
                onChange={() => onOptionChange(image.id, option)}
                disabled={image.isLoading}
                className="h-4 w-4 text-primary focus:ring-primary-light border-gray-300 disabled:opacity-50"
              />
              <span className="ml-2">{option}</span>
            </label>
          ))}
        </div>
        {image.error && <p className="text-red-500 text-xs mt-2">{image.error}</p>}
      </div>
    </div>
  );
};

export default ImageEditorCard;