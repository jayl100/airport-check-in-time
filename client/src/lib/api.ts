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

// ✅ 사용 가능한 날짜 목록
export const getAvailableDates = () => {
  return http.get('/api/wait-times/dates');
};

// ✅ 사용 가능한 시간 목록 (날짜 필수, 공항 선택)
export const getAvailableHours = (date: string, airport?: string) => {
  return http.get('/api/wait-times/hours', {
    params: { date, airport },
  });
};

// ✅ 사용 가능한 공항 목록
export const getAvailableAirports = () => {
  return http.get('/api/wait-times/airports');
};
