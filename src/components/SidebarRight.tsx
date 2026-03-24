import { useEffect, useState, useRef, memo } from 'react';
import { PluginRegistry } from '../registry/PluginRegistry';
import type { PluginInstance } from '../registry/PluginRegistry';
import { Store, GripHorizontal, X } from 'lucide-react';
import { useEditor } from '../hooks/useEditor';

export const SidebarRight = memo(() => {
  const { data, setPluginOrder, isRightSidebarOpen } = useEditor();
  const [plugins, setPlugins] = useState<PluginInstance[]>([]);
  const [allPlugins, setAllPlugins] = useState<PluginInstance[]>([]);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [, setRefresh] = useState(0);
  const dragItem = useRef<string | null>(null);

  useEffect(() => {
    const update = () => {
      const enabled = PluginRegistry.getEnabledPlugins();
      const order = data.config.pluginOrder || enabled.map(p => p.meta.id);

      const sorted = [...enabled].sort((a, b) => {
        const indexA = order.indexOf(a.meta.id);
        const indexB = order.indexOf(b.meta.id);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });

      setPlugins(sorted);
      setAllPlugins(PluginRegistry.getPlugins());
      setRefresh(prev => prev + 1);
    };

    update();
    return PluginRegistry.subscribe(update);
  }, [data.config.pluginOrder]);

  const handleDragStart = (id: string) => {
    dragItem.current = id;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    const draggedId = dragItem.current;
    if (!draggedId || draggedId === targetId) return;

    const currentOrder = plugins.map(p => p.meta.id);
    const fromIndex = currentOrder.indexOf(draggedId);
    const toIndex = currentOrder.indexOf(targetId);

    const newOrder = [...currentOrder];
    newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, draggedId);

    setPluginOrder(newOrder);
    dragItem.current = null;
  };

  const handleToggle = (id: string) => {
    PluginRegistry.toggle(id);
  };


  return (
    <div className={`sidebar-right ${!isRightSidebarOpen ? 'closed' : ''}`}>
      <div className="sidebar-right-header">
        <h2>Goals & Insights</h2>
        <div className="spacer" />
        <button
          className="marketplace-btn"
          onClick={() => setShowMarketplace(true)}
          title="Plugin Marketplace"
        >
          <Store size={18} />
        </button>

      </div>

      <div className="plugins-list">
        {plugins.map((p) => (
          <div
            key={p.meta.id}
            className="plugin-draggable-container"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(p.meta.id)}
          >
            <div
              className="plugin-drag-handle"
              draggable
              onDragStart={() => handleDragStart(p.meta.id)}
            >
              <GripHorizontal size={16} />
            </div>
            <div className="plugin-container">
              {p.render()}
            </div>
          </div>
        ))}
        {plugins.length === 0 && (
          <div className="empty-plugins">
            <p>No active plugins.</p>
          </div>
        )}
      </div>

      {showMarketplace && (
        <div className="marketplace-modal-overlay" onClick={() => setShowMarketplace(false)}>
          <div className="marketplace-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Plugin Marketplace</h2>
              <button className="close-btn" onClick={() => setShowMarketplace(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p className="market-desc">Enhance your editor by enabling client-side plugins instantly.</p>
              <ul className="settings-list">
                {allPlugins.map(p => (
                  <li key={p.meta.id} className="setting-item">
                    <div className="setting-info">
                      <span className="setting-name">{p.meta.name}</span>
                      <span className="setting-desc">{p.meta.description}</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={PluginRegistry.isEnabled(p.meta.id)}
                        onChange={() => handleToggle(p.meta.id)}
                      />
                      <span className="slider"></span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
