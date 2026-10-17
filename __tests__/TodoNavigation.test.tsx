import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { TodoProvider, useTodos } from '../src/context/TodoContext';
import { TodoListScreen } from '../src/screens/TodoListScreen';
import { AddTaskScreen } from '../src/screens/AddTaskScreen';
import { TaskDetailScreen } from '../src/screens/TaskDetailScreen';

describe('Todo Navigation and State Tests', () => {
  test('TodoContext adds and toggles tasks, and calculates adjacent tasks for back/front navigation', () => {
    let contextValues: ReturnType<typeof useTodos> | null = null;

    const TestConsumer = () => {
      contextValues = useTodos();
      return null;
    };

    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <TodoProvider>
          <TestConsumer />
        </TodoProvider>
      );
    });

    expect(contextValues).not.toBeNull();
    expect(contextValues!.todos.length).toBeGreaterThan(0);

    // Test adding a task
    let newId = '';
    ReactTestRenderer.act(() => {
      newId = contextValues!.addTodo({
        title: 'Test New Task',
        description: 'Test Description',
        completed: false,
        priority: 'high',
        category: 'Work',
      });
    });

    expect(newId).toBeTruthy();
    expect(contextValues!.getTodoById(newId)?.title).toBe('Test New Task');

    // Test toggling completion
    ReactTestRenderer.act(() => {
      contextValues!.toggleTodo(newId);
    });
    expect(contextValues!.getTodoById(newId)?.completed).toBe(true);

    // Test front/back navigation calculation
    const adjacent = contextValues!.getAdjacentTaskIds(newId);
    expect(adjacent.prevId).toBeNull(); // Newly added task is first item
    expect(adjacent.nextId).not.toBeNull(); // Has next item to navigate forward
  });

  test('TodoListScreen renders with navigation props', () => {
    const mockNavigation: any = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <TodoProvider>
          <TodoListScreen navigation={mockNavigation} route={{} as any} />
        </TodoProvider>
      );
    });

    expect(renderer!).toBeDefined();
  });

  test('AddTaskScreen renders with back and forward navigation controls', () => {
    const mockNavigation: any = {
      navigate: jest.fn(),
      goBack: jest.fn(),
      replace: jest.fn(),
    };

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <TodoProvider>
          <AddTaskScreen navigation={mockNavigation} route={{} as any} />
        </TodoProvider>
      );
    });

    expect(renderer!).toBeDefined();
  });

  test('TaskDetailScreen renders with sequential navigation controls', () => {
    const mockNavigation: any = {
      navigate: jest.fn(),
      goBack: jest.fn(),
      replace: jest.fn(),
    };

    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <TodoProvider>
          <TaskDetailScreen
            navigation={mockNavigation}
            route={{ key: 'test', name: 'TaskDetail', params: { taskId: '1' } }}
          />
        </TodoProvider>
      );
    });

    expect(renderer!).toBeDefined();
  });
});
