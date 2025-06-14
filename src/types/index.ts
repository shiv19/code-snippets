
export interface SnippetVersion {
  code: string;
  createdAt: string;
}

export interface Snippet {
  id: string;
  title: string;
  language: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  history: SnippetVersion[];
}
