export interface Task {
  id: string;
  text: string;
  completed: boolean;
  children?: Task[];
}

export interface Section {
  id: string;
  title: string;
  tasks: Task[];
  tags?: string[];
}

export interface DailyGoal {
  id: string;
  text: string;
  completed: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}