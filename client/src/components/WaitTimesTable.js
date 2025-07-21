import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import formatSeconds from '../util/formatter';
import styled from 'styled-components';
export default function WaitTimesTable({ data }) {
    return (_jsxs(TableStyle, { children: [_jsx("thead", { children: _jsxs(TheadTrStyled, { children: [_jsx(ThStyled, { children: "\uACF5\uD56D" }), _jsx(ThStyled, { children: "\uCC98\uB9AC \uC2DC\uAC01" }), _jsx(ThStyled, { children: "\uC804\uCCB4 \uD3C9\uADE0" }), _jsx(ThStyled, { children: "\uCCB4\uD06C\uC778 & \uC218\uD654\uBB3C" }), _jsx(ThStyled, { children: "\uC2E0\uC6D0\uD655\uC778" }), _jsx(ThStyled, { children: "\uBCF4\uC548\uAC80\uC0AC" }), _jsx(ThStyled, { children: "\uBE44\uD589\uAE30 \uD0D1\uC2B9" })] }) }), _jsx("tbody", { children: data.map((item, i) => (_jsxs(TrStyled, { children: [_jsx(TdStyled, { children: item.airport_code }), _jsx(TdStyled, { children: item.processed_at }), _jsx(TdStyled, { children: formatSeconds(item.wait_all) }), _jsx(TdStyled, { children: formatSeconds(item.wait_a) }), _jsx(TdStyled, { children: formatSeconds(item.wait_b) }), _jsx(TdStyled, { children: formatSeconds(item.wait_c) }), _jsx(TdStyled, { children: formatSeconds(item.wait_d) })] }, i))) })] }));
}
const TableStyle = styled.table `
    margin: 0 auto;
    border-collapse: collapse;
    width: 100%;
    overflow: hidden;
`;
const TheadTrStyled = styled.tr `
    background-color: #93FFDC;
`;
const TrStyled = styled.tr `
    &:hover {
        background-color: #f9f9f9;
    }
`;
const ThStyled = styled.th `
    padding: 16px 22px;
    border-bottom: 1px solid #d9d9d9;
    font-size: 1rem;
`;
const TdStyled = styled.td `
    padding: 16px 22px;
    border-bottom: 1px solid #d9d9d9;
    font-size: 1rem;
    text-align: center;
    
    &:nth-child(3) {
        background-color: #f9f9f9;
    }
`;
