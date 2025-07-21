import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// App.tsx
import React, { useState } from 'react';
import './App.css';
import { useAirportData } from './hooks/useAirportData';
import { useWaitTimes } from './hooks/useWaitTimes';
import AirportSelector from './components/AirportSelector';
import DateSelector from './components/DateSelector';
import HourSelector from './components/HourSelector';
import LoadingSpinner from './components/LoadingSpinner';
import WaitTimesTable from './components/WaitTimesTable';
import styled from 'styled-components';
function App() {
    const { airports, dates, loading: initLoading } = useAirportData();
    const [selAirport, setSelAirport] = useState('');
    const [selDate, setSelDate] = useState('');
    const [selHour, setSelHour] = useState('');
    const { hourList, data, loading: dataLoading } = useWaitTimes(selAirport, selDate, selHour);
    // 초기 airport, date, hour 선택
    React.useEffect(() => {
        if (!initLoading && airports.length && dates.length) {
            setSelAirport(airports[0]);
            setSelDate(dates[0]);
        }
    }, [initLoading, airports, dates]);
    // 초기 hour 선택
    React.useEffect(() => {
        if (hourList.length) {
            setSelHour(hourList[hourList.length - 1]);
        }
    }, [hourList]);
    return (_jsxs(Container, { children: [_jsxs(Wrapper, { children: [_jsx("img", { src: "/GDT_favicon.svg", alt: "logo", height: "48" }), _jsx("h1", { children: "\uACF5\uD56D \uD0D1\uC2B9\uC2DC\uAC04 \uCE21\uC815" }), _jsx("p", { children: "\uD604\uC7AC \uAE40\uD3EC\uACF5\uD56D\uACFC \uC81C\uC8FC\uACF5\uD56D\uB9CC \uC11C\uBE44\uC2A4\uD569\uB2C8\uB2E4." })] }), _jsxs(Controls, { children: [_jsx(AirportSelector, { airports: airports, value: selAirport, onChange: setSelAirport }), _jsx(DateSelector, { dates: dates, value: selDate, onChange: setSelDate }), _jsx(HourSelector, { hours: hourList, value: selHour, onChange: setSelHour })] }), initLoading || dataLoading
                ? _jsx(LoadingSpinner, {})
                : _jsx(WaitTimesTable, { data: data })] }));
}
const Wrapper = styled.div `
    margin: 2rem 0;
    padding: 2rem;
    background-color: #f9f9f9;
`;
const Container = styled.div `
    text-align: center;
    max-width: 1280px;
    padding: 40px;
    margin: 3rem auto;
`;
const Controls = styled.div `
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
`;
export default App;
