'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAvailableAirports, getAvailableDates } from '@/lib/api';

/**
 * 공항 목록과 날짜 목록을 동시에 가져오는 훅
 */
export function useAirportData() {
  // 공항 목록
  const airportsQuery = useQuery({
    queryKey: ['airportData', 'airports'],
    queryFn: getAvailableAirports,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const datesQuery = useQuery({
    queryKey: ['airportData', 'dates'],
    queryFn: getAvailableDates,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });


  return {
    airports: airportsQuery.data || [],
    dates: datesQuery.data || [],
    loading: airportsQuery.isLoading || datesQuery.isLoading,
    error: airportsQuery.error || datesQuery.error,
  };
}