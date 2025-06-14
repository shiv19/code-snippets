
import React from 'react';
import { Snippet, SnippetVersion } from '@/types';
import { useSnippets } from '@/context/SnippetContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface VersionHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippet: Snippet;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({ open, onOpenChange, snippet }) => {
    const { updateSnippet } = useSnippets();

    const handleRestore = (version: SnippetVersion) => {
        if (!snippet) return;
        updateSnippet(snippet.id, {
            title: snippet.title,
            language: snippet.language,
            code: version.code,
        });
        toast.success(`Restored version from ${format(new Date(version.createdAt), "PPpp")}`);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
                <SheetHeader>
                    <SheetTitle>Version History</SheetTitle>
                    <SheetDescription>
                        History for "{snippet.title}". You can view or restore past versions.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto py-4">
                    {snippet.history && snippet.history.length > 0 ? (
                        <div className="space-y-4 pr-6">
                            {[...snippet.history].reverse().map((version, index) => (
                                <div key={version.createdAt + index} className="p-4 border rounded-md flex justify-between items-center bg-muted/20">
                                    <div>
                                        <p className="font-medium">Version from</p>
                                        <p className="text-sm text-muted-foreground">{format(new Date(version.createdAt), "PPpp")}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">View</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[80vw] bg-card">
                                                <DialogHeader>
                                                    <DialogTitle>Viewing Version</DialogTitle>
                                                    <DialogDescription>
                                                        From {format(new Date(version.createdAt), "PPpp")}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="max-h-[70vh] overflow-auto rounded-md bg-[#282c34]">
                                                    <SyntaxHighlighter language={snippet.language} style={atomDark} customStyle={{ margin: 0, height: '100%' }}>
                                                        {version.code}
                                                    </SyntaxHighlighter>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        <Button size="sm" onClick={() => handleRestore(version)}>Restore</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>No version history for this snippet.</p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};
