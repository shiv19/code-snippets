
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { useSnippets } from '@/context/SnippetContext';
import { Snippet } from '@/types';

interface SnippetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippetToEdit?: Snippet | null;
}

const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'sql', label: 'SQL' },
    { value: 'json', label: 'JSON' },
    { value: 'yaml', label: 'YAML' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'shell', label: 'Shell/Bash' },
    { value: 'plaintext', label: 'Plain Text' },
];

export const SnippetForm: React.FC<SnippetFormProps> = ({ open, onOpenChange, snippetToEdit }) => {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [code, setCode] = useState('');
  const { addSnippet, updateSnippet } = useSnippets();
  const isEditing = !!snippetToEdit;

  useEffect(() => {
    if (open) {
      if (isEditing && snippetToEdit) {
        setTitle(snippetToEdit.title);
        setLanguage(snippetToEdit.language);
        setCode(snippetToEdit.code);
      } else {
        setTitle('');
        setLanguage('typescript');
        setCode('');
      }
    }
  }, [snippetToEdit, isEditing, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;
    
    if (isEditing && snippetToEdit) {
      updateSnippet(snippetToEdit.id, { title, language, code });
    } else {
      addSnippet({ title, language, code });
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] bg-card">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Snippet' : 'Create a New Snippet'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edit the title, language, or code of your snippet.' : 'Add a title, select a language, and write your code snippet below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <Input
            placeholder="Snippet title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="border border-input rounded-md overflow-hidden">
            <Editor
              height="40vh"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{ minimap: { enabled: false } }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit">{isEditing ? 'Save Changes' : 'Create Snippet'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
