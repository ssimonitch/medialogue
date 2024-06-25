import clsx from 'clsx';
import { FunctionComponent, SyntheticEvent, useState } from 'react';
import { SliderMarkSlotProps as MuiSliderMarkSlotProps } from '@mui/base/Slider';

export type HandleChangeMark = (event: SyntheticEvent, markIndex: number) => void;
export type HandleNoop = (event: SyntheticEvent) => void;

type SliderMarkSlotProps = MuiSliderMarkSlotProps & {
  onChangeMark: HandleChangeMark;
  onNoop: HandleNoop;
};

const SliderMark: FunctionComponent<SliderMarkSlotProps> = ({
  ownerState,
  className,
  markActive,
  onChangeMark,
  onNoop,
  ...props
}) => {
  const markIndex = props['data-index'];

  const handleClick = (event: SyntheticEvent) => {
    onChangeMark(event, markIndex);
  };

  return (
    <span
      {...props}
      onClick={handleClick}
      onMouseDown={onNoop}
      onTouchStart={onNoop}
      className={clsx('absolute -top-6 h-4 w-4 -translate-x-1/2 rounded-full bg-blue-200', markActive && 'bg-red-200')}
    />
  );
};

export default SliderMark;
