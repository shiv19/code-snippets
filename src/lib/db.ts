
import Dexie, { Table } from 'dexie';
import { Snippet } from '@/types';

export class CodeSnippetDatabase extends Dexie {
  snippets!: Table<Snippet>; 

  constructor() {
    super('CodeSnippetDatabase');
    this.version(1).stores({
      snippets: 'id, title, language, createdAt'
    });
    this.version(2).stores({
      snippets: 'id, title, language, createdAt, updatedAt'
    }).upgrade(tx => {
      return tx.table('snippets').toCollection().modify((snippet: any) => {
        snippet.updatedAt = snippet.createdAt;
        snippet.history = [];
      });
    });
  }
}

export const db = new CodeSnippetDatabase();
