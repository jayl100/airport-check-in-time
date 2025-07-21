import { SingleValue } from 'react-select';
import Select from 'react-select';

interface Props {
  className?: string;
  dates: string[];
  value: string;
  onChange: (v: string) => void;
}

type Option = { value: string; label: string };

export default function DateSelector({ className, dates, value, onChange }: Props) {
  const options: Option[] = dates.map(d => ({ value: d, label: d }));
  const selected = options.find(o => o.value === value) ?? null;

  const handleChange = (opt: SingleValue<Option>) => {
    if (opt) onChange(opt.value);
  };

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      <label className="font-bold text-[1.1rem]">날짜</label>
      <Select
        instanceId="date-select"
        options={options}
        value={selected}
        onChange={handleChange}
        placeholder="날짜 선택"
        isSearchable={false}
        name="날짜"
        classNamePrefix="react-select"
        className="react-select-container w-48"
      />
    </div>
  );
}
