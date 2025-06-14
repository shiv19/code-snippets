
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { useSnippets } from '@/context/SnippetContext';

interface SnippetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SnippetForm: React.FC<SnippetFormProps> = ({ open, onOpenChange }) => {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState<'typescript' | 'javascript'>('typescript');
  const [code, setCode] = useState('');
  const { addSnippet } = useSnippets();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;
    addSnippet({ title, language, code });
    setTitle('');
    setLanguage('typescript');
    setCode('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] bg-card">
        <DialogHeader>
          <DialogTitle>Create a New Snippet</DialogTitle>
          <DialogDescription>
            Add a title, select a language, and write your code snippet below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <Input
            placeholder="Snippet title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select value={language} onValueChange={(value: 'typescript' | 'javascript') => setLanguage(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
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
            <Button type="submit">Create Snippet</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
