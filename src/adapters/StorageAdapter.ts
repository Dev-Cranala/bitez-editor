import type { EditorData, Story } from '../context/EditorContext';
import type { IStorageAdapter } from './IStorageAdapter';

const MASTER_MANIFEST_KEY = 'manuscript_editor_manifest';
const STORY_PREFIX = 'manuscript_story_';
const CURRENT_VERSION = 1;

// Basic validation to ensure integrity
const isValidEditorData = (data: any): data is EditorData => {
  return (
    data &&
    Array.isArray(data.stories) &&
    typeof data.config === 'object' &&
    typeof data.version === 'number'
  );
};

// ... Migration logic here if needed

export const LocalStorageAdapter: IStorageAdapter = {
  save: (data: EditorData) => {
    try {
      const manifest = {
        stories: data.stories.map(s => ({ id: s.id, title: s.title })),
        config: data.config,
        version: CURRENT_VERSION
      };
      localStorage.setItem(MASTER_MANIFEST_KEY, JSON.stringify(manifest));
    } catch (e) {
      console.error('CRITICAL: Data Persistence Failure (Manifest)', e);
    }
  },

  saveStory: (id: string, content: string) => {
    try {
      localStorage.setItem(`${STORY_PREFIX}${id}`, content);
    } catch (e) {
      console.error(`Failed to save story ${id}`, e);
    }
  },

  loadStory: (id: string): string => {
    try {
      return localStorage.getItem(`${STORY_PREFIX}${id}`) || '';
    } catch (e) {
      console.error(`Failed to load story ${id}`, e);
      return '';
    }
  },

  load: (): EditorData | null => {
    try {
      const manifestStr = localStorage.getItem(MASTER_MANIFEST_KEY);
      if (!manifestStr) return null;
      
      const manifest = JSON.parse(manifestStr);
      
      // We return the manifest structure. Stories here only contain ID and Title.
      // Content is empty/undefined until loaded specifically.
      const stories: Story[] = (manifest.stories || []).map((s: any) => ({
        ...s,
        content: '' // Lazy load will fill this
      }));
      
      const combinedData: EditorData = {
        stories,
        config: manifest.config,
        version: manifest.version
      };

      if (!isValidEditorData(combinedData)) return null;
      return combinedData;
    } catch (e) {
      console.error('Failed to load manifest:', e);
      return null;
    }
  },

  clear: () => {
    localStorage.removeItem(MASTER_MANIFEST_KEY);
    // Note: In production we'd also clear the prefixed story keys
  }
};



