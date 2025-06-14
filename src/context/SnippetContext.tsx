
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Snippet, SnippetVersion } from '@/types';
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
    updatedAt: new Date().toISOString(),
    history: [],
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
    updatedAt: new Date().toISOString(),
    history: [],
  }
];

interface SnippetContextType {
  snippets: Snippet[];
  selectedSnippet: Snippet | null;
  selectSnippet: (id: string | null) => void;
  addSnippet: (snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => void;
  updateSnippet: (id: string, updates: { title: string; language: string; code: string; }) => void;
  deleteSnippet: (id: string) => void;
}

const SnippetContext = createContext<SnippetContextType | undefined>(undefined);

export const SnippetProvider = ({ children }: { children: ReactNode }) => {
  const snippets = useLiveQuery(() => db.snippets.orderBy('updatedAt').reverse().toArray(), []);
  
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(null);

  useEffect(() => {
    const setup = async () => {
      try {
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

  const addSnippet = async (snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => {
    const now = new Date().toISOString();
    const newSnippet: Snippet = {
      ...snippet,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      history: [],
    };
    try {
      const newId = await db.snippets.add(newSnippet);
      setSelectedSnippetId(newId as string);
      toast.success("Snippet created!");
    } catch (error) {
      console.error("Failed to add snippet:", error);
      toast.error("Failed to save snippet.");
    }
  };

  const updateSnippet = async (id: string, updates: { title: string; language: string; code: string; }) => {
    try {
      const snippetToUpdate = await db.snippets.get(id);
      if (!snippetToUpdate) {
        toast.error("Snippet not found.");
        return;
      }

      const newHistoryEntry: SnippetVersion = {
        code: snippetToUpdate.code,
        createdAt: snippetToUpdate.updatedAt,
      };

      const updatedHistory = [...snippetToUpdate.history, newHistoryEntry];
      
      await db.snippets.update(id, {
        ...updates,
        updatedAt: new Date().toISOString(),
        history: updatedHistory,
      });
      toast.success("Snippet updated!");
    } catch (error) {
      console.error("Failed to update snippet:", error);
      toast.error("Failed to update snippet.");
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
    <SnippetContext.Provider value={{ snippets: snippets || [], selectedSnippet, selectSnippet, addSnippet, updateSnippet, deleteSnippet }}>
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
