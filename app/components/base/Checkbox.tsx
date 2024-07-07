import { FunctionComponent, ChangeEventHandler } from "react"

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const Checkbox: FunctionComponent<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <div className="relative flex items-start">
    <div className="flex h-6 items-center">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
        id="pause-on-cue-exit"
        checked={checked}
        onChange={onChange}
      />
    </div>
    <div className="ml-3 text-sm leading-6">
      <label className="font-medium text-gray-900" htmlFor="pause-on-cue-exit">
        {label}
      </label>
    </div>
  </div>
  )
}

export default Checkbox;