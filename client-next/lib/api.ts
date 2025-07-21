import { IAirportCheckInTime } from '@/lib/models';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export type WaitTimesParams = {
  airport: string;
  date: string;
  hour: string;
  page?: number;
  limit?: number;
};

async function fetcher<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const url = new URL(API_BASE_URL + path);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null) url.searchParams.append(k, String(v));
    });
  }

  const res = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`API fetch error: ${res.statusText}`);

  const json = await res.json();
  return (json && typeof json === 'object' && 'data' in json ? (json.data as T) : (json as T));
}

export const getAvailableAirports = (): Promise<string[]> => fetcher<string[]>('/api/wait-times/airports');
export const getAvailableDates    = (): Promise<string[]> => fetcher<string[]>('/api/wait-times/dates');
export const getAvailableHours    = (date: string, airport?: string): Promise<string[]> =>
  fetcher<string[]>('/api/wait-times/hours', { date, airport });
export const getWaitTimes         = (params: WaitTimesParams): Promise<IAirportCheckInTime[]> =>
  fetcher<IAirportCheckInTime[]>('/api/wait-times', params);