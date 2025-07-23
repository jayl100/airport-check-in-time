import React from 'react';
import formatSeconds from '../util/formatter';
import { airportNameMap, IAirportCheckInTime } from '@/lib/models';

interface Props {
  data: IAirportCheckInTime[];
}

export default function WaitTimesTable({ data }: Props) {
  return (
    <table className="mx-auto border-collapse w-full overflow-hidden table-fixed">
      <thead>
      <tr className="bg-[#93FFDC]">
        <th className="w-[10%] px-[22px] py-4 border-b border-[#d9d9d9] text-[1rem]">공항</th>
        <th className="w-[10%] px-[22px] py-4 border-b border-[#d9d9d9] text-[1rem]">처리 시각</th>
        <th className="w-[10%] px-[22px] py-4 border-b border-[#d9d9d9] text-[1rem]">전체 평균</th>
        <th className="w-[10%] px-[22px] py-4 border-b border-[#d9d9d9] text-[1rem]">체크인 & 수화물</th>
        <th className="w-[10%] px-[22px] py-4 border-b border-[#d9d9d9] text-[1rem]">신원확인</th>
        <th className="w-[10%] px-[22px] py-4 border-b border-[#d9d9d9] text-[1rem]">보안검사</th>
        <th className="w-[10%] px-[22px] py-4 border-b border-[#d9d9d9] text-[1rem]">비행기 탑승</th>
      </tr>
      </thead>
      <tbody>
      {data.map((item, i) => (
        <tr key={i} className="hover:bg-[#f9f9f9]">
          <td className="text-center px-[22px] py-4 border-b border-[#d9d9d9]">{airportNameMap[item.airport_code] ?? item.airport_code}</td>
          <td className="text-center px-[22px] py-4 border-b border-[#d9d9d9]">{item.processed_at}</td>
          <td className="text-center px-[22px] py-4 border-b border-[#d9d9d9] bg-[#f9f9f9]">{formatSeconds(item.wait_all)}</td>
          <td className="text-center px-[22px] py-4 border-b border-[#d9d9d9]">{formatSeconds(item.wait_a)}</td>
          <td className="text-center px-[22px] py-4 border-b border-[#d9d9d9]">{formatSeconds(item.wait_b)}</td>
          <td className="text-center px-[22px] py-4 border-b border-[#d9d9d9]">{formatSeconds(item.wait_c)}</td>
          <td className="text-center px-[22px] py-4 border-b border-[#d9d9d9]">{formatSeconds(item.wait_d)}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}
