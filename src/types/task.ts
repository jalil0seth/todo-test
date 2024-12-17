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
}