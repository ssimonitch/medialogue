import { FunctionComponent, ReactElement } from 'react';

type VideoPlayerContainerProps = {
  Controls: ReactElement;
  Slider: ReactElement;
  Video: ReactElement;
};

const VideoPlayerContainer: FunctionComponent<VideoPlayerContainerProps> = ({ Controls, Slider, Video }) => {
  return (
    <>
      <div className="relative">
        {Video}
        <div className="absolute -bottom-2 w-full bg-slate-800/50">{Slider}</div>
      </div>
      <div className="mt-2 flex flex-row justify-end gap-4 bg-slate-800/50 py-1">{Controls}</div>
    </>
  );
};

export default VideoPlayerContainer;
