import { useEffect, useState } from 'react';
import './App.css';
import formatSeconds from './util/formatter';
import {
  getAvailableDates,
  getAvailableHours,
  getAvailableAirports,
  getWaitTimes,
} from './lib/api';

interface IAirportCheckInTime {
  airport_code: string;
  processed_at: string;
  wait_all: number;
  wait_a: number;
  wait_b: number;
  wait_c: number;
  wait_d: number;
  created_at: string;
}

function App() {
  const [data, setData] = useState<IAirportCheckInTime[]>([]);
  const [dateList, setDateList] = useState<string[]>([]);
  const [hourList, setHourList] = useState<string[]>([]);
  const [airportList, setAirportList] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedAirport, setSelectedAirport] = useState('');
  const [loading, setLoading] = useState(true);

  // 초기 진입 시 전체 공항의 최신 데이터 불러오기
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [airports, dates] = await Promise.all([
          getAvailableAirports(),
          getAvailableDates(),
        ]);

        const airportCodes = airports.data;
        const dateOptions = dates.data;

        setAirportList(airportCodes);
        setDateList(dateOptions);

        const latestDate = dateOptions[0];
        setSelectedDate(latestDate);

        // 모든 공항 데이터를 최신 시간 기준으로 한번에 불러오기
        const allData: IAirportCheckInTime[] = [];

        for (const airport of airportCodes) {
          const hoursRes = await getAvailableHours(latestDate, airport);
          const hourList = hoursRes.data;
          if (!hourList.length) continue;

          const latestHour = hourList[hourList.length - 1];

          if (!selectedAirport) setSelectedAirport(airport);
          if (!selectedHour) setSelectedHour(latestHour);

          const waitRes = await getWaitTimes({
            airport,
            date: latestDate,
            hour: latestHour,
            page: 1,
            limit: 20,
          });
          if (Array.isArray(waitRes?.data)) {
            allData.push(...waitRes.data);
          }
        }

        setData(allData);
      } catch (err) {
        console.error('초기 데이터 로딩 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  // 선택 변경 시 데이터 갱신
  useEffect(() => {
    const fetch = async () => {
      if (!selectedAirport || !selectedDate || !selectedHour) return;
      setLoading(true);
      try {
        const res = await getWaitTimes({
          airport: selectedAirport,
          date: selectedDate,
          hour: selectedHour,
          page: 1,
          limit: 20,
        });
        setData(res.data || []);
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [selectedAirport, selectedDate, selectedHour]);

  useEffect(() => {
    const loadHours = async () => {
      if (!selectedDate || !selectedAirport) return;
      try {
        const res = await getAvailableHours(selectedDate, selectedAirport);
        console.log(res);
        setHourList(res.data);
        setSelectedHour(res.data[res.data.length - 1] || '');
      } catch (err) {
        console.error('시간 목록 로딩 실패:', err);
      }
    };
    loadHours();
  }, [selectedDate, selectedAirport]);

  return (
    <div className="App">
      <img src="/GDT_favicon.svg" alt="logo" height="48px" />
      <h1>공항 탑승시간 측정</h1>
      <p>현재 김포공항과 제주공항만 서비스합니다.</p>

      <div>
        <label>
          공항:
          <select value={selectedAirport} onChange={(e) => setSelectedAirport(e.target.value)}>
            {airportList.map((airport) => (
              <option key={airport} value={airport}>{airport}</option>
            ))}
          </select>
        </label>

        <label>
          날짜:
          <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
            {dateList.map((date) => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </label>

        <label>
          시간:
          <select value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)}>
            {hourList.map((hour) => (
              <option key={hour} value={hour}>{hour}시</option>
            ))}
          </select>
        </label>
      </div>

      {loading ? <p>로딩 중...</p> : (
        <table>
          <thead>
          <tr>
            <th>공항</th>
            <th>처리 시각</th>
            <th>전체 평균</th>
            <th>Gate A</th>
            <th>Gate B</th>
            <th>Gate C</th>
            <th>Gate D</th>
          </tr>
          </thead>
          <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td>{item.airport_code}</td>
              <td>{item.processed_at}</td>
              <td>{formatSeconds(item.wait_all)}</td>
              <td>{formatSeconds(item.wait_a)}</td>
              <td>{formatSeconds(item.wait_b)}</td>
              <td>{formatSeconds(item.wait_c)}</td>
              <td>{formatSeconds(item.wait_d)}</td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
