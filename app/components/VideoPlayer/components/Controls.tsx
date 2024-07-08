import { FunctionComponent, memo, ChangeEventHandler, RefObject } from 'react';
import { useVideoStateContext, useVideoStateDispatch } from '@/app/contexts/VideoStateContextProvider';

import Switch from '../../base/Switch';

type VideoControlsProps = {
  videoRef: RefObject<HTMLVideoElement>;
};

const Controls: FunctionComponent<VideoControlsProps> = ({ videoRef }) => {
  const { playing, volume, pauseOnCueExit } = useVideoStateContext();
  const videoStateDispatch = useVideoStateDispatch();

  const handlePlayPause = () => {
    if (videoRef.current) {
      const isPaused = videoRef.current.paused;
      isPaused ? videoRef.current.play() : videoRef.current.pause();
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleVolumeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newVolume = Number(event.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleTogglePauseOnCueExit = () => {
    videoStateDispatch({ type: 'TOGGLE_PAUSE_ON_CUE_EXIT' });
  };

  return (
    <>
      <div className="flex-grow">
        <button className="rounded bg-blue-200 px-2 text-white" onClick={handlePlayPause}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <button className="rounded bg-blue-200 px-2 text-white" onClick={handleStop}>
          Stop
        </button>
        <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} />
      </div>
      <div>
        <Switch checked={pauseOnCueExit} onChange={handleTogglePauseOnCueExit} />
      </div>
    </>
  );
};

export default memo(Controls);
