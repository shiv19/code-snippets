
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Snippet } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { toast } from 'sonner';

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
  const snippets = useLiveQuery(() => db.snippets.orderBy('createdAt').reverse().toArray(), []);
  
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(null);

  useEffect(() => {
    const setup = async () => {
      try {
        await db.open();
        const count = await db.snippets.count();
        if (count === 0 && initialSnippets.length > 0) {
          await db.snippets.bulkAdd(initialSnippets);
          toast.info("Added some example snippets for you!");
        }
      } catch (error) {
        console.error("Failed to initialize database:", error);
        toast.error("Could not initialize database.");
      }
    };
    setup();
  }, []);

  useEffect(() => {
    if (snippets) {
      const currentSelectionExists = snippets.some(s => s.id === selectedSnippetId);
      if (!currentSelectionExists && snippets.length > 0) {
        setSelectedSnippetId(snippets[0].id);
      } else if (snippets.length === 0) {
        setSelectedSnippetId(null);
      }
    }
  }, [snippets, selectedSnippetId]);

  const selectedSnippet = snippets?.find(s => s.id === selectedSnippetId) || null;

  const selectSnippet = (id: string | null) => {
    setSelectedSnippetId(id);
  };

  const addSnippet = async (snippet: Omit<Snippet, 'id' | 'createdAt'>) => {
    const newSnippet: Snippet = {
      ...snippet,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    try {
      const newId = await db.snippets.add(newSnippet);
      setSelectedSnippetId(newId as string);
    } catch (error) {
      console.error("Failed to add snippet:", error);
      toast.error("Failed to save snippet.");
    }
  };

  const deleteSnippet = async (id: string) => {
    try {
        await db.snippets.delete(id);
    } catch(error) {
        console.error("Failed to delete snippet:", error);
        toast.error("Failed to delete snippet.");
    }
  };

  return (
    <SnippetContext.Provider value={{ snippets: snippets || [], selectedSnippet, selectSnippet, addSnippet, deleteSnippet }}>
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
