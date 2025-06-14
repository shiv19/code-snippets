
import React, { useMemo } from 'react';
import { useSnippets } from '@/context/SnippetContext';
import { SnippetListItem } from './SnippetListItem';
import { ScrollArea } from "@/components/ui/scroll-area";

interface SnippetListProps {
  searchTerm: string;
  selectedLanguages: string[];
}

export const SnippetList = ({ searchTerm, selectedLanguages }: SnippetListProps) => {
  const { snippets } = useSnippets();

  const filteredSnippets = useMemo(() => {
    if (!snippets) return [];
    return snippets.filter(snippet => {
      const searchLower = searchTerm.toLowerCase();
      const titleMatch = snippet.title.toLowerCase().includes(searchLower);
      
      const languageMatch = selectedLanguages.length === 0 || selectedLanguages.includes(snippet.language);

      return titleMatch && languageMatch;
    });
  }, [snippets, searchTerm, selectedLanguages]);

  if (snippets.length === 0) {
    return <p className="p-4 text-sm text-muted-foreground">No snippets yet. Create one!</p>;
  }
  
  if (filteredSnippets.length === 0) {
    return <p className="p-4 text-sm text-muted-foreground">No snippets match your search.</p>;
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-1">
        {filteredSnippets.map((snippet) => (
          <SnippetListItem key={snippet.id} snippet={snippet} />
        ))}
      </div>
    </ScrollArea>
  );
};
