'use client'

import ReactSelect, { SingleValue } from 'react-select';

interface Props {
  className?: string;
  airports: string[];
  value: string;
  onChange: (v: string) => void;
}

type Option = { value: string; label: string };

function AirportSelector({ className, airports, value, onChange }: Props) {
  const options: Option[] = airports.map((a) => ({ value: a, label: a }));
  const selected = options.find((o) => o.value === value) ?? null;

  const handleChange = (opt: SingleValue<Option>) => {
    if (opt) onChange(opt.value);
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className || ''}`}>
      <label className="font-bold text-[1.1rem]">공항</label>
      <ReactSelect
        instanceId="airport-select"
        options={options}
        value={selected}
        onChange={handleChange}
        placeholder="공항 선택"
        isSearchable={false}
        name="공항"
        classNamePrefix="react-select"
        className="react-select-container w-48"
      />
    </div>
  );
}

export default AirportSelector;
