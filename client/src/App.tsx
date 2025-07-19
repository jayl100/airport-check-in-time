import { useEffect, useState } from 'react';
import './App.css';
import formatSeconds from './util/formatter';

interface IAirportCheckInTime {
  airport_code: string;
  processed_at: string;
  wait_all: number;
  wait_a: number;
  wait_b: number;
  wait_c: number;
  wait_d: number;
}

function App() {
  const [waitTimes, setWaitTimes] = useState([]);

  useEffect(() => {
    fetch('https://airport-check-in-time.onrender.com/api/wait-times')
    .then(res => res.json())
    .then(data => setWaitTimes(data))
    .catch(err => console.error('불러오기 실패:', err));
  }, []);

  return (
    <>
    <div className="App">
      <h1>공항 대기 시간</h1>
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
        {waitTimes.map((item: IAirportCheckInTime, i) => (
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
    </>
  );
}

export default App;
