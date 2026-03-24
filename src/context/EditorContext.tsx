import { createContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { PluginRegistry } from '../registry/PluginRegistry';

export interface Story {
  id: string;
  title: string;
  content: string;
}

export interface EditorConfig {
  plugins: Record<string, any>;
  pluginOrder?: string[];
}

export interface EditorData {
  stories: Story[];
  config: EditorConfig;
  version: number;
}

export interface EditorState {
  data: EditorData;
  activeStoryId: string | null;
  activeStory: Story | undefined;
  activeStoryContent: string;
  isLoadingContent: boolean;
  addStory: () => void;
  updateStory: (id: string, updates: Partial<Story>) => void;
  deleteStory: (id: string) => void;
  setActiveStoryId: (id: string) => void;
  reorderPlugin: (id: string, direction: 'up' | 'down') => void;
  setPluginOrder: (ids: string[]) => void;
  updatePluginConfig: (pluginId: string, config: any) => void;
  maxStories: number;
  getDataAsJson: () => Promise<string>;
  isRightSidebarOpen: boolean;
  toggleRightSidebar: () => void;
}

export const EditorContext = createContext<EditorState | undefined>(undefined);

import { LocalStorageAdapter } from '../adapters/StorageAdapter';
import type { IStorageAdapter } from '../adapters/IStorageAdapter';

const initialData: EditorData = {
  stories: [
    { id: '1', title: 'Untitled', content: '' }
  ],
  config: { plugins: {} },
  version: 1
};

interface EditorProviderProps {
  children: ReactNode;
  adapter?: IStorageAdapter;
  maxStories?: number;
}

export const EditorProvider = ({ 
  children, 
  adapter = LocalStorageAdapter,
  maxStories = 100 
}: EditorProviderProps) => {
  const [data, setData] = useState<EditorData>(initialData);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [activeStoryContent, setActiveStoryContent] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(true);
  
  const saveManifestTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveStoryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load Manifest asynchronously on mount
  useEffect(() => {
    const loadManifest = async () => {
      const saved = await adapter.load();
      if (saved) {
        setData(saved);
        setActiveStoryId(saved.stories[0]?.id || null);
      } else {
        setActiveStoryId('1');
      }
    };
    loadManifest();
  }, [adapter]); // Reload if adapter type changes

  // Load Content when Active Story changes
  useEffect(() => {
    if (!activeStoryId) {
      setActiveStoryContent('');
      return;
    }

    const loadContent = async () => {
      setIsLoadingContent(true);
      const content = await adapter.loadStory(activeStoryId);
      setActiveStoryContent(content);
      setIsLoadingContent(false);
    };
    loadContent();
  }, [activeStoryId, adapter]);

  // Sync Manifest (Metadata) to storage - debounced 1s (infrequent changes)
  useEffect(() => {
    if (saveManifestTimeoutRef.current) clearTimeout(saveManifestTimeoutRef.current);
    saveManifestTimeoutRef.current = setTimeout(async () => {
      await adapter.save(data);
    }, 1000);
    return () => { if (saveManifestTimeoutRef.current) clearTimeout(saveManifestTimeoutRef.current); };
  }, [data.stories, data.config, data.version, adapter]); // Persist on title or list changes

  // Special separate function for Title changes (as it's in the manifest)
  const syncTitleToManifest = useCallback((id: string, title: string) => {
     setData(prev => ({
        ...prev,
        stories: prev.stories.map(s => s.id === id ? { ...s, title } : s)
     }));
  }, []);

  const activeStory = data.stories.find(s => s.id === activeStoryId);

  const addStory = useCallback(() => {
    if (data.stories.length >= maxStories) {
      alert(`You've reached the limit of ${maxStories} stories.`);
      return;
    }
    const newId = Date.now().toString();
    const newStory: Story = { id: newId, title: 'Untitled', content: '' };
    setData(prev => ({ ...prev, stories: [...prev.stories, newStory] }));
    setActiveStoryId(newId);
  }, [data.stories.length, maxStories]);

  const updateStory = useCallback((id: string, updates: Partial<Story>) => {
    // If we're updating the active story content
    if (updates.content !== undefined && id === activeStoryId) {
      setActiveStoryContent(updates.content);
      
      // Debounced story save
      if (saveStoryTimeoutRef.current) clearTimeout(saveStoryTimeoutRef.current);
      saveStoryTimeoutRef.current = setTimeout(async () => {
         await adapter.saveStory(id, updates.content!);
      }, 500);
    }
    
    // If we're updating metadata (like the title)
    if (updates.title !== undefined) {
       syncTitleToManifest(id, updates.title);
    }
  }, [activeStoryId, adapter, syncTitleToManifest]);

  const deleteStory = useCallback((id: string) => {
    setData(prev => ({ ...prev, stories: prev.stories.filter(s => s.id !== id) }));
    if (activeStoryId === id) setActiveStoryId(null);
  }, [activeStoryId]);

  const reorderPlugin = useCallback((id: string, direction: 'up' | 'down') => {
    setData(prev => {
      const order = prev.config.pluginOrder || PluginRegistry.getPlugins().map(p => p.meta.id);
      const index = order.indexOf(id);
      if (index === -1) return prev;
      
      const newOrder = [...order];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (targetIndex < 0 || targetIndex >= newOrder.length) return prev;
      
      [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      
      return {
        ...prev,
        config: { ...prev.config, pluginOrder: newOrder }
      };
    });
  }, []);

  const setPluginOrder = useCallback((ids: string[]) => {
    setData(prev => ({
      ...prev,
      config: { ...prev.config, pluginOrder: ids }
    }));
  }, []);

  const updatePluginConfig = useCallback((pluginId: string, config: any) => {
    setData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        plugins: {
          ...prev.config.plugins,
          [pluginId]: config
        }
      }
    }));
  }, []);

  const getDataAsJson = useCallback(async () => {
     return JSON.stringify(data, null, 2);
  }, [data]);

  const toggleRightSidebar = useCallback(() => {
    setIsRightSidebarOpen(prev => !prev);
  }, []);

  const contextValue = useMemo(() => ({ 
    data, 
    activeStoryId, 
    activeStory, 
    activeStoryContent,
    isLoadingContent,
    addStory, 
    updateStory, 
    deleteStory,
    setActiveStoryId,
    reorderPlugin,
    setPluginOrder,
    updatePluginConfig,
    maxStories,
    getDataAsJson,
    isRightSidebarOpen,
    toggleRightSidebar
  }), [
    data, 
    activeStoryId, 
    activeStory, 
    activeStoryContent, 
    isLoadingContent, 
    addStory, 
    updateStory, 
    deleteStory, 
    setActiveStoryId, 
    reorderPlugin, 
    setPluginOrder, 
    updatePluginConfig, 
    maxStories, 
    getDataAsJson,
    isRightSidebarOpen,
    toggleRightSidebar
  ]);

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};


