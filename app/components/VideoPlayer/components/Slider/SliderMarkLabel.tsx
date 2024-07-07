import clsx from 'clsx';
import { FunctionComponent, PropsWithChildren, SyntheticEvent } from 'react';
import { SliderMarkLabelSlotProps as MuiSliderMarkLabelSlotProps } from '@mui/base/Slider';
import { HandleChangeMark, HandleNoop } from './SliderMark';

type SliderMarkLabelSlotProps = MuiSliderMarkLabelSlotProps & {
  onChangeMark: HandleChangeMark;
  onNoop: HandleNoop;
};

const SliderMarkLabel: FunctionComponent<PropsWithChildren<SliderMarkLabelSlotProps>> = ({
  ownerState,
  className,
  markLabelActive,
  children,
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
      className="pointer-events-none absolute -top-7 -translate-x-1/2 font-medium leading-4">
      {children}
    </span>
  );
};
export default SliderMarkLabel;
