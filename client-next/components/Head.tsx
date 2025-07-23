'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

function Head() {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000); // 1초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto bg-gray-100 h-16">
      <div className="px-4 text-center tablet:px-10 h-full flex flex-col items-center justify-center w-full">
        <div className="text-lg text-gray-600 text-center font-bold">
          {now.format('YYYY년 M월 D일(dd) HH시 mm분 ss초')}
        </div>
      </div>
    </div>
  );
}

export default Head;