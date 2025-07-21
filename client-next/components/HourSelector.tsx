import { SingleValue } from 'react-select';
import Select from 'react-select';

interface Props {
  className?: string;
  hours: string[];
  value: string;
  onChange: (v: string) => void;
}

type Option = { value: string; label: string };

export default function HourSelector({ className, hours, value, onChange }: Props) {
  const options: Option[] = hours.map(h => ({ value: h, label: h }));
  const selected = options.find(o => o.value === value) ?? null;

  const handleChange = (opt: SingleValue<Option>) => {
    if (opt) onChange(opt.value);
  };

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      <label className="font-bold text-[1.1rem]">시간</label>
      <Select
        instanceId="hour-select"
        options={options}
        value={selected}
        onChange={handleChange}
        placeholder="시간 선택"
        isSearchable={false}
        name="시간"
        classNamePrefix="react-select"
        className="react-select-container w-48"
      />
    </div>
  );
}
