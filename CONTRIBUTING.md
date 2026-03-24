# Contributing to Bitez Editor 🖋️

Thanks for taking the time to contribute to **Bitez Editor**! 

Whether you're fixing a bug, improving the UI, or adding a new plugin, we're glad you're here. This guide will help you get started with our professional story editor SDK.

---

## 🛠️ Development Setup

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   pnpm install
   ```
3. **Run the development server**
   ```bash
   pnpm dev
   ```
   This will start a demo application that lives in `src/App.tsx`.

---

## 🏗️ Project Architecture

Bitez Editor follows a **Registry Pattern**:
- **`src/context`**: Core state management and the "Bitez Editor Engine."
- **`src/registry`**: The manual for your right-sidebar. All plugins must be registered here.
- **`src/adapters`**: The logic for persistence. Any new storage method (like a new cloud provider) belongs here.
- **`src/plugins`**: Each plugin is a standalone React component.

---

## 🔌 Guidelines for Adding a Plugin

A plugin should be focused on one single author need (e.g. "Focus Mode", "Word Count", "AI Suggestions").

1.  Create a file in `src/plugins/MyNewPlugin.tsx`.
2.  Define the `meta` information (ID, name, description).
3.  Implement the `render` function as a React component.
4.  **Register it** in `src/main.tsx` for the demo app, or export it from `src/index.ts`.
5.  **Use Persistent State**: Use the `useEditor` hook's `updatePluginConfig` to save your plugin's data.

---

## 🎨 UI & Styling

To maintain a premium, professional feel:
- Use **CSS Variables** defined in `index.css` (e.g., `--accent-blue`, `--bg-sidebar-dark`).
- Stick to a **Modular, Dark-Oriented** design. 
- Ensure all interactive elements have proper `hover` and `active` states.
- Follow the 1rem (16px) grid system for alignment.

---

## 🚀 Submitting Changes

1. Create a branch: `feature/your-cool-feature`.
2. Commit your changes.
3. Push to your branch and open a Pull Request.

**Happy Coding!** 🖋️🚀
