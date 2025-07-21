import http from '../lib/http';
export async function getWaitTimes(params) {
    const response = await http.get('/api/wait-times/', { params });
    return response.data;
}
// 공항 목록 조회
export async function getAvailableAirports() {
    return http.get('/api/wait-times/airports');
}
// 날짜 목록 조회
export async function getAvailableDates() {
    return http.get('/api/wait-times/dates');
}
// 시간 목록 조회
export async function getAvailableHours(date, airport) {
    return http.get(`/api/wait-times/hours?`, {
        params: { date, airport },
    });
}
