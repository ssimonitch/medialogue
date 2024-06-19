'use client';

import { FunctionComponent, memo, ChangeEventHandler } from 'react';
import { useVideoStateContext } from '@/app/contexts/VideoStateContextProvider';

type VideoControlsProps = {
  handlePlayPause: () => void;
  handleStop: () => void;
  handleVolumeChange: ChangeEventHandler<HTMLInputElement>;
};

const Controls: FunctionComponent<VideoControlsProps> = ({ handleVolumeChange, handlePlayPause, handleStop }) => {
  const { playing, volume } = useVideoStateContext();
  return (
    <>
      <button className="rounded bg-blue-200 px-2 text-white" onClick={handlePlayPause}>
        {playing ? 'Pause' : 'Play'}
      </button>
      <button className="rounded bg-blue-200 px-2 text-white" onClick={handleStop}>
        Stop
      </button>
      <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} />
    </>
  );
};

export default memo(Controls);
