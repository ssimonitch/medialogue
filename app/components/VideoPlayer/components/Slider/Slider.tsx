import { FunctionComponent, memo, SyntheticEvent, useCallback } from 'react';
import { Slider as MuiSlider } from '@mui/base/Slider';
import { useVideoStateContext } from '@/app/contexts/VideoStateContextProvider';
import { STEP_GRANULARITY } from '@/app/components/VideoPlayer/constants';

import Thumb from './SliderThumb';
import MarkLabel from './SliderMarkLabel';
import Mark, { HandleChangeMark, HandleNoop } from './SliderMark';

export type SlideOnChangeHandler = (value: number | number[]) => void;

// augment props for the Slider component mark slot
declare module '@mui/base/Slider' {
  interface SliderMarkSlotPropsOverrides {
    onChangeMark: HandleChangeMark;
    onNoop: HandleNoop;
  }
}

interface SliderProps {
  onChange: SlideOnChangeHandler;
  max: number;
  marks: { label: string | number; value: number }[];
}

const Slider: FunctionComponent<SliderProps> = ({ max, onChange, marks }) => {
  const { currentTime } = useVideoStateContext();

  const handleChange = (_: Event, value: number | number[]) => {
    onChange(value);
  };

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
      onChange(marks[markIndex].value);
    },
    [onChange, marks],
  );

  return (
    <MuiSlider
      defaultValue={0}
      max={max}
      onChange={handleChange}
      min={0}
      marks={marks}
      value={currentTime}
      slots={{ thumb: Thumb, mark: Mark, markLabel: MarkLabel }}
      step={STEP_GRANULARITY}
      shiftStep={STEP_GRANULARITY * 10}
      slotProps={{
        mark: {
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
