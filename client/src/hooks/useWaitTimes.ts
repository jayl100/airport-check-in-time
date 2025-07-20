import { useEffect, useState } from 'react';
import {
  getAvailableHours,
  getWaitTimes,
} from '../lib/api';
import { IAirportCheckInTime } from '../lib/models'

export function useWaitTimes(
  airport: string,
  date: string,
  hour: string
) {
  const [hourList, setHourList] = useState<string[]>([]);
  const [data, setData]         = useState<IAirportCheckInTime[]>([]);
  const [loading, setLoading]   = useState(false);

  // 시간 목록
  useEffect(() => {
    if (!airport || !date) return;
    (async () => {
      try {
        const res = await getAvailableHours(date, airport);
        setHourList(res.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [airport, date]);

  // 대기시간 데이터
  useEffect(() => {
    if (!airport || !date || !hour) return;
    setLoading(true);
    (async () => {
      try {
        const res = await getWaitTimes({ airport, date, hour, page: 1, limit: 20 });
        setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [airport, date, hour]);

  return { hourList, data, loading };
}
