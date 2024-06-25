import { TrackCue } from './types';

export const getCurrentTimeTrackCueIndex = (trackCues: TrackCue[], currentTime: number): number => {
  return trackCues.findIndex((cue) => currentTime >= cue.startTime && currentTime < cue.endTime);
};
