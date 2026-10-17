import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TodoItem, RootStackParamList } from '../types/todo';

interface TodoContextType {
  todos: TodoItem[];
  addTodo: (todoData: Omit<TodoItem, 'id' | 'createdAt'>) => string;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  getTodoById: (id: string) => TodoItem | undefined;
  getAdjacentTaskIds: (currentId: string) => { prevId: string | null; nextId: string | null };
}

const initialSampleTodos: TodoItem[] = [
  {
    id: '1',
    title: 'Review React Native CLI Setup',
    description: 'Ensure Android development environment, emulator, and dependencies are working properly.',
    completed: true,
    priority: 'high',
    category: 'Work',
    createdAt: new Date(Date.now() - 3600000 * 4).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: '2',
    title: 'Implement Forward & Back Navigation',
    description: 'Provide Stack navigation with back headers, back buttons, and next/prev task browsing.',
    completed: false,
    priority: 'high',
    category: 'Work',
    createdAt: new Date(Date.now() - 3600000 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: '3',
    title: 'Buy Groceries',
    description: 'Pick up fruits, vegetables, almond milk, and coffee beans.',
    completed: false,
    priority: 'medium',
    category: 'Shopping',
    createdAt: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: '4',
    title: '30-minute Evening Jog',
    description: 'Run around the neighborhood park to hit the 5,000 steps daily fitness goal.',
    completed: false,
    priority: 'low',
    category: 'Health',
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<TodoItem[]>(initialSampleTodos);

  const addTodo = (todoData: Omit<TodoItem, 'id' | 'createdAt'>): string => {
    const newId = Date.now().toString();
    const newTodo: TodoItem = {
      ...todoData,
      id: newId,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setTodos(prev => [newTodo, ...prev]);
    return newId;
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const getTodoById = (id: string) => {
    return todos.find(t => t.id === id);
  };

  const getAdjacentTaskIds = (currentId: string) => {
    const currentIndex = todos.findIndex(t => t.id === currentId);
    if (currentIndex === -1) {
      return { prevId: null, nextId: null };
    }
    const prevId = currentIndex > 0 ? todos[currentIndex - 1].id : null;
    const nextId = currentIndex < todos.length - 1 ? todos[currentIndex + 1].id : null;
    return { prevId, nextId };
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        getTodoById,
        getAdjacentTaskIds,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};
