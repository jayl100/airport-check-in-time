import styled from 'styled-components';
import ReactSelect, { Props as RSProps, SingleValue } from 'react-select';

interface Props {
  className?: string;
  airports: string[];
  value: string;
  onChange: (v: string) => void;
}

type Option = {value: string; label: string};


function AirportSelector({ className, airports, value, onChange }: Props) {
  const options: Option[] = airports.map((a) => ({ value: a, label: a }));
  const selected = options.find((o) => o.value === value) ?? null;

  const handleChange = (opt: SingleValue<Option>) => {
    if (opt) onChange(opt.value);
  };

  return (
    <SelectorStyled className={className}>
      <LabelStyle>공항</LabelStyle>
      <StyledSelect
        options={options}
        value={selected}
        onChange={handleChange}
        placeholder="공항 선택"
        isSearchable={false}
        name="공항"
        classNamePrefix="react-select"
        className="react-select-container"
      />
    </SelectorStyled>
  );
}

export const SelectorStyled = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 0.5rem;
`;

export const LabelStyle = styled.label`
    font-weight: bold;
    font-size: 1.1rem;
`;

export const StyledSelect = styled(ReactSelect).attrs({ classNamePrefix: 'react-select', })<RSProps<Option, false>>`
    .react-select__control {
        border-radius: 0;
        padding: 2px;
        border-color: #d9d9d9;
        box-shadow: none;

        &:hover {
            box-shadow: 0 0 0 1px #222222 inset;
            border-color: #222222;
        }
    }

    .react-select__indicator {
        &:hover {
            color: #222222;
        }
    }

    .react-select__option {
        font-size: 0.9rem;
    }

    /* 선택된 항목이면서 포커스된 경우도 강제로 선택된 스타일 유지 */
    .react-select__option--is-selected {
        background-color: #1a6f54;
        color: white;
        font-weight: 600;
    }

    .react-select__option--is-selected.react-select__option--is-focused {
        background-color: #1a6f54;
        color: white;
        font-weight: 600;
    }

    /* 선택되지 않은 항목만 hover/focus에 반응 */
    .react-select__option:not(.react-select__option--is-selected):hover,
    .react-select__option:not(.react-select__option--is-selected).react-select__option--is-focused {
        background-color: #e4fff5;
    }
    
    .react-select__menu {
        z-index: 9999;
    }
    
    .react-select__indicator-separator {
        display: none;
    }
`;

export default AirportSelector;
