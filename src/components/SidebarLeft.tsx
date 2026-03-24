import { memo, useState } from 'react';
import { Plus, Book, Trash2, Search } from 'lucide-react';
import { useEditor } from '../hooks/useEditor';
import type { Story } from '../context/EditorContext';

export const SidebarLeft = memo(() => {
  const { data, activeStoryId, addStory, setActiveStoryId, deleteStory } = useEditor();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStories = data.stories.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sidebar-left">
      <div className="sidebar-content">
        <div className="header-actions">
          <h2>Library</h2>
          <button className="add-btn" onClick={addStory} title="Add new story">
            <Plus size={14} /> <span>Story</span>
          </button>
        </div>

        <div className="sidebar-search">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search stories"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="manuscript-tree">
          {filteredStories.map((story: Story) => (
            <div
              key={story.id}
              className={`file-item group ${activeStoryId === story.id ? 'active' : ''}`}
              onClick={() => setActiveStoryId(story.id)}
            >
              <Book size={16} style={{ marginRight: '10px', flexShrink: 0, opacity: 0.7 }} />
              <div className="file-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span className="file-title" style={{ fontSize: '0.85rem' }}>{story.title || 'Untitled'}</span>
                <span className="file-meta" style={{ fontSize: '0.65rem', opacity: 0.5 }}>Last edited recently</span>
              </div>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteStory(story.id);
                }}
                style={{ marginLeft: '4px' }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {filteredStories.length === 0 && (
            <div className="empty-state">
              {searchTerm ? "No stories found." : "Your library is empty."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
