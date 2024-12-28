export type Priority = 'high' | 'medium' | 'low';
export type Status = 'backlog' | 'focus' | 'later' | 'completed';

export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  subtasks: SubTask[];
  createdAt: Date;
  comments: Comment[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}