import ClientHomePage from '@/components/ClientHomePage';
import { getAvailableAirports, getAvailableDates } from '@/lib/api';
import Container from '@/components/Container';
import Head from '@/components/Head';

export default async function Page() {
  // 서버에서 미리 받아오는 초기 데이터
  const airports = await getAvailableAirports();
  const dates = await getAvailableDates();

  return (
    <>
      <Head />
      <Container>
        <ClientHomePage
          initialAirports={airports}
          initialDates={dates}
        />
      </Container>
    </>
  );
}