import { FunctionComponent } from 'react';
import { SliderThumbSlotProps as MuiSliderThumbSlotProps } from '@mui/base/Slider';

export type SlideOnChangeHandler = (value: number | number[]) => void;

const SliderThumb: FunctionComponent<MuiSliderThumbSlotProps> = ({ ownerState, className, children, ...props }) => (
  <span
    className={`${className} absolute -ml-2 -mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow ring-2 ring-cyan-500 dark:ring-cyan-400`}
    {...props}>
    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 ring-1 ring-inset ring-slate-900/5 dark:bg-cyan-400"></span>
    {children}
  </span>
);

export default SliderThumb;
