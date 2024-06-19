'use client';

import { FunctionComponent } from 'react';

import TrackCues from '@/app/components/TrackCues/TrackCues';
import VideoPlayer from '@/app/components/VideoPlayer/VideoPlayer';

const App: FunctionComponent = () => {
  return (
    <div className="flex flex-col">
      <VideoPlayer />
      <TrackCues />
    </div>
  );
};

export default App;
