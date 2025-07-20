import { SingleValue } from 'react-select';
import { StyledSelect, LabelStyle, SelectorStyled } from './AirportSelector';

interface Props {
  className?: string;
  hours: string[];
  value: string;
  onChange: (v: string) => void;
}

type Option = {value: string; label: string};


function AirportSelector({ className, hours, value, onChange }: Props) {
  const options: Option[] = hours.map((a) => ({ value: a, label: a }));
  const selected = options.find((o) => o.value === value) ?? null;

  const handleChange = (opt: SingleValue<Option>) => {
    if (opt) onChange(opt.value);
  };

  return (
    <SelectorStyled className={className}>
      <LabelStyle>시간</LabelStyle>
      <StyledSelect
        options={options}
        value={selected}
        onChange={handleChange}
        placeholder="시간 선택"
        isSearchable={false}
        name="시간"
        classNamePrefix="react-select"
        className="react-select-container"
      />
    </SelectorStyled>
  );
}

export default AirportSelector;
