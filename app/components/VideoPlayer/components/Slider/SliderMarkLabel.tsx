import clsx from 'clsx';
import { FunctionComponent, PropsWithChildren } from 'react';
import { SliderMarkLabelSlotProps as MuiSliderMarkLabelSlotProps } from '@mui/base/Slider';

const SliderMarkLabel: FunctionComponent<PropsWithChildren<MuiSliderMarkLabelSlotProps>> = ({
  ownerState,
  className,
  markLabelActive,
  children,
  ...props
}) => (
  <span {...props} className={clsx('absolute -top-12 -translate-x-1/2 text-sm', markLabelActive && 'text-red-200')}>
    {children}
  </span>
);

export default SliderMarkLabel;
