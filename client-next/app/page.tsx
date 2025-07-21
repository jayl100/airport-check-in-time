import ClientHomePage from '@/components/ClientHomePage';
import { getAvailableAirports, getAvailableDates } from '@/lib/api';

export default async function Page() {
  // 서버에서 미리 받아오는 초기 데이터
  const airports = await getAvailableAirports();
  const dates = await getAvailableDates();

  return (
    <main className="max-w-screen-lg mx-auto px-4 py-16 text-center">
      <ClientHomePage
        initialAirports={airports}
        initialDates={dates}
      />
    </main>
  );
}