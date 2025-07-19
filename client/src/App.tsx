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
  // ✅ 첫 진입 시: 날짜, 공항 목록 불러오기 + 최근 데이터 세팅
  useEffect(() => {
    const fetchInit = async () => {
      try {
        const [dateRes, airportRes] = await Promise.all([
          getAvailableDates(),
          getAvailableAirports(),
        ]);

        const dates = dateRes.data;
        const airports = airportRes.data;

        setDateList(dates);
        setAirportList(airports);

        if (dates.length > 0 && airports.length > 0) {
          const latestDate = dates[0];
          const defaultAirport = airports.includes('GMP') ? 'GMP' : airports[0];

          setSelectedDate(latestDate);
          setSelectedAirport(defaultAirport);

          const hoursRes = await getAvailableHours(latestDate, defaultAirport);
          const hours = hoursRes.data;
          setHourList(hours);

          if (hours.length > 0) {
            const latestHour = hours[hours.length - 1]; // 가장 최근 시간 선택
            setSelectedHour(latestHour);

            const res = await getWaitTimes({
              airport: defaultAirport,
              date: latestDate,
              hour: latestHour,
              page: 1,
              limit: 20,
            });
            setData(res.data);
          }
        }
      } catch (err) {
        console.error('초기 데이터 불러오기 실패:', err);
      }
    };
    fetchInit();
  }, []);

  // 날짜 변경 시 시간 목록 갱신
  useEffect(() => {
    if (!selectedDate || !selectedAirport) return;
    const fetch = async () => {
      try {
        const res = await getAvailableHours(selectedDate, selectedAirport);
        const hours = res.data;
        setHourList(hours);
        setSelectedHour('');
        setData([]);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [selectedDate, selectedAirport]);

  // 검색 실행 (date + hour + airport)
  useEffect(() => {
    if (!selectedDate || !selectedHour || !selectedAirport) return;
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
        setData(res.data);
      } catch (err) {
        console.error('불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [selectedDate, selectedHour, selectedAirport]);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="App">
      <h1>공항 대기 시간</h1>
      <p>현재 김포공항과 제주공항만 서비스 합니다.</p>
      <label>
        공항:
        <select value={selectedAirport} onChange={(e) => setSelectedAirport(e.target.value)}>
          <option value="">선택</option>
          {airportList.map((airport) => (
            <option key={airport} value={airport}>
              {airport}
            </option>
          ))}
        </select>
      </label>
      <label>
        날짜:
        <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
          <option value="">선택</option>
          {dateList.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </label>
      <label>
        시간:
        <select value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)}>
          <option value="">선택</option>
          {hourList.map((hour) => (
            <option key={hour} value={hour}>
              {hour}시
            </option>
          ))}
        </select>
      </label>
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