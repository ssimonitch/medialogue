'use client';

import { FunctionComponent, memo } from 'react';
import { VideoState, VideoStateHandlers } from '@/app/components/VideoPlayer/hooks/useVideoState';

type VideoControlsProps = Pick<VideoState, 'playing' | 'volume'> &
  Pick<VideoStateHandlers, 'handlePlayPause' | 'handleStop' | 'handleVolumeChange'>;

const Controls: FunctionComponent<VideoControlsProps> = ({
  playing,
  volume,
  handleVolumeChange,
  handlePlayPause,
  handleStop,
}) => {
  console.log('::VideoControls rendered::');
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
