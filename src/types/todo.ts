export type Priority = 'low' | 'medium' | 'high';
export type Category = 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Other';

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: string;
}

export type RootStackParamList = {
  TodoList: undefined;
  AddTask: undefined;
  TaskDetail: { taskId: string };
};
