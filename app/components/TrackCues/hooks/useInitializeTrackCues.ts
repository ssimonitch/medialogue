import { useState, useEffect, useCallback, useRef, RefObject } from 'react';

import { getIsTrackCueActive } from '@/app/components/TrackCues/helpers';
import { TrackCue } from '@/app/components/TrackCues/types';
import { useTrackCuesDispatch } from '@/app/contexts/TrackCuesContextProvider';
import { useVideoStateContext } from '@/app/contexts/VideoStateContextProvider';
import { useTrackCuesContext } from '@/app/contexts/TrackCuesContextProvider';

type DetermineActiveTrackCueIndexHandler = (currentTime: number) => void;
type UseInitializeTrackCuesReturn = TrackCue[];

const useInitializeTrackCues = (videoRef: RefObject<HTMLVideoElement>): UseInitializeTrackCuesReturn => {
  const { currentTime } = useVideoStateContext();
  const { trackCues } = useTrackCuesContext();
  const trackCuesDispatch = useTrackCuesDispatch();

  /**
   * Use a ref to store the active index for reference in the timeupdate event handler.
   * This is done to avoid re-running the effect every time the value updates
   */
  const trackCueActiveIndexRef = useRef<number>(-1);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return trackCuesDispatch({ type: 'SET_TRACK_CUES', trackCues: [] });

    const mainTextTrack = videoElement.textTracks[0];
    if (!mainTextTrack) return trackCuesDispatch({ type: 'SET_TRACK_CUES', trackCues: [] });

    const cues = mainTextTrack.cues;
    if (!cues) return trackCuesDispatch({ type: 'SET_TRACK_CUES', trackCues: [] });

    const parsedTrackCues = [];

    for (let index = 0; index < cues.length; index++) {
      const cue = cues[index];
      if (cue instanceof VTTCue) {
        parsedTrackCues.push({ id: cue.id, text: cue.text, startTime: cue.startTime, endTime: cue.endTime });
      } else {
        throw new Error(`Unsupported cue type: ${cue.constructor.name}`);
      }
    }

    trackCuesDispatch({ type: 'SET_TRACK_CUES', trackCues: parsedTrackCues });
  }, [videoRef, trackCuesDispatch]);

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
      trackCuesDispatch({ type: 'SET_ACTIVE_TRACK_CUE_INDEX', index: nextTrackCueActiveIndex });
    },
    [trackCues, trackCuesDispatch],
  );

  useEffect(() => {
    determineActiveTrackCueIndex(currentTime);
  }, [currentTime, determineActiveTrackCueIndex]);

  return trackCues;
};

export default useInitializeTrackCues;
