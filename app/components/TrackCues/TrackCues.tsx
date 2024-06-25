'use client';

import clsx from 'clsx';
import { memo, FunctionComponent, RefObject } from 'react';

import { useVideoStateDispatch, useVideoStateContext } from '@/app/contexts/VideoStateContextProvider';
import { TrackCue } from './types';

type TrackCuesProps = {
  trackCues: TrackCue[];
  videoRef: RefObject<HTMLVideoElement>;
};

const TrackCues: FunctionComponent<TrackCuesProps> = ({ trackCues, videoRef }) => {
  const videoDispatch = useVideoStateDispatch();
  const { activeTrackCueIndex } = useVideoStateContext();

  const handleClickCue = (index: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = trackCues[index].startTime;
    videoDispatch({ type: 'SET_CURRENT_TIME', currentTime: trackCues[index].startTime });
  };

  return (
    <ol>
      {trackCues.map(({ id, text }, index) => {
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
