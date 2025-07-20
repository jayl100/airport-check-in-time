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

  const { hourList, data, loading: dataLoading } =
    useWaitTimes(selAirport, selDate, selHour);

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

  return (
    <Container>
      <Wrapper>
        <img src="/GDT_favicon.svg" alt="logo" height="48" />
        <h1>공항 탑승시간 측정</h1>
        <p>현재 김포공항과 제주공항만 서비스합니다.</p>
      </Wrapper>
      <Controls>
        <AirportSelector
          airports={airports}
          value={selAirport}
          onChange={setSelAirport}
        />
        <DateSelector
          dates={dates}
          value={selDate}
          onChange={setSelDate}
        />
        <HourSelector
          hours={hourList}
          value={selHour}
          onChange={setSelHour}
        />
      </Controls>

      {initLoading || dataLoading
        ? <LoadingSpinner />
        : <WaitTimesTable data={data} />
      }
    </Container>
  );
}

const Wrapper = styled.div`
    margin: 2rem 0;
    padding: 2rem;
    background-color: #f9f9f9;
`;

const Container = styled.div`
    text-align: center;
    max-width: 1280px;
    padding: 40px;
    margin: 3rem auto;
`;

const Controls = styled.div`
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
`;

export default App;
