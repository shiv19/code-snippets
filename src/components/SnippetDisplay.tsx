
import React, { useState } from 'react';
import { useSnippets } from '@/context/SnippetContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';
import { Copy, Pencil, History, Database } from 'lucide-react';
import { SnippetForm } from './SnippetForm';
import { VersionHistory } from './VersionHistory';

export const SnippetDisplay = () => {
  const {
    selectedSnippet,
    deleteSnippet
  } = useSnippets();
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleCopy = () => {
    if (!selectedSnippet) return;
    navigator.clipboard.writeText(selectedSnippet.code);
    toast.success('Snippet copied to clipboard!');
  };

  if (!selectedSnippet) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <Alert className="m-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <Database className="h-4 w-4" />
          <AlertDescription>
            All snippets are stored locally in your browser. They won't be synced across devices or backed up automatically.
          </AlertDescription>
        </Alert>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <p>Select a snippet to view, or create a new one.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <Alert className="m-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <Database className="h-4 w-4" />
          <AlertDescription>
            All snippets are stored locally in your browser. They won't be synced across devices or backed up automatically.
          </AlertDescription>
        </Alert>
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-neutral-50">{selectedSnippet.title}</h2>
            <span className="text-sm text-muted-foreground uppercase">{selectedSnippet.language}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowHistory(true)}>
              <History className="mr-2 h-4 w-4" />
              History
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button variant="destructive" size="sm" onClick={() => deleteSnippet(selectedSnippet.id)}>
              Delete
            </Button>
          </div>
        </div>
        <div className="flex-1 bg-[#282c34] overflow-auto">
          <SyntaxHighlighter language={selectedSnippet.language} style={atomDark} customStyle={{
          margin: 0,
          height: '100%'
        }}>
            {selectedSnippet.code}
          </SyntaxHighlighter>
        </div>
      </div>
      <SnippetForm 
        open={isEditing}
        onOpenChange={setIsEditing}
        snippetToEdit={selectedSnippet}
      />
      {selectedSnippet && (
        <VersionHistory 
          open={showHistory}
          onOpenChange={setShowHistory}
          snippet={selectedSnippet}
        />
      )}
    </>
  );
};
