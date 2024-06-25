import { useEffect, RefObject, useState } from 'react';

import { useVideoStateContext, useVideoStateDispatch } from '@/app/contexts/VideoStateContextProvider';

import { TrackCue } from '@/app/components/TrackCues/types';

type UseInitializeTrackCuesReturn = [TrackCue[]];

const useInitializeTrackCues = (videoRef: RefObject<HTMLVideoElement>): UseInitializeTrackCuesReturn => {
  const [trackCues, setTrackCues] = useState<TrackCue[]>([]);

  const { pauseOnCueExit } = useVideoStateContext();
  const videoStateDispatch = useVideoStateDispatch();

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return setTrackCues([]);

    const mainTextTrack = videoElement.textTracks[0];
    if (!mainTextTrack) return setTrackCues([]);

    const cues = mainTextTrack.cues;
    if (!cues) return setTrackCues([]);

    // hide the track so we can render custom UI
    mainTextTrack.mode = 'hidden';

    const cuesArray = Array.from(cues);
    const parsedTrackCues = [];

    for (const cue of cuesArray) {
      if (cue instanceof VTTCue) {
        cue.pauseOnExit = pauseOnCueExit;
        parsedTrackCues.push({ id: cue.id, text: cue.text, startTime: cue.startTime, endTime: cue.endTime });
      } else {
        // none of this will work unless we use VTT
        throw new Error(`Unsupported cue type: ${cue.constructor.name}`);
      }
    }

    mainTextTrack.oncuechange = () => {
      console.log('cue change');
      const activeCues = mainTextTrack.activeCues;
      const isPaused = videoElement.paused;

      if (!activeCues || activeCues.length === 0) {
        // if we are using pauseOnCueExit don't actually unset the active track cue index when paused
        // this will allow the user to read the cue before the video resumes
        return pauseOnCueExit && isPaused
          ? undefined
          : videoStateDispatch({ type: 'SET_ACTIVE_TRACK_CUE_INDEX', activeTrackCueIndex: -1 });
      }

      const activeCue = activeCues[0];
      if (activeCue instanceof VTTCue) {
        const currentIndex = cuesArray.findIndex((cue) => cue.id === activeCue.id);
        videoStateDispatch({ type: 'SET_ACTIVE_TRACK_CUE_INDEX', activeTrackCueIndex: currentIndex });
      }
    };

    setTrackCues(parsedTrackCues);
  }, [videoRef, pauseOnCueExit, videoStateDispatch]);

  return [trackCues];
};

export default useInitializeTrackCues;
