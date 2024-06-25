import { useVideoStateDispatch } from '@/app/contexts/VideoStateContextProvider';
import { forwardRef, memo, HTMLProps, ChangeEventHandler } from 'react';

import { TrackCue } from '../../TrackCues/types';
import { getCurrentTimeTrackCueIndex } from '../../TrackCues/helpers';

type VideoProps = HTMLProps<HTMLVideoElement> & {
  trackCues: TrackCue[];
};

type VideoChangeEventHandler = ChangeEventHandler<HTMLVideoElement>;

const Video = forwardRef<HTMLVideoElement, VideoProps>(function Video({ children, trackCues, ...props }, ref) {
  const videoStateDispatch = useVideoStateDispatch();

  // when using pauseOnExit an oncuechange event fires when a track cue ends and the video pauses
  // however, we keep the cue displayed in the UI so the user can read it until they are ready to move on
  // this means that we need to resync the activeTrackCueIndex when the user starts the video again via play or seek
  const resyncActiveTrackCueIndex = (currentTime: number) => {
    const activeTrackCueIndex = getCurrentTimeTrackCueIndex(trackCues, currentTime);
    videoStateDispatch({ type: 'SET_ACTIVE_TRACK_CUE_INDEX', activeTrackCueIndex });
  };

  const handleOnTimeUpdate: VideoChangeEventHandler = (event) => {
    videoStateDispatch({ type: 'SET_CURRENT_TIME', currentTime: event.target.currentTime });
  };

  const handleOnPlay: VideoChangeEventHandler = (event) => {
    videoStateDispatch({ type: 'SET_PLAYING', playing: true });
    resyncActiveTrackCueIndex(event.target.currentTime);
  };

  const handleOnPause: VideoChangeEventHandler = (event) => {
    videoStateDispatch({ type: 'SET_PLAYING', playing: false });
  };

  const handleOnVolumeChange: VideoChangeEventHandler = (event) => {
    videoStateDispatch({ type: 'SET_VOLUME', volume: event.target.volume });
  };

  const handleOnSeeked: VideoChangeEventHandler = (event) => {
    // using the Slider to seek will change the video currentTime but an oncuechange event will not necessarily fire
    resyncActiveTrackCueIndex(event.target.currentTime);
  };

  return (
    <video
      {...props}
      muted
      // register callbacks on video player to handle track cues pauseOnExit property
      onPause={handleOnPause}
      onTimeUpdate={handleOnTimeUpdate}
      onPlay={handleOnPlay}
      onSeeked={handleOnSeeked}
      onVolumeChange={handleOnVolumeChange}
      ref={ref}>
      {/* 
        TODO - expose track props to interface and update interface to not allow children
               we want to prevent children from being passed in as it will break memoization of the component
       */}
      <track label="English" kind="captions" srcLang="en" default src="/demo/video-1.vtt" />
    </video>
  );
});

export default memo(Video);
