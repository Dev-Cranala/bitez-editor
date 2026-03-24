import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { useEditor } from '../hooks/useEditor';
import { Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const Editor = memo(() => {
  const { activeStoryId, activeStory, activeStoryContent, isLoadingContent, updateStory, isRightSidebarOpen, toggleRightSidebar } = useEditor();
  const editorRef = useRef<HTMLDivElement>(null);

  // Track button states
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline')
    });
  };

  useEffect(() => {
    document.addEventListener('selectionchange', updateActiveFormats);
    return () => document.removeEventListener('selectionchange', updateActiveFormats);
  }, []);

  // Simple formatting command
  const format = (command: string) => {
    document.execCommand(command, false, undefined);
    updateActiveFormats(); // Sync buttons immediately after clicking
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Local ref for content to track synchronization without re-renders
  const lastSyncedContent = useRef(activeStoryContent);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Sync DOM TO Context (debounced)
  const handleInput = useCallback(() => {
    if (editorRef.current && activeStoryId) {
      const newContent = editorRef.current.innerHTML;
      lastSyncedContent.current = newContent;
      
      // Debounce the update to context to avoid global re-renders
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => {
        updateStory(activeStoryId, { content: newContent });
      }, 500); 
    }
  }, [activeStoryId, updateStory]);

  // Sync Context TO DOM (ONLY on chapter change or initialization)
  useEffect(() => {
    if (!isLoadingContent && editorRef.current) {
      // Only force injection if the ID changed or if the DOM is empty/mismatched
      // but NOT if we just typed the update ourselves (checked via ref)
      if (editorRef.current.innerHTML !== activeStoryContent && lastSyncedContent.current !== activeStoryContent) {
        editorRef.current.innerHTML = activeStoryContent;
        lastSyncedContent.current = activeStoryContent;
      }
    }
    
    // Clear timeout on unmount or ID change
    return () => { if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current); };
  }, [activeStoryId, activeStoryContent, isLoadingContent]);

  if (!activeStory) {
    return (
      <div className="editor-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Select a story or create a new one to start writing.</p>
      </div>
    );
  }

  if (isLoadingContent) {
    return (
      <div className="editor-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--accent-blue)' }}>Loading story content...</p>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <div className="editor-top-bar">
        <span className="file-path">{activeStory.title}</span>
        <div className="toolbar">
          <button
            onClick={() => format('bold')}
            className={activeFormats.bold ? 'active' : ''}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => format('italic')}
            className={activeFormats.italic ? 'active' : ''}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => format('underline')}
            className={activeFormats.underline ? 'active' : ''}
            title="Underline"
          >
            <Underline size={16} />
          </button>
          <div className="divider" />
          <button onClick={() => format('insertUnorderedList')} title="Bullet List"><List size={16} /></button>
          <button onClick={() => format('justifyLeft')} title="Align Left"><AlignLeft size={16} /></button>
          <button onClick={() => format('justifyCenter')} title="Align Center"><AlignCenter size={16} /></button>
          <button onClick={() => format('justifyRight')} title="Align Right"><AlignRight size={16} /></button>
          <div className="divider" />
          <button 
            onClick={toggleRightSidebar} 
            className={isRightSidebarOpen ? 'active' : ''} 
            title={isRightSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
          >
            {isRightSidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      <div className="editor-page">
        <div className="page-header">
          <input
            className="chapter-title"
            value={activeStory.title}
            onChange={(e) => updateStory(activeStoryId!, { title: e.target.value })}
            placeholder="Story Title"
          />
        </div>

        <div
          className="text-editor"
          contentEditable
          ref={editorRef}
          onInput={handleInput}
          suppressContentEditableWarning
        />
      </div>
    </div>
  );
});
