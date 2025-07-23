'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

export default function CurrentTime() {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000); // 1초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-lg text-gray-600 text-center font-bold">
      {now.format('YYYY년 M월 D일(dd) HH시 mm분 ss초')}
    </div>
  );
}
