import clsx from 'clsx';
import { FunctionComponent, SyntheticEvent, useState, memo } from 'react';
import { SliderMarkSlotProps as MuiSliderMarkSlotProps } from '@mui/base/Slider';
import { useHover, useFloating, useInteractions, offset } from '@floating-ui/react';

export type HandleChangeMark = (event: SyntheticEvent, markIndex: number) => void;
export type HandleNoop = (event: SyntheticEvent) => void;
export type GetPreviewTextHandler = (markIndex: number) => string;

type SliderMarkSlotProps = MuiSliderMarkSlotProps & {
  onChangeMark: HandleChangeMark;
  onNoop: HandleNoop;
  getPreviewText: GetPreviewTextHandler;
};

const SliderMark: FunctionComponent<SliderMarkSlotProps> = ({
  ownerState,
  className,
  markActive,
  onChangeMark,
  onNoop,
  getPreviewText,
  ...props
}) => {
  // hover popup state
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    middleware: [offset({ mainAxis: 12 })],
  });
  const hover = useHover(context, { restMs: 250 });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  // onClick event override
  const markIndex = props['data-index'];
  const handleClick = (event: SyntheticEvent) => {
    onChangeMark(event, markIndex);
  };

  return (
    <>
      <span
        {...props}
        ref={refs.setReference}
        {...getReferenceProps()}
        onClick={handleClick}
        onMouseDown={onNoop}
        onTouchStart={onNoop}
        className={clsx(
          'absolute -top-8 h-6 w-6 -translate-x-1/2 rounded-full',
          markActive ? 'bg-red-200 hover:bg-red-400' : 'bg-blue-200 hover:bg-blue-400',
        )}
      />
      {isOpen && (
        <div
          className="pointer-events-none rounded-xl bg-slate-200 px-4 py-2"
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}>
          {getPreviewText(markIndex)}
        </div>
      )}
    </>
  );
};

export default memo(SliderMark, (prevProps, nextProps) => {
  // only re-render when markActive changes, everything is fine as static
  return prevProps.markActive === nextProps.markActive;
});
