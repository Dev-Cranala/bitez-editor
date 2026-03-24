import type { EditorData } from '../context/EditorContext';

export interface StoryMetadata {
  id: string;
  title: string;
}

export interface IStorageAdapter {
  save(data: EditorData): Promise<void> | void;
  load(): Promise<EditorData | null> | EditorData | null;
  saveStory(id: string, content: string): Promise<void> | void;
  loadStory(id: string): Promise<string> | string;
  clear(): Promise<void> | void;
}
