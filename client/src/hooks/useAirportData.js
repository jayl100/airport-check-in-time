import { useEffect, useState } from 'react';
import { getAvailableAirports, getAvailableDates } from '../lib/api';
export function useAirportData() {
    const [airports, setAirports] = useState([]);
    const [dates, setDates] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            try {
                const [a, d] = await Promise.all([
                    getAvailableAirports(),
                    getAvailableDates(),
                ]);
                setAirports(a.data);
                setDates(d.data);
            }
            catch (e) {
                console.error(e);
            }
            finally {
                setLoading(false);
            }
        })();
    }, []);
    return { airports, dates, loading };
}
