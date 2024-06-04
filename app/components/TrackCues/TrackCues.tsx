'use client';

import clsx from 'clsx';
import { memo, FunctionComponent } from 'react';

import { TrackCue } from '@/app/components/TrackCues/types';
import { useTrackCues } from '@/app/contexts/TrackCuesContextProvider';

type TrackCuesProps = {
  trackCues: TrackCue[];
};

const TrackCues: FunctionComponent<TrackCuesProps> = ({ trackCues }) => {
  const { activeTrackCueIndex } = useTrackCues();
  console.log('::TrackCues rendered::');
  return (
    <ol>
      {trackCues.map(({ id, text }, index) => (
        <li
          className={clsx(activeTrackCueIndex === index ? 'font-semibold text-green-600' : 'font-normal text-black')}
          key={id}>
          {index + 1} - {text}
        </li>
      ))}
    </ol>
  );
};

export default memo(TrackCues);
