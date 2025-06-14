
import React from 'react';
import { useSnippets } from '@/context/SnippetContext';
import { SnippetListItem } from './SnippetListItem';
import { ScrollArea } from "@/components/ui/scroll-area";

export const SnippetList = () => {
  const { snippets } = useSnippets();

  if (snippets.length === 0) {
    return <p className="p-4 text-sm text-muted-foreground">No snippets yet.</p>;
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-1">
        {snippets.map((snippet) => (
          <SnippetListItem key={snippet.id} snippet={snippet} />
        ))}
      </div>
    </ScrollArea>
  );
};
