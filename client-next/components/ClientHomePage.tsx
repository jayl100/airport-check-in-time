'use client';

import { useState, useEffect } from 'react';
import { getAvailableHours, getWaitTimes } from '@/lib/api';
import AirportSelector from './AirportSelector';
import DateSelector from './DateSelector';
import HourSelector from './HourSelector';
import WaitTimesTable from './WaitTimesTable';
import WaitTimesTableSkeleton from './TableSkeleton';
import { IAirportCheckInTime } from '@/lib/models';
import Image from 'next/image';

interface Props {
  initialAirports: string[];
  initialDates: string[];
}

export default function ClientHomePage({ initialAirports, initialDates }: Props) {
  const [airports] = useState(initialAirports);
  const [dates] = useState(initialDates);
  const [selAirport, setSelAirport] = useState(airports[0] || '');
  const [selDate, setSelDate] = useState(dates[0] || '');
  const [selHour, setSelHour] = useState('');

  const [hourList, setHourList] = useState<string[]>([]);
  const [data, setData] = useState<IAirportCheckInTime[] | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  // 시간 목록 가져오기
  useEffect(() => {
    if (!selAirport || !selDate) return;
    (async () => {
      try {
        const hours = await getAvailableHours(selDate, selAirport);
        setHourList(hours);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [selAirport, selDate]);

  // 기본 시간 자동 선택
  useEffect(() => {
    if (hourList.length) {
      setSelHour(hourList[hourList.length - 1]);
    }
  }, [hourList]);

  // 대기시간 데이터 가져오기
  useEffect(() => {
    if (!selAirport || !selDate || !selHour) return;
    setDataLoading(true);
    (async () => {
      try {
        const times = await getWaitTimes({
          airport: selAirport,
          date: selDate,
          hour: selHour,
          page: 1,
          limit: 20,
        });
        setData(times);
      } catch (e) {
        console.error(e);
      } finally {
        setDataLoading(false);
      }
    })();
  }, [selAirport, selDate, selHour]);

  return (
    <>
      <div className="mb-10 bg-gray-100 p-6 rounded-md">
        <Image src="/GDT_favicon.svg" alt="logo" height={48} className="mx-auto mb-2" />
        <h1 className="text-2xl font-bold">공항 탑승시간 측정</h1>
        <p className="text-sm text-gray-600">현재 김포공항과 제주공항만 서비스합니다.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <AirportSelector airports={airports} value={selAirport} onChange={setSelAirport} />
        <DateSelector dates={dates} value={selDate} onChange={setSelDate} />
        <HourSelector hours={hourList} value={selHour} onChange={setSelHour} />
      </div>

      <div className="relative">
        {dataLoading && !data ? (
          <WaitTimesTableSkeleton />
        ) : (
          <WaitTimesTable data={data || []} />
        )}
      </div>
    </>
  );
}
