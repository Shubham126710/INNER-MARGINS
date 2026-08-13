import React from 'react';

interface DropCapProps {
  children: React.ReactNode;
}

export function DropCap({ children }: DropCapProps) {
  // We apply the drop-cap class to a wrapping div. 
  // It relies on the first letter of the first paragraph being styled by globals.css
  return (
    <div className="drop-cap">
      {children}
    </div>
  );
}
