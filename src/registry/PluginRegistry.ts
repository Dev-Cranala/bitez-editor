import type { ReactNode } from 'react';

export interface PluginMeta {
  id: string;
  name: string;
  description: string;
  icon?: ReactNode;
  defaultEnabled?: boolean;
}

export interface PluginInstance {
  meta: PluginMeta;
  render: () => ReactNode;
}

class Registry {
  private plugins: Map<string, PluginInstance> = new Map();
  private enabledPlugins: Set<string> = new Set();
  private listeners: Set<() => void> = new Set();

  register(plugin: PluginInstance) {
    this.plugins.set(plugin.meta.id, plugin);
    if (plugin.meta.defaultEnabled !== false) {
      this.enabledPlugins.add(plugin.meta.id);
    }
    this.notify();
  }

  getPlugins(): PluginInstance[] {
    return Array.from(this.plugins.values());
  }

  getEnabledPlugins(): PluginInstance[] {
    return this.getPlugins().filter(p => this.enabledPlugins.has(p.meta.id));
  }

  isEnabled(id: string): boolean {
    return this.enabledPlugins.has(id);
  }

  enable(id: string) {
    if (this.plugins.has(id)) {
      this.enabledPlugins.add(id);
      this.notify();
    }
  }
  
  toggle(id: string) {
    if (this.isEnabled(id)) {
      this.disable(id);
    } else {
      this.enable(id);
    }
  }

  disable(id: string) {
    if (this.plugins.has(id)) {
      this.enabledPlugins.delete(id);
      this.notify();
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const PluginRegistry = new Registry();
