import { useEffect, useState } from 'react';
import { getAvailableHours, getWaitTimes, } from '../lib/api';
export function useWaitTimes(airport, date, hour) {
    const [hourList, setHourList] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    // 시간 목록
    useEffect(() => {
        if (!airport || !date)
            return;
        (async () => {
            try {
                const res = await getAvailableHours(date, airport);
                setHourList(res.data);
            }
            catch (e) {
                console.error(e);
            }
        })();
    }, [airport, date]);
    // 대기시간 데이터
    useEffect(() => {
        if (!airport || !date || !hour)
            return;
        setLoading(true);
        (async () => {
            try {
                const res = await getWaitTimes({ airport, date, hour, page: 1, limit: 20 });
                setData(res.data);
            }
            catch (e) {
                console.error(e);
            }
            finally {
                setLoading(false);
            }
        })();
    }, [airport, date, hour]);
    return { hourList, data, loading };
}
