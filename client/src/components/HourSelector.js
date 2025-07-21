import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StyledSelect, LabelStyle, SelectorStyled } from './AirportSelector';
function AirportSelector({ className, hours, value, onChange }) {
    const options = hours.map((a) => ({ value: a, label: a }));
    const selected = options.find((o) => o.value === value) ?? null;
    const handleChange = (opt) => {
        if (opt)
            onChange(opt.value);
    };
    return (_jsxs(SelectorStyled, { className: className, children: [_jsx(LabelStyle, { children: "\uC2DC\uAC04" }), _jsx(StyledSelect, { options: options, value: selected, onChange: handleChange, placeholder: "\uC2DC\uAC04 \uC120\uD0DD", isSearchable: false, name: "\uC2DC\uAC04", classNamePrefix: "react-select", className: "react-select-container" })] }));
}
export default AirportSelector;
