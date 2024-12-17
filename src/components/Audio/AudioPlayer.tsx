import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Play, Pause, Volume2 } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';

export const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { audioPlaying, audioVolume, actions } = useStore();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume;
    }
  }, [audioVolume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      actions.setAudioPlaying(!audioPlaying);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-8">
      <h2 className="text-xl font-bold mb-4">Background Music</h2>
      <audio
        ref={audioRef}
        src="https://megastar-cope-rrcast.flumotion.com/cope/megastar.mp3"
        loop
      />
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {audioPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Volume2 className="w-5 h-5" />
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[audioVolume]}
            onValueChange={([value]) => actions.setAudioVolume(value)}
            max={1}
            step={0.1}
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
              <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none" />
          </Slider.Root>
        </div>
      </div>
    </div>
  );
};