import { Section } from '../types/task';

export const initialSections: Section[] = [
  {
    id: '1',
    title: '1. Morning Tasks (9:00 - 12:00)',
    tasks: [
      { id: '1-1', text: 'Daily Stand-up Meeting', completed: true },
      { id: '1-2', text: 'Code Review', completed: false },
      {
        id: '1-3',
        text: 'Bug Fixes',
        completed: false,
        children: [
          { id: '1-3-1', text: 'Fix login validation issue #423', completed: true },
          { id: '1-3-2', text: 'Address memory leak in dashboard #456', completed: false },
        ],
      },
    ],
  },
  {
    id: '2',
    title: '2. Development Tasks',
    tasks: [
      {
        id: '2-1',
        text: 'Frontend Development',
        completed: false,
        children: [
          { id: '2-1-1', text: 'Implement user dashboard layout', completed: false },
          { id: '2-1-2', text: 'Create responsive navigation', completed: true },
          { id: '2-1-3', text: 'Add form validation', completed: false },
        ],
      },
      {
        id: '2-2',
        text: 'Backend Development',
        completed: false,
        children: [
          { id: '2-2-1', text: 'API endpoint optimization', completed: true },
          { id: '2-2-2', text: 'Database query improvements', completed: false },
          { id: '2-2-3', text: 'Cache implementation', completed: true },
        ],
      },
    ],
  },
];