'use client';

import { FunctionComponent, memo } from 'react';

import { TrackCue } from '@/app/components/TrackCues/types';
import { useVideoStateContext } from '@/app/contexts/VideoStateContextProvider';

type ActiveTrackCueProps = {
  trackCues: TrackCue[];
};

const ActiveTrackCue: FunctionComponent<ActiveTrackCueProps> = ({ trackCues }) => {
  const { activeTrackCueIndex } = useVideoStateContext();
  const trackCueToDisplay = trackCues[activeTrackCueIndex];
  return (
    <div className="flex justify-center">
      {trackCueToDisplay?.text && (
        <p className="bg-blue-800 px-2 py-1 text-center text-3xl text-white">{trackCueToDisplay?.text}</p>
      )}
    </div>
  );
};

export default memo(ActiveTrackCue);
