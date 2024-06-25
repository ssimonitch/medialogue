'use client';

import { FunctionComponent, RefObject } from 'react';

import ActiveTrackCue from '@/app/components/VideoPlayer/components/ActiveTrackCue';
import Container from '@/app/components/VideoPlayer/components/Container';
import Controls from '@/app/components/VideoPlayer/components/Controls';
import Slider from '@/app/components/VideoPlayer/components/Slider';
import Video from '@/app/components/VideoPlayer/components/Video';

import { TrackCue } from '@/app/components/TrackCues/types';

type VideoPlayerProps = {
  trackCues: TrackCue[];
  videoRef: RefObject<HTMLVideoElement>;
};

const VideoPlayer: FunctionComponent<VideoPlayerProps> = ({ videoRef, trackCues }) => {
  return (
    <Container
      Controls={<Controls videoRef={videoRef} />}
      Slider={<Slider trackCues={trackCues} videoRef={videoRef} />}
      ActiveTrackCue={<ActiveTrackCue trackCues={trackCues} />}
      Video={
        <Video
          className="w-[960px]"
          src="/demo/video-1.mp4"
          trackCues={trackCues}
          poster="/demo/poster-1.jpg"
          playsInline
          ref={videoRef}
        />
      }
    />
  );
};

export default VideoPlayer;
