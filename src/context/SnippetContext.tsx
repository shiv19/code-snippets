
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snippet } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const initialSnippets: Snippet[] = [
  {
    id: '1',
    title: 'React Component Example',
    language: 'typescript',
    code: `import React from 'react';

const MyComponent = () => {
  return <div>Hello, World!</div>;
};

export default MyComponent;`,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Simple Fetch Function',
    language: 'javascript',
    code: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
  }
}`,
    createdAt: new Date().toISOString(),
  }
];

interface SnippetContextType {
  snippets: Snippet[];
  selectedSnippet: Snippet | null;
  selectSnippet: (id: string | null) => void;
  addSnippet: (snippet: Omit<Snippet, 'id' | 'createdAt'>) => void;
  deleteSnippet: (id: string) => void;
}

const SnippetContext = createContext<SnippetContextType | undefined>(undefined);

export const SnippetProvider = ({ children }: { children: ReactNode }) => {
  const [snippets, setSnippets] = useState<Snippet[]>(initialSnippets);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(initialSnippets[0] || null);

  const selectSnippet = (id: string | null) => {
    if (id === null) {
      setSelectedSnippet(null);
      return;
    }
    const snippet = snippets.find(s => s.id === id) || null;
    setSelectedSnippet(snippet);
  };

  const addSnippet = (snippet: Omit<Snippet, 'id' | 'createdAt'>) => {
    const newSnippet: Snippet = {
      ...snippet,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    const updatedSnippets = [newSnippet, ...snippets];
    setSnippets(updatedSnippets);
    selectSnippet(newSnippet.id);
  };

  const deleteSnippet = (id: string) => {
    setSnippets(prev => {
      const updated = prev.filter(s => s.id !== id);
      if (selectedSnippet?.id === id) {
        selectSnippet(updated[0]?.id || null);
      }
      return updated;
    });
  };

  return (
    <SnippetContext.Provider value={{ snippets, selectedSnippet, selectSnippet, addSnippet, deleteSnippet }}>
      {children}
    </SnippetContext.Provider>
  );
};

export const useSnippets = () => {
  const context = useContext(SnippetContext);
  if (!context) {
    throw new Error('useSnippets must be used within a SnippetProvider');
  }
  return context;
};
