import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
function LoadingSpinner({ className }) {
    return (_jsx(LoadingSpinnerStyled, { className: className, children: _jsx("div", { children: "Loading" }) }));
}
const LoadingSpinnerStyled = styled.div `

`;
export default LoadingSpinner;
