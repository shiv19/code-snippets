
import React from 'react';
import { cn } from '@/lib/utils';
import { useSnippets } from '@/context/SnippetContext';
import { Snippet } from '@/types';

interface SnippetListItemProps {
  snippet: Snippet;
}

export const SnippetListItem: React.FC<SnippetListItemProps> = ({
  snippet
}) => {
  const {
    selectedSnippet,
    selectSnippet
  } = useSnippets();
  const isActive = selectedSnippet?.id === snippet.id;
  return <button onClick={() => selectSnippet(snippet.id)} className={cn("w-full text-left p-3 rounded-md transition-colors", isActive ? "bg-primary/20 text-primary-foreground" : "hover:bg-muted/50")}>
      <h3 className="font-semibold truncate text-neutral-50">{snippet.title}</h3>
      <p className="text-sm text-muted-foreground uppercase">{snippet.language}</p>
    </button>;
};
