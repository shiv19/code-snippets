
import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { SnippetList } from './SnippetList';
import { SnippetForm } from './SnippetForm';
import { Filter, Search } from 'lucide-react';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useSnippets } from '@/context/SnippetContext';


export const Sidebar = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { snippets } = useSnippets();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const allLanguages = useMemo(() => {
    if (!snippets) return [];
    return [...new Set(snippets.map(s => s.language))].sort();
  }, [snippets]);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language) 
        : [...prev, language]
    );
  };

  return (
    <>
      <aside className="w-80 bg-card border-r border-border flex flex-col h-screen">
        <div className="p-4 border-b border-border space-y-4">
          <Button className="w-full" onClick={() => setIsFormOpen(true)}>
            New Snippet
          </Button>
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search snippets..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allLanguages.length > 0 ? allLanguages.map(lang => (
                  <DropdownMenuCheckboxItem
                    key={lang}
                    checked={selectedLanguages.includes(lang)}
                    onCheckedChange={() => handleLanguageChange(lang)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {lang}
                  </DropdownMenuCheckboxItem>
                )) : <DropdownMenuLabel className="font-normal text-sm text-muted-foreground px-2">No languages found</DropdownMenuLabel>}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <SnippetList searchTerm={searchTerm} selectedLanguages={selectedLanguages} />
      </aside>
      <SnippetForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </>
  );
};
