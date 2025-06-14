
import Dexie, { Table } from 'dexie';
import { Snippet } from '@/types';

export class CodeSnippetDatabase extends Dexie {
  snippets!: Table<Snippet>; 

  constructor() {
    super('CodeSnippetDatabase');
    this.version(1).stores({
      snippets: 'id, title, language, createdAt' // 'id' is the primary key
    });
  }
}

export const db = new CodeSnippetDatabase();
