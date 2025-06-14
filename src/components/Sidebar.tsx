
import React, { useState } from 'react';
import { Button } from './ui/button';
import { SnippetList } from './SnippetList';
import { SnippetForm } from './SnippetForm';
import { FileCode2 } from 'lucide-react';

export const Sidebar = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <aside className="w-80 bg-card border-r border-border flex flex-col h-screen">
        <div className="p-4 border-b border-border">
          <Button className="w-full" onClick={() => setIsFormOpen(true)}>
            New Snippet
          </Button>
        </div>
        <SnippetList />
      </aside>
      <SnippetForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </>
  );
};
