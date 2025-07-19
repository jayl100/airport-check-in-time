import { useEffect, useState } from 'react';
import './App.css';

interface IAirportCheckInTime {
  airport_code: string;
  processed_at: string;
  wait_avg_all: number;
  wait_avg_a: number;
  wait_avg_b: number;
  wait_avg_c: number;
  wait_avg_d: number;
}

function App() {
  const [waitTimes, setWaitTimes] = useState([]);

  useEffect(() => {
    fetch('https://your-render-backend-url.com/api/wait-times')
    .then(res => res.json())
    .then(data => setWaitTimes(data))
    .catch(err => console.error('불러오기 실패:', err));
  }, []);

  return (
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
            <td>{item.wait_avg_all}</td>
            <td>{item.wait_avg_a}</td>
            <td>{item.wait_avg_b}</td>
            <td>{item.wait_avg_c}</td>
            <td>{item.wait_avg_d}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
