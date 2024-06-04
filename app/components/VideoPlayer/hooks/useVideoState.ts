import { RefObject, useState, useEffect, ChangeEventHandler } from 'react';
import { SlideOnChangeHandler } from '../components/VideoPlayer/components/Slider';

export type VideoState = {
  playing: boolean;
  muted: boolean;
  volume: number;
  seeking: boolean;
};

export type VideoStateOptions = {
  autoPlay?: boolean;
};

export type VideoStateHandlers = {
  handlePlayPause: () => void;
  handleStop: () => void;
  handleVolumeChange: ChangeEventHandler<HTMLInputElement>;
  handleSliderChange: SlideOnChangeHandler;
};

type UseVideoStateReturn = [VideoState, VideoStateHandlers];

const useVideoState = (videoRef: RefObject<HTMLVideoElement>, options?: VideoStateOptions): UseVideoStateReturn => {
  const [videoState, setVideoState] = useState<VideoState>({
    playing: !!options?.autoPlay,
    muted: true,
    volume: 0.5,
    seeking: false,
  });

  // manual autoplay implementation
  useEffect(() => {
    if (!options?.autoPlay) return;
    const handlePlay = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
          const isPlaying = !videoRef.current.paused;
          setVideoState((current) => ({ ...current, playing: isPlaying }));
        } catch (error) {
          // will throw an error if the video is not allowed to autoplay
          setVideoState((current) => ({ ...current, playing: false }));
        }
      }
    };
    handlePlay();
  }, [options?.autoPlay, videoRef]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
      setVideoState((current) => ({ ...current, playing: !current.playing }));
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setVideoState((current) => ({ ...current, playing: false }));
    }
  };

  const handleVolumeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newVolume = Number(event.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVideoState((current) => ({ ...current, volume: newVolume }));
    }
  };

  const handleSliderChange: SlideOnChangeHandler = (_, value) => {
    if (videoRef.current && typeof value === 'number') {
      videoRef.current.currentTime = value;
    }
  };

  return [videoState, { handlePlayPause, handleStop, handleVolumeChange, handleSliderChange }];
};

export default useVideoState;
