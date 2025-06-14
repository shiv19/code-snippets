
import { Sidebar } from "@/components/Sidebar";
import { SnippetDisplay } from "@/components/SnippetDisplay";

const Index = () => {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <SnippetDisplay />
      </main>
    </div>
  );
};

export default Index;
