'use client';

import { useState, useEffect } from 'react';
import { getAvailableHours, getWaitTimes } from '@/lib/api';
import Selector from './Selector';
import WaitTimesTable from './WaitTimesTable';
import WaitTimesTableSkeleton from './TableSkeleton';
import { airportNameMap, IAirportCheckInTime } from '@/lib/models';
import Image from 'next/image';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import CurrentTime from '@/components/CurrentTime';

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
    (async() => {
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
    (async() => {
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

  const nameToCodeMap = Object.fromEntries(
    Object.entries(airportNameMap).map(([code, name]) => [name, code])
  );

  const airportNames = airports.map((code) => airportNameMap[code] || code);
  const dateOptions = dates.map((d) => `${dayjs(d).format('YYYY-MM-DD')} (${dayjs(d).format('dd')})`);
  dayjs.locale('ko');

  return (
    <>
      <div className="mb-10">
        <Image src="/GDT_favicon.svg" alt="logo" height={48} width={48} className="mx-auto mb-2" />
        <h1 className="text-2xl font-bold mb-2">실시간 공항 탑승 수속시간</h1>
        <p className="text-sm text-gray-600">현재 김포공항과 제주공항만 서비스합니다.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Selector
          data={airportNames}
          value={airportNameMap[selAirport] || selAirport}
          onChange={(label) => {
            const code = nameToCodeMap[label];
            if (code) setSelAirport(code);
          }}
          label="공항"
        />
        <Selector
          data={dateOptions}
          value={`${dayjs(selDate).format('YYYY-MM-DD')} (${dayjs(selDate).format('dd')})`}
          onChange={(label) => setSelDate(label.split(' ')[0])}
          label="날짜"
        />
        <Selector data={hourList} value={selHour} onChange={setSelHour} label={'시간'} />
      </div>
      <div className="relative overflow-x-auto">
        {dataLoading && !data ? (
          <WaitTimesTableSkeleton />
        ) : (
          <WaitTimesTable data={data || []} />
        )}
      </div>
    </>
  );
}
