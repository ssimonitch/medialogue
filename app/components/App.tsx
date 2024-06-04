'use client';

import { FunctionComponent, useRef } from 'react';

import TrackCues from '@/app/components/TrackCues/TrackCues';
import useTrackCues from '@/app/components/TrackCues/hooks/useTrackCues';

import VideoPlayer from '@/app/components/VideoPlayer/VideoPlayer';

const App: FunctionComponent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [trackCues] = useTrackCues(videoRef);

  return (
    <div className="flex flex-col">
      <VideoPlayer trackCues={trackCues} />
      <TrackCues trackCues={trackCues} />
    </div>
  );
};

export default App;
