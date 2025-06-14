
import React from 'react';
import { useSnippets } from '@/context/SnippetContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from './ui/button';

export const SnippetDisplay = () => {
  const { selectedSnippet, deleteSnippet } = useSnippets();

  if (!selectedSnippet) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>Select a snippet to view, or create a new one.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-secondary">{selectedSnippet.title}</h2>
          <span className="text-sm text-muted-foreground uppercase">{selectedSnippet.language}</span>
        </div>
        <Button variant="destructive" size="sm" onClick={() => deleteSnippet(selectedSnippet.id)}>
          Delete
        </Button>
      </div>
      <div className="flex-1 bg-[#282c34] overflow-auto">
        <SyntaxHighlighter language={selectedSnippet.language} style={atomOneDark} customStyle={{ margin: 0, height: '100%' }}>
          {selectedSnippet.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
