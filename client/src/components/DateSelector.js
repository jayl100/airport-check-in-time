import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StyledSelect, LabelStyle, SelectorStyled } from './AirportSelector';
function AirportSelector({ className, dates, value, onChange }) {
    const options = dates.map((a) => ({ value: a, label: a }));
    const selected = options.find((o) => o.value === value) ?? null;
    const handleChange = (opt) => {
        if (opt)
            onChange(opt.value);
    };
    return (_jsxs(SelectorStyled, { className: className, children: [_jsx(LabelStyle, { children: "\uB0A0\uC9DC" }), _jsx(StyledSelect, { options: options, value: selected, onChange: handleChange, placeholder: "\uB0A0\uC9DC \uC120\uD0DD", isSearchable: false, name: "\uB0A0\uC9DC", classNamePrefix: "react-select", className: "react-select-container" })] }));
}
export default AirportSelector;
