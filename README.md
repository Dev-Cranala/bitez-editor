# 🖋️ Bitez Editor

**A High-Performance, Plugin-Ready Writing Engine for Modern Storytellers.**

Bitez Editor is a modular, React-based text editor SDK designed specifically for long-form content. It prioritizes **speed**, **extensibility**, and **focus** through a lazy-loading architecture and a robust plugin ecosystem.

---

## ✨ Key Features

- **🚀 Performance First**: Native Lazy-Loading for content. Open a sidebar with 100+ chapters instantly—only the chapter you are editing is loaded into memory.
- **🔌 Plugin SDK**: Every major feature (Task Manager, Word Count, Calendar) is a plugin. Add your own React components in seconds.
- **☁️ Storage Adapters**: Pluggable storage system. Swap between `LocalStorage`, `Google Drive`, or your own Rest API with a single prop.
- **🎨 Elite UI/UX**: Professional dark theme, drag-and-drop reorderable plugins, and instant global search.
- **📦 Library Ready**: Built to be consumed as a dependency in your own writing apps.

---

## 🚀 Quick Start

### 1. Installation

```bash
npm install bitez-editor
# or
pnpm add bitez-editor
```

### 2. Basic Usage

```tsx
import { EditorProvider, Editor, SidebarLeft, SidebarRight } from 'bitez-editor';
import { LocalStorageAdapter } from 'bitez-editor/adapters';
import 'bitez-editor/style.css';

function MyWritingApp() {
  return (
    <EditorProvider adapter={LocalStorageAdapter} maxStories={100}>
      <div className="layout">
        <SidebarLeft />
        <Editor />
        <SidebarRight />
      </div>
    </EditorProvider>
  );
}
```

---

## 🔌 Building a Plugin

Every tool in the right sidebar is a `PluginInstance`. You can create your own:

```tsx
import { PluginRegistry } from 'bitez-editor';

const MyAIPLugin = {
  meta: {
    id: 'ai-helper',
    name: 'AI Writing Assistant',
    description: 'Get suggestions as you write.',
    defaultEnabled: true
  },
  render: () => <MyAIComponent />
};

// Register once at app start
PluginRegistry.register(MyAIPLugin);
```

---

## 🛠️ Storage Adapters

Implement the `IStorageAdapter` interface to save data anywhere:

```tsx
class FirebaseAdapter implements IStorageAdapter {
  async save(data: EditorData) { /* Your Firebase logic */ }
  async load(): Promise<EditorData> { /* ... */ }
  async loadStory(id: string): Promise<string> { /* ... */ }
}
```

---

## 🤝 Contributing

Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.


## �️ Development Setup

This project uses `pnpm` for package management.

### Setup

```bash
pnpm install
```

### Build Library

```bash
pnpm run build:lib
```

### Run Playground

To test your changes in a real React application:

```bash
cd playground
pnpm install
pnpm dev
```

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ for authors.
