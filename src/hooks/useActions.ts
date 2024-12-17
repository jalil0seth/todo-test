import { useStore } from '../store/useStore';

export const useActions = () => {
  const store = useStore();
  
  return {
    ...store.taskActions,
    ...store.sectionActions,
    ...store.goalActions,
    ...store.audioActions,
  };
};