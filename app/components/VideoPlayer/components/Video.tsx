'use client';

import { forwardRef, memo, HTMLProps } from 'react';

const Video = forwardRef<HTMLVideoElement, HTMLProps<HTMLVideoElement>>(function Video({ children, ...props }, ref) {
  console.log('::Video rendered::');
  return (
    <video {...props} ref={ref}>
      {/* 
        TODO - expose track props to interface and update interface to not allow children
               we want to prevent children from being passed in as it will break memoization of the component
       */}
      <track label="English" kind="captions" srcLang="en" default src="/demo/video-1.vtt" />
    </video>
  );
});

export default memo(Video);
