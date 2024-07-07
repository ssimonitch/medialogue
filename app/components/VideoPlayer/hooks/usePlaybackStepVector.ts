import { useState, useEffect, useCallback, RefObject } from 'react';
import { PRECISION_FACTOR, STEP_GRANULARITY } from '@/app/components/VideoPlayer/constants';

type UsePlaybackVectorReturn = [number[], number];

const usePlaybackStepVector = (videoRef: RefObject<HTMLVideoElement>): UsePlaybackVectorReturn => {
  const [playbackStepVector, setPlaybackVector] = useState<number[]>([]);
  const [endStep, setEndStep] = useState<number>(0);

  /**
  * Slice up the duration of the video so that
  each second of playback can be accounted for individually
  
  We can then send this to a tracker when either the video changes or
  on the window.unload function
  */
  const determinePlaybackVector = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // `player.seekable` returns a time range containing the start and the end of what is seekable
    const timeRanges = videoElement.seekable;

    if (!timeRanges || timeRanges.length === 0) return;

    const start = timeRanges.start(0);
    const end = Math.ceil(timeRanges.end(0));
    setEndStep(end);

    // Zero fill the playback vector to the length of the current video duration
    const length =
      Number.isInteger(end) && Number.isInteger(start)
        ? end - start
        : // fallback in case seekable not supported
          Math.ceil(videoElement.duration);

    // expand the vector to the total number of seconds in the video, multiplied by the inverse of the step granularity
    // to allow enough room for each step to be accounted for in the vector
    const vector = new Array(length * PRECISION_FACTOR).fill(0);

    setPlaybackVector(vector);
  }, [videoRef]);

  useEffect(() => determinePlaybackVector(), [determinePlaybackVector]);

  return [playbackStepVector, endStep];
};

export default usePlaybackStepVector;
