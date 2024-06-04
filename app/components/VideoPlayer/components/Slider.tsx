import clsx from 'clsx';
import { FunctionComponent, memo } from 'react';
import { Slider as MuiSlider, SliderThumbSlotProps, SliderMarkSlotProps } from '@mui/base/Slider';
import { useVideoState } from '@/app/contexts/VideoStateContextProvider';

export type SlideOnChangeHandler = (event: Event, value: number | number[], activeThumb: number) => void;

const Thumb: FunctionComponent<SliderThumbSlotProps> = ({ ownerState, className, children, ...props }) => (
  <span
    className={`${className} absolute -ml-2 -mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow ring-2 ring-cyan-500 dark:ring-cyan-400`}
    {...props}>
    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 ring-1 ring-inset ring-slate-900/5 dark:bg-cyan-400"></span>
    {children}
  </span>
);

const Mark: FunctionComponent<SliderMarkSlotProps> = ({ ownerState, className, markActive, ...props }) => (
  <span
    {...props}
    className={clsx(
      'absolute h-4 w-4 -translate-x-1/2 -translate-y-6 rounded-full bg-blue-200',
      markActive && 'bg-red-200',
    )}
  />
);

type SliderProps = {
  endTimeSeconds: number;
  handleSliderChange: SlideOnChangeHandler;
};

const Slider: FunctionComponent<SliderProps> = ({ endTimeSeconds, handleSliderChange }) => {
  const { currentTime } = useVideoState();
  console.log('::Slider rendered::');
  return (
    <MuiSlider
      defaultValue={0}
      max={endTimeSeconds}
      onChange={handleSliderChange}
      min={0}
      marks
      value={currentTime}
      slots={{ thumb: Thumb, mark: Mark }}
      slotProps={{
        thumb: {
          className:
            'ring-cyan-500 dark:ring-cyan-400 ring-2 w-4 h-4 -mt-1 -ml-2 flex items-center justify-center bg-white rounded-full shadow absolute',
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
      }}
    />
  );
};

export default memo(Slider);
