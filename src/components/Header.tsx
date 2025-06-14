
import React from 'react';
import { FileCode2 } from 'lucide-react';

export const Header = () => {
  return (
    <header className="p-4 border-b border-border flex items-center gap-2">
      <FileCode2 className="text-primary" />
      <h1 className="text-xl font-bold text-secondary">Dev Snippets</h1>
    </header>
  );
};
