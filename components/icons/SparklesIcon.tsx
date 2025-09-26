
import React from 'react';

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-7.19c0-1.754.665-3.435 1.815-4.661a.75.75 0 011.05.105c.27.34.453.734.525 1.154.072.42-.053.84-.284 1.185A3.752 3.752 0 019 15.19V21a.75.75 0 01-1.5 0v-5.81a5.25 5.25 0 01-2.75-4.69c0-2.9 2.35-5.25 5.25-5.25z"
      clipRule="evenodd"
    />
    <path
      d="M6.75 12a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75z"
    />
  </svg>
);
   