'use client'

import { SingleValue } from 'react-select';
import Select from 'react-select';

interface Props {
  className?: string;
  data: string[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}

type Option = { value: string; label: string };

export default function Selector({ className, data, value, onChange, label }: Props) {
  const options: Option[] = data.map(d => ({ value: d, label: d }));
  const selected = options.find(o => o.value === value) ?? null;

  const handleChange = (opt: SingleValue<Option>) => {
    if (opt) onChange(opt.value);
  };

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      <label className="font-bold text-[1.1rem]">{label}</label>
      <Select
        instanceId={label}
        options={options}
        value={selected}
        onChange={handleChange}
        placeholder={label}
        isSearchable={false}
        name={label}
        classNamePrefix="react-select"
        className="react-select-container w-48"
        styles={{
          option: (base, state) => ({
            ...base,
            fontSize: '0.9rem',
            backgroundColor: state.isSelected
              ? '#1a6f54'
              : state.isFocused
                ? '#e4fff5'
                : 'white',
            color: state.isSelected ? 'white' : 'black',
            fontWeight: state.isSelected ? 600 : 'normal',
          }),
          menu: (base) => ({
            ...base,
            zIndex: 9999,
          }),
          indicatorSeparator: () => ({
            display: 'none',
          }),
          control: (base, state) => ({
            ...base,
            borderColor: '#222222',
            boxShadow: state.isFocused ? '0 0 0 1px #1a6f54' : base.boxShadow,
            '&:hover': {
              borderColor: state.isFocused ? '#1a6f54' : base.borderColor,
            },
          }),
          }}
      />
    </div>
  );
}
