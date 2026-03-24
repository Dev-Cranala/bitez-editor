import { useState } from 'react';
import type { PluginInstance } from '../registry/PluginRegistry';
import { CheckSquare, Plus, Trash2, ListChecks } from 'lucide-react';
import { useEditor } from '../hooks/useEditor';

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

const TodoWidget = () => {
  const { data, updatePluginConfig } = useEditor();
  const [newTodo, setNewTodo] = useState('');
  
  const todos: Todo[] = data.config.plugins['todo-manager'] || [];

  const setTodos = (newTodos: Todo[]) => {
    updatePluginConfig('todo-manager', newTodos);
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now().toString(), text: newTodo.trim(), done: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="plugin-widget">
      <div className="plugin-header">
        <CheckSquare size={16} />
        <h3>Tasks</h3>
      </div>
      <div className="plugin-body">
        <form onSubmit={addTodo} className="todo-form">
          <input 
            type="text" 
            value={newTodo} 
            onChange={(e) => setNewTodo(e.target.value)} 
            placeholder="Add new task..."
          />
          <button type="submit"><Plus size={16} /></button>
        </form>
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className={todo.done ? 'done' : ''}>
              <button 
                className="todo-check" 
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.done ? <CheckSquare size={14} className="checked-icon"/> : <div className="unchecked-box"/>}
              </button>
              <span className="todo-text">{todo.text}</span>
              <button className="todo-delete" onClick={() => deleteTodo(todo.id)}>
                <Trash2 size={14} />
              </button>
            </li>
          ))}
          {todos.length === 0 && (
            <div className="empty-state">
              <ListChecks size={32} opacity={0.2} strokeWidth={1.5} style={{ marginBottom: '12px' }} />
              <p>Your task list is empty.<br/>Add a goal to stay focused!</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export const TodoPlugin: PluginInstance = {
  meta: {
    id: 'todo-manager',
    name: 'Task Manager',
    description: 'A simple todo list to track goals.',
    defaultEnabled: true,
  },
  render: () => <TodoWidget />
};
