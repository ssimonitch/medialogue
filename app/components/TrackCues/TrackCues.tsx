'use client';

import clsx from 'clsx';
import { memo, FunctionComponent, RefObject } from 'react';

import { useVideoStateContext } from '@/app/contexts/VideoStateContextProvider';
import { TrackCue } from './types';

type TrackCuesProps = {
  trackCues: TrackCue[];
  videoRef: RefObject<HTMLVideoElement>;
};

const TrackCues: FunctionComponent<TrackCuesProps> = ({ trackCues, videoRef }) => {
  const { activeTrackCueIndex } = useVideoStateContext();

  const handleClickCue = (index: number) => {
    if (!videoRef.current) return;
    // TODO: use the same offset that we use for seeking with slider marks
    videoRef.current.currentTime = trackCues[index].startTime;
  };

  return (
    <ol>
      {trackCues.map(({ id, text }, index) => {
         // TODO: use the same offset that we use for seeking with slider marks
        const isActive = activeTrackCueIndex === index;
        const isComplete = !isActive && index <= activeTrackCueIndex;
        const isUpcoming = !isActive && !isComplete;
        return (
          <li
            className={clsx(
              isUpcoming
                ? 'font-normal text-black opacity-50'
                : isComplete
                  ? 'font-normal text-black line-through opacity-50'
                  : isActive
                    ? 'font-semibold text-green-600'
                    : 'font-normal text-black',
            )}
            key={id}>
            <button onClick={() => handleClickCue(index)} type="button">
              {index + 1} - {text}
            </button>
          </li>
        );
      })}
    </ol>
  );
};

export default memo(TrackCues);
