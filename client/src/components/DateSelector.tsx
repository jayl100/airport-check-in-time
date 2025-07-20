import { SingleValue } from 'react-select';
import { StyledSelect, LabelStyle, SelectorStyled } from './AirportSelector';

interface Props {
  className?: string;
  dates: string[];
  value: string;
  onChange: (v: string) => void;
}

type Option = {value: string; label: string};


function AirportSelector({ className, dates, value, onChange }: Props) {
  const options: Option[] = dates.map((a) => ({ value: a, label: a }));
  const selected = options.find((o) => o.value === value) ?? null;

  const handleChange = (opt: SingleValue<Option>) => {
    if (opt) onChange(opt.value);
  };

  return (
    <SelectorStyled className={className}>
      <LabelStyle>날짜</LabelStyle>
      <StyledSelect
        options={options}
        value={selected}
        onChange={handleChange}
        placeholder="날짜 선택"
        isSearchable={false}
        name="날짜"
        classNamePrefix="react-select"
        className="react-select-container"
      />
    </SelectorStyled>
  );
}

export default AirportSelector;
