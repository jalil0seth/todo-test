import { StateCreator } from 'zustand';

export interface AudioSlice {
  audioPlaying: boolean;
  audioVolume: number;
  audioActions: {
    setAudioPlaying: (playing: boolean) => void;
    setAudioVolume: (volume: number) => void;
  };
}

export const createAudioSlice: StateCreator<AudioSlice & any> = (set) => ({
  audioPlaying: false,
  audioVolume: 0.5,
  audioActions: {
    setAudioPlaying: (playing) =>
      set({ audioPlaying: playing }),

    setAudioVolume: (volume) =>
      set({ audioVolume: volume }),
  },
});