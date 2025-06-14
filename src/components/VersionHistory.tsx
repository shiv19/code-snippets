
import React from 'react';
import { Snippet, SnippetVersion } from '@/types';
import { useSnippets } from '@/context/SnippetContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Trash2 } from 'lucide-react';

interface VersionHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippet: Snippet;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({ open, onOpenChange, snippet }) => {
    const { updateSnippet, deleteSnippetVersion } = useSnippets();

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

    const handleDelete = (version: SnippetVersion) => {
        if (!snippet) return;
        deleteSnippetVersion(snippet.id, version.createdAt);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
                <SheetHeader>
                    <SheetTitle>Version History</SheetTitle>
                    <SheetDescription>
                        History for "{snippet.title}". You can view, restore, or delete past versions.
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
                                            <DialogContent className="sm:max-w-[80vw] bg-card flex flex-col max-h-[90vh]">
                                                <DialogHeader>
                                                    <DialogTitle>Viewing Version</DialogTitle>
                                                    <DialogDescription>
                                                        From {format(new Date(version.createdAt), "PPpp")}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex-1 overflow-auto rounded-md bg-[#282c34]">
                                                    <SyntaxHighlighter language={snippet.language} style={atomDark} customStyle={{ margin: 0, height: '100%', overflow: 'auto' }}>
                                                        {version.code}
                                                    </SyntaxHighlighter>
                                                </div>
                                                <DialogFooter>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete Version
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete this version of the snippet.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(version)}>Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </DialogFooter>
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
