'use client';

import clsx from 'clsx';
import { memo, FunctionComponent } from 'react';

import { useTrackCuesContext } from '@/app/contexts/TrackCuesContextProvider';

const TrackCues: FunctionComponent = () => {
  const { activeTrackCueIndex, trackCues } = useTrackCuesContext();
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
