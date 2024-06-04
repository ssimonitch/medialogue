import { TrackCue } from '@/app/components/TrackCues/types';

export const getIsTrackCueActive = ({ startTime, endTime }: TrackCue, currentTime: number) => {
  return startTime <= currentTime && endTime >= currentTime;
};
