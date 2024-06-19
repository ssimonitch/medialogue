'use client';

import { FunctionComponent, ChangeEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import usePlaybackStepVector from '@/app/components/VideoPlayer/hooks/usePlaybackStepVector';

import { useVideoStateDispatch } from '@/app/contexts/VideoStateContextProvider';
import useInitializeTrackCues from '@/app/components/TrackCues/hooks/useInitializeTrackCues';

import Container from '@/app/components/VideoPlayer/components/Container';
import Controls from '@/app/components/VideoPlayer/components/Controls';
import Slider, { SlideOnChangeHandler } from '@/app/components/VideoPlayer/components/Slider';
import Video from '@/app/components/VideoPlayer/components/Video';

import { CUE_TIME_DIGITS, STEP_GRANULARITY } from './constants';

const autoPlay = false;

export type VideoState = {
  playing: boolean;
  muted: boolean;
  volume: number;
  seeking: boolean;
};

const VideoPlayer: FunctionComponent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // initialize track cues, playback vector, and map of track cue indices to playback vector
  const trackCues = useInitializeTrackCues(videoRef);
  const [playbackStepVector, endStep] = usePlaybackStepVector(videoRef);
  const [trackCueIndices, setTrackCueIndices] = useState<{ step: number; index: number }[]>([]);

  useEffect(() => {
    if (trackCues.length === 0 || playbackStepVector.length === 0) return;

    // normalize the cue start times to the same precision as the playback vector
    const normalizedCueStartTimes = trackCues.map(({ startTime }) => startTime);

    // create mapping of playback step to track cue index
    const normalizedCueIndices = playbackStepVector
      .map((_, step) => {
        // normalize the step to the same precision as the cue start times
        const normalizedStep = step * STEP_GRANULARITY;
        // Offset by one step to ensure that when the user clicks a cue mark there is a enough time for them to read the cue
        // before the video and audio reach that point. This could be good to expose as a control in the future.
        const offsetNormalizedStep = normalizedStep - STEP_GRANULARITY;
        return {
          step: Number(offsetNormalizedStep.toFixed(CUE_TIME_DIGITS)),
          // get the index of the cue for this step
          index: normalizedCueStartTimes.findIndex(
            (cueStartTime) => cueStartTime.toFixed(CUE_TIME_DIGITS) === normalizedStep.toFixed(CUE_TIME_DIGITS),
          ),
        };
      })
      .filter(({ index }) => index !== -1);

    setTrackCueIndices(normalizedCueIndices);
  }, [playbackStepVector, trackCues]);

  const videoDispatch = useVideoStateDispatch();

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
    (value) => {
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
        <Controls handlePlayPause={handlePlayPause} handleStop={handleStop} handleVolumeChange={handleVolumeChange} />
      }
      Slider={
        <Slider
          max={endStep}
          marks={trackCueIndices.map((vector) => ({ label: vector.index + 1, value: vector.step }))}
          onChange={handleSliderChange}
        />
      }
      Video={<Video src="/demo/video-1.mp4" playsInline onTimeUpdate={handleTimeUpdate} ref={videoRef} />}
    />
  );
};

export default VideoPlayer;
