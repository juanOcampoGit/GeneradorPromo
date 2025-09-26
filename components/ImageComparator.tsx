import React, { useState, useRef, useCallback } from 'react';

interface ImageComparatorProps {
  originalSrc: string;
  editedSrc: string;
  alt: string;
}

const ImageComparator: React.FC<ImageComparatorProps> = ({ originalSrc, editedSrc, alt }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const onMouseMove = (moveEvent: MouseEvent) => handleMove(moveEvent.clientX);
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const onTouchMove = (moveEvent: TouchEvent) => handleMove(moveEvent.touches[0].clientX);
    const onTouchEnd = () => {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-48 select-none overflow-hidden group"
    >
      <img
        src={originalSrc}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        draggable="false"
      />
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img
          src={editedSrc}
          alt={`Edited ${alt}`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable="false"
        />
      </div>
      <div
        className="absolute top-0 bottom-0 w-1 bg-white/75 backdrop-blur-sm cursor-ew-resize"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 bg-white/90 rounded-full p-1.5 shadow-md backdrop-blur-sm transition-transform group-hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ImageComparator;
