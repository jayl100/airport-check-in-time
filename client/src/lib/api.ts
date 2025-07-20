import http from '../lib/http';

export async function getWaitTimes(params: {
  airport?: string;
  date?: string;
  hour?: string;
  page?: number;
  limit?: number;
}) {
  const response = await http.get('/api/wait-times/', { params });
  return response.data;
}

// 날짜 목록 조회
export async function getAvailableDates() {
  return http.get('/api/wait-times/dates');
}

// 시간 목록 조회
export async function getAvailableHours(date: string, airport?: string) {
  return http.get('/api/wait-times/hours', {
    params: { date, airport },
  });
}

// 공항 목록 조회
export async function getAvailableAirports() {
  return http.get('/api/wait-times/airports');
}
