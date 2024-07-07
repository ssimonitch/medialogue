import { FunctionComponent, useEffect, ReactNode, memo, useState, SyntheticEvent, useCallback, RefObject } from 'react';
import { Slider as MuiSlider } from '@mui/base/Slider';
import { useVideoStateContext, useVideoStateDispatch } from '@/app/contexts/VideoStateContextProvider';

import usePlaybackStepVector from '@/app/components/VideoPlayer/hooks/usePlaybackStepVector';

import { STEP_GRANULARITY } from '@/app/components/VideoPlayer/constants';
import Thumb from './SliderThumb';
import MarkLabel from './SliderMarkLabel';
import Mark, { HandleChangeMark, HandleNoop, GetPreviewTextHandler } from './SliderMark';
import { TrackCue } from '@/app/components/TrackCues/types';
import { normalizeCueTime } from '../../helper';

export type SlideOnChangeHandler = (value: number | number[]) => void;

// augment props for the Slider component mark slot
declare module '@mui/base/Slider' {
  interface SliderMarkSlotPropsOverrides {
    onChangeMark: HandleChangeMark;
    onNoop: HandleNoop;
    getPreviewText: GetPreviewTextHandler;
  }
  interface SliderMarkLabelSlotPropsOverrides {
    onChangeMark: HandleChangeMark;
    onNoop: HandleNoop;
  }
}

type SliderMark = { label: ReactNode; value: number };

interface SliderProps {
  trackCues: TrackCue[];
  videoRef: RefObject<HTMLVideoElement>;
}

const Slider: FunctionComponent<SliderProps> = ({ trackCues, videoRef }) => {
  const { currentTime } = useVideoStateContext();
  const videoStateDispatch = useVideoStateDispatch();

  const [playbackStepVector, endStep] = usePlaybackStepVector(videoRef);
  const [marks, setMarks] = useState<SliderMark[]>([]);

  useEffect(() => {
    // assume there will never be no tracks
    if (trackCues.length === 0 || playbackStepVector.length === 0) return;

    const cueStartTimes = trackCues.map(({ startTime }) => startTime);

    // create mapping of playback step to track cue index
    const normalizedCueIndices = playbackStepVector
      .map((_, step) => {
        // normalize the step to the same precision as the cue start times
        const normalizedStep = step * STEP_GRANULARITY;
        // Offset by one step to ensure that when the user clicks a cue mark there is a enough time for them to read the cue
        // before the video and audio reach that point. This could be good to expose as a control in the future.
        const offsetNormalizedStep = normalizedStep - STEP_GRANULARITY;
        return {
          step: normalizeCueTime(offsetNormalizedStep),
          // get the index of the cue for this step
          index: cueStartTimes.findIndex(
            (cueStartTime) => normalizeCueTime(cueStartTime) === normalizeCueTime(normalizedStep),
          ),
        };
      })
      .filter(({ index }) => index !== -1);

    setMarks(normalizedCueIndices.map((vector) => ({ label: vector.index + 1, value: vector.step })));

    // loading marks is the last step in the initialization process
    videoStateDispatch({ type: 'SET_IS_READY', isReady: true });
  }, [playbackStepVector, trackCues, videoStateDispatch]);

  const handleChange = useCallback(
    (value: number | number[]) => {
      if (videoRef.current && typeof value === 'number') {
        videoRef.current.currentTime = value;
      }
    },
    [videoRef],
  );

  // The MUI Mark component has an issue where tap and mouseup events registered anywhere but the
  // middle of the element cause the slider change handler to be called with the value of the slider
  // at that horizontal location, which only equals the mark value at the very center. To address this
  // we stop propagation of these events and override the Mark click handler.
  const handleNoop = useCallback((event: SyntheticEvent) => {
    event.stopPropagation();
  }, []);

  const handleChangeMark = useCallback(
    (event: SyntheticEvent, markIndex: number) => {
      event.preventDefault();
      event.stopPropagation();
      handleChange(marks[markIndex].value);
    },
    [handleChange, marks],
  );

  const handleGetPreviewText: GetPreviewTextHandler = useCallback(
    (markIndex) => {
      // is the text is longer than 3 words, show the first two words. otherwise show the first word only
      const cueText = trackCues[markIndex].text;
      const words = cueText.split(' ');
      let previewText = words.length > 3 ? `${words[0]} ${words[1]}` : words[0];
      return `${previewText}${words.length === 1 ? '' : '...'}`;
    },
    [trackCues],
  );

  return (
    <MuiSlider
      defaultValue={0}
      max={endStep}
      onChange={(_, value) => handleChange(value)}
      min={0}
      marks={marks}
      value={currentTime}
      slots={{
        thumb: Thumb,
        mark: Mark,
        markLabel: MarkLabel,
      }}
      step={STEP_GRANULARITY}
      shiftStep={STEP_GRANULARITY * 10}
      slotProps={{
        mark: {
          onChangeMark: handleChangeMark,
          onNoop: handleNoop,
          getPreviewText: handleGetPreviewText,
        },
        markLabel: {
          onChangeMark: handleChangeMark,
          onNoop: handleNoop,
        },
        root: {
          className: 'w-full relative inline-block h-2 cursor-pointer',
        },
        rail: {
          className: 'bg-slate-100 dark:bg-slate-700 h-2 w-full block absolute',
        },
        track: {
          className: 'bg-cyan-500 dark:bg-cyan-400 h-2 absolute',
        },
        thumb: {
          className:
            'ring-cyan-500 dark:ring-cyan-400 ring-2 w-4 h-4 -mt-1 -ml-2 flex items-center justify-center bg-white rounded-full shadow absolute',
        },
      }}
    />
  );
};

export default memo(Slider);
