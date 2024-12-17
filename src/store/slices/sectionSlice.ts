import { StateCreator } from 'zustand';
import { Section } from '../../types/task';
import { initialSections } from '../../data/initialData';

export interface SectionSlice {
  sections: Section[];
  pinnedSections: string[];
  sectionActions: {
    addSection: () => string;
    updateSectionTitle: (sectionId: string, newTitle: string) => void;
    deleteSection: (sectionId: string) => void;
    togglePinSection: (sectionId: string) => void;
  };
}

export const createSectionSlice: StateCreator<SectionSlice & any> = (set) => ({
  sections: initialSections,
  pinnedSections: [],
  sectionActions: {
    addSection: () => {
      const newId = generateId();
      set((state) => ({
        sections: [
          ...state.sections,
          { id: newId, title: 'New Section', tasks: [] },
        ],
      }));
      return newId;
    },

    updateSectionTitle: (sectionId, newTitle) =>
      set((state) => ({
        sections: state.sections.map((section) =>
          section.id === sectionId
            ? { ...section, title: newTitle }
            : section
        ),
      })),

    deleteSection: (sectionId) =>
      set((state) => ({
        sections: state.sections.filter((section) => section.id !== sectionId),
        pinnedSections: state.pinnedSections.filter((id) => id !== sectionId),
      })),

    togglePinSection: (sectionId) =>
      set((state) => ({
        pinnedSections: state.pinnedSections.includes(sectionId)
          ? state.pinnedSections.filter((id) => id !== sectionId)
          : [...state.pinnedSections, sectionId],
      })),
  },
});