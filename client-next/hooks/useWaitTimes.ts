'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAvailableHours, getWaitTimes } from '@/lib/api';
import { IAirportCheckInTime } from '@/lib/models';

/**
 * 선택된 공항, 날짜, 시간에 따른 시간 목록과 대기시간 데이터를 가져오는 훅
 */
export function useWaitTimes(
  airport: string,
  date: string,
  hour: string
) {
  // 시간 목록
  const hoursQuery = useQuery({
    queryKey: ['waitTimes', 'hours', airport, date],
    queryFn: () => getAvailableHours(date, airport),
    enabled: !!airport && !!date,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const waitTimesQuery = useQuery<IAirportCheckInTime[], Error>({
    queryKey: ['waitTimes', 'data', airport, date, hour],
    queryFn: () => getWaitTimes({ airport, date, hour, page: 1, limit: 20 }),
    enabled: !!airport && !!date && !!hour,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });


  return {
    hourList: hoursQuery.data || [],
    data: waitTimesQuery.data || [],
    loading: hoursQuery.isFetching || waitTimesQuery.isFetching, // ← 변경
    isFetching: waitTimesQuery.isFetching,
    error: hoursQuery.error || waitTimesQuery.error,
  };
}
