// src/components/ui/button.tsx
import React from 'react';

export function Button({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`px-4 py-1 mr-4 bg-transparent border-2 border-yellow-500 text-white font-medium rounded-md hover:bg-yellow-500 hover:text-black transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
