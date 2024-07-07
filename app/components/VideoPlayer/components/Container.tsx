'use client';

import { FunctionComponent, ReactNode } from 'react';
import clsx from 'clsx';

import Spinner from '@/app/components/Spinner';
import { useVideoStateContext } from '@/app/contexts/VideoStateContextProvider';

type VideoPlayerContainerProps = {
  ActiveTrackCue: ReactNode;
  Controls: ReactNode;
  Slider: ReactNode;
  Video: ReactNode;
};

const VideoPlayerContainer: FunctionComponent<VideoPlayerContainerProps> = ({
  ActiveTrackCue,
  Controls,
  Slider,
  Video,
}) => {
  const { isReady } = useVideoStateContext();
  return (
    <div className="relative">
      {!isReady && (
        <div className="absolute z-20 flex h-full w-full items-center justify-center bg-slate-800/50">
          <Spinner />
        </div>
      )}
      <div className="relative">
        <div className="absolute inset-x-0 top-4">{ActiveTrackCue}</div>
        {Video}
        <div className={clsx('absolute -bottom-2 z-10 w-full', Slider ? '' : '')}>{Slider}</div>
      </div>
      <div className={clsx('pt-3 flex pb-1', Controls ? 'bg-slate-800/50' : 'h-8')}>{Controls}</div>
    </div>
  );
};

export default VideoPlayerContainer;
