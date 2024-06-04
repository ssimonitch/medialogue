'use client';

import { FunctionComponent, ChangeEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import usePlaybackVectors from '@/app/components/VideoPlayer/hooks/usePlaybackVectors';

import { useVideoStateDispatch, useVideoState } from '@/app/contexts/VideoStateContextProvider';
import { useTrackCuesDispatch } from '@/app/contexts/TrackCuesContextProvider';
import { TrackCue } from '@/app/components/TrackCues/types';

import Container from '@/app/components/VideoPlayer/components/Container';
import Controls from '@/app/components/VideoPlayer/components/Controls';
import Slider, { SlideOnChangeHandler } from '@/app/components/VideoPlayer/components/Slider';
import Video from '@/app/components/VideoPlayer/components/Video';

const autoPlay = false;

export type VideoState = {
  playing: boolean;
  muted: boolean;
  volume: number;
  seeking: boolean;
};

type VideoPlayerProps = {
  trackCues: TrackCue[];
};

const VideoPlayer: FunctionComponent<VideoPlayerProps> = ({ trackCues }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoState = useVideoState();
  const videoDispatch = useVideoStateDispatch();
  // const trackCuesDispatch = useTrackCuesDispatch();

  // set up track cues and playback vectors
  // const [_, _, determineActiveTrackCueIndex] = useTrackCues(videoRef);
  const [playbackVector, endTimeSeconds] = usePlaybackVectors(videoRef);
  const [trackCueIndexVector, setTrackCueIndexVector] = useState<{ second: number; index: number }[]>([]);
  useEffect(() => {
    if (trackCues.length === 0 || playbackVector.length === 0) return;
    const cueStartTimes = trackCues.map(({ startTime }) => startTime);
    const cueIndexVector = playbackVector.map((_, second) => ({
      second,
      index: cueStartTimes.findIndex((cueStartTime) => Math.floor(cueStartTime) === second),
    }));
    setTrackCueIndexVector(cueIndexVector);
  }, [playbackVector, trackCues]);

  // manual autoplay implementation
  useEffect(() => {
    if (!autoPlay) return;
    const handlePlay = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
          const isPlaying = !videoRef.current.paused;
          videoDispatch({ type: 'SET_PLAYING', playing: isPlaying });
        } catch (error) {
          // will throw an error if the video is not allowed to autoplay
          videoDispatch({ type: 'SET_PLAYING', playing: false });
        }
      }
    };
    handlePlay();
  }, [videoRef, videoDispatch]);

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      const isPaused = videoRef.current.paused;
      isPaused ? videoRef.current.play() : videoRef.current.pause();
      videoDispatch({ type: 'SET_PLAYING', playing: isPaused });
    }
  }, [videoDispatch]);

  const handleStop = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoDispatch({ type: 'SET_PLAYING', playing: false });
    }
  }, [videoDispatch]);

  const handleVolumeChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const newVolume = Number(event.target.value);
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
        videoDispatch({ type: 'SET_VOLUME', volume: newVolume });
      }
    },
    [videoDispatch],
  );

  const handleSliderChange: SlideOnChangeHandler = useCallback(
    (_, value) => {
      if (videoRef.current && typeof value === 'number') {
        videoRef.current.currentTime = value;
        videoDispatch({ type: 'SET_CURRENT_TIME', currentTime: value });
      }
    },
    [videoDispatch],
  );

  const handleTimeUpdate: ChangeEventHandler<HTMLVideoElement> = useCallback(
    (event) => {
      const currentTime = event.target.currentTime;
      videoDispatch({ type: 'SET_CURRENT_TIME', currentTime });
    },
    [videoDispatch],
  );

  return (
    <Container
      Controls={
        <Controls
          playing={videoState.playing}
          volume={videoState.volume}
          handlePlayPause={handlePlayPause}
          handleStop={handleStop}
          handleVolumeChange={handleVolumeChange}
        />
      }
      Slider={<Slider endTimeSeconds={endTimeSeconds} handleSliderChange={handleSliderChange} />}
      Video={
        <Video
          src="/demo/video-1.mp4"
          muted={videoState.muted}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          ref={videoRef}
        />
      }
    />
  );
};

export default VideoPlayer;
