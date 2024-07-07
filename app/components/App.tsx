'use client';

import { FunctionComponent, useRef } from 'react';

import TrackCues from '@/app/components/TrackCues/TrackCues';
import VideoPlayer from '@/app/components/VideoPlayer/VideoPlayer';

import useInitializeTrackCues from '@/app/components/TrackCues/hooks/useInitializeTrackCues';

const App: FunctionComponent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [trackCues] = useInitializeTrackCues(videoRef);

  return (
    <div className="flex flex-col">
      <VideoPlayer trackCues={trackCues} videoRef={videoRef} />
      {/* <TrackCues trackCues={trackCues} videoRef={videoRef} /> */}
    </div>
  );
};

export default App;
