import { useState, useEffect, useCallback, useRef, RefObject } from 'react';

import { getIsTrackCueActive } from '@/app/components/TrackCues/helpers';
import { TrackCue } from '@/app/components/TrackCues/types';

type DetermineActiveTrackCueIndexHandler = (currentTime: number) => number | undefined;
type UseTrackCuesReturn = [TrackCue[], number, DetermineActiveTrackCueIndexHandler];

const useTrackCues = (videoRef: RefObject<HTMLVideoElement>): UseTrackCuesReturn => {
  const [trackCues, setTrackCues] = useState<TrackCue[]>([]);
  const [activeTrackCueIndex, setActiveTrackCueIndex] = useState<number>(-1);

  /**
   * Use a ref to store the active index for reference in the timeupdate event handler.
   * This is done to avoid re-running the effect every time the value updates
   */
  const trackCueActiveIndexRef = useRef<number>(-1);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return setTrackCues([]);

    const mainTextTrack = videoElement.textTracks[0];
    if (!mainTextTrack) return setTrackCues([]);

    const cues = mainTextTrack.cues;
    if (!cues) return setTrackCues([]);

    const parsedTrackCues = [];

    for (let index = 0; index < cues.length; index++) {
      const cue = cues[index];
      if (cue instanceof VTTCue) {
        parsedTrackCues.push({ id: cue.id, text: cue.text, startTime: cue.startTime, endTime: cue.endTime });
      } else {
        throw new Error(`Unsupported cue type: ${cue.constructor.name}`);
      }
    }

    setTrackCues(parsedTrackCues);
  }, [videoRef]);

  /**
   * Handle the timeupdate event on the video element to determine the active track cue
   */
  const determineActiveTrackCueIndex = useCallback<DetermineActiveTrackCueIndexHandler>(
    (currentTime) => {
      if (trackCues.length === 0) return;

      // If the current cue is still active, do nothing
      const activeTrackCue = trackCues[trackCueActiveIndexRef.current];
      if (activeTrackCue && getIsTrackCueActive(activeTrackCue, currentTime)) {
        return;
      }

      let nextTrackCueActiveIndex = -1;

      // As an optimization, we can start searching from the last active track cue as most users
      // will be watching in order.
      if (trackCueActiveIndexRef.current > 0 && activeTrackCue.endTime < currentTime) {
        nextTrackCueActiveIndex = trackCues
          .slice(trackCueActiveIndexRef.current)
          .findIndex((trackCue) => getIsTrackCueActive(trackCue, currentTime));
      }

      // Otherwise search from the start
      if (nextTrackCueActiveIndex === -1) {
        nextTrackCueActiveIndex = trackCues.findIndex((trackCue) => getIsTrackCueActive(trackCue, currentTime));
      }

      trackCueActiveIndexRef.current = nextTrackCueActiveIndex;
      // setActiveTrackCueIndex(nextTrackCueActiveIndex);
      return nextTrackCueActiveIndex;
    },
    [trackCues],
  );

  return [trackCues, activeTrackCueIndex, determineActiveTrackCueIndex];
};

export default useTrackCues;
