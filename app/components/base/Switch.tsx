import { FunctionComponent } from 'react';
import clsx from 'clsx';
import { Switch as BaseSwitch, SwitchProps as MuiSwitchProps } from '@mui/base/Switch';

type SwitchProps = Pick<MuiSwitchProps, 'checked' | 'onChange'>;

const Switch: FunctionComponent<SwitchProps> = (props) => {
  return (
    <BaseSwitch
      {...props}
      slotProps={{
        root: ({ disabled }) => ({
          className: clsx(
            `group relative inline-block w-10 h-6`,
            disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
          ),
        }),
        input: () => {
          return {
            className: clsx('cursor-inherit absolute w-full h-full top-0 left-0 opacity-0 z-10 border-none'),
          };
        },
        track: ({ checked }) => ({
          className: clsx(
            `absolute block w-full h-full transition rounded-full border border-solid outline-none border-gray-700`,
            `group-[.base--focusVisible]:shadow-ring-outline`,
            checked ? 'bg-blue-500' : 'bg-black',
          ),
        }),
        thumb: ({ checked }) => ({
          className: clsx(
            `block w-4 h-4 top-1 rounded-2xl border border-solid outline-none bg-white border-gray-700 relative transition-all`,
            checked ? 'left-[18px]' : 'left-[4px]',
          ),
        }),
      }}
    />
  );
};

export default Switch;
