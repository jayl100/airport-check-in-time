export default function WaitTimesTableSkeleton() {
  return (
    <table className="mx-auto border-collapse w-full overflow-hidden">
      <thead>
      <tr className="bg-[#93FFDC]">
        {['공항', '처리 시각', '전체 평균', '체크인 & 수화물', '신원확인', '보안검사', '비행기 탑승'].map((label, i) => (
          <th key={i} className="px-[22px] py-4 border-b border-[#d9d9d9] text-[1rem]">{label}</th>
        ))}
      </tr>
      </thead>
      <tbody>
      {[...Array(5)].map((_, rowIdx) => (
        <tr key={rowIdx} className="animate-pulse bg-gray-100">
          {Array(7).fill(null).map((_, colIdx) => (
            <td key={colIdx} className="text-center px-[22px] py-4 border-b border-[#d9d9d9]">
              <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto" />
            </td>
          ))}
        </tr>
      ))}
      </tbody>
    </table>
  );
}
