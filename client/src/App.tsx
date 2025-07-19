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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate) return;
    const fetch = async () => {
      try {
        const res = await getAvailableHours(selectedDate, selectedAirport);
        const hours = res.data;
        setHourList(hours);

        // 자동 선택: 최신 시간
        if (hours.length > 0) {
          setSelectedHour(hours[0]); // 가장 최신 시간 (예: '13')
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [selectedDate, selectedAirport]);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const airports = await getAvailableAirports();
        const dates = await getAvailableDates();
        setAirportList(airports.data);
        setDateList(dates.data);

        const recentAirport = airports.data[0] || '';
        const recentDate = dates.data[0] || '';

        setSelectedAirport(recentAirport);
        setSelectedDate(recentDate);
      } catch (err) {
        console.error('초기 정보 불러오기 실패:', err);
      }
    };
    fetchInitial();
  }, []);

  // ✅ 날짜/공항 바뀌면 시간 목록 가져오기
  useEffect(() => {
    if (!selectedDate || !selectedAirport) return;

    const fetchHours = async () => {
      try {
        const res = await getAvailableHours(selectedDate, selectedAirport);
        setHourList(res.data);
        setSelectedHour(res.data[res.data.length - 1] || ''); // 가장 최근 시간 자동 선택
      } catch (err) {
        console.error('시간 목록 불러오기 실패:', err);
      }
    };
    fetchHours();
  }, [selectedDate, selectedAirport]);

  // ✅ 검색
  useEffect(() => {
    if (!selectedAirport || !selectedDate || !selectedHour) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getWaitTimes({
          airport: selectedAirport,
          date: selectedDate,
          hour: selectedHour,
          page: 1,
          limit: 20,
        });
        setData(res.data); // API가 { data: [], total: ... } 구조
      } catch (err) {
        console.error('대기 시간 데이터 불러오기 실패:', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [selectedAirport, selectedDate, selectedHour]);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="App">
      <h1>공항 대기 시간</h1>
      <p>현재 김포공항과 제주공항만 서비스합니다.</p>

      <div>
        <label>
          공항:
          <select value={selectedAirport} onChange={e => setSelectedAirport(e.target.value)}>
            {airportList.map(airport => (
              <option key={airport} value={airport}>{airport}</option>
            ))}
          </select>
        </label>

        <label>
          날짜:
          <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)}>
            {dateList.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </label>

        <label>
          시간:
          <select value={selectedHour} onChange={e => setSelectedHour(e.target.value)}>
            {hourList.map(hour => (
              <option key={hour} value={hour}>{hour}시</option>
            ))}
          </select>
        </label>
      </div>

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
    </div>
  );
}

export default App;