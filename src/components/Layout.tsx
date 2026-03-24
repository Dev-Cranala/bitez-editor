import { SidebarLeft } from './SidebarLeft';
import { Editor } from './Editor';
import { SidebarRight } from './SidebarRight';
import { EditorProvider } from '../context/EditorContext';
import { PluginRegistry } from '../registry/PluginRegistry';
import { WordCountPlugin } from '../plugins/WordCountPlugin';
import { TodoPlugin } from '../plugins/TodoPlugin';
import { CalendarPlugin } from '../plugins/CalendarPlugin';

// Initialize plugins
PluginRegistry.register(CalendarPlugin);
PluginRegistry.register(WordCountPlugin);
PluginRegistry.register(TodoPlugin);

export const Layout = () => {
  return (
    <EditorProvider>
      <LayoutContent />
    </EditorProvider>
  );
};

const LayoutContent = () => {
  return (
    <div className="app-container">
      <SidebarLeft />
      <Editor />
      <SidebarRight />
    </div>
  );
};
