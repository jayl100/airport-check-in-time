export interface IAirportCheckInTime {
  airport_code: string;
  processed_at: string;
  wait_all: number;
  wait_a: number;
  wait_b: number;
  wait_c: number;
  wait_d: number;
  created_at: string;
}

export const airportNameMap: Record<string, string> = {
  GMP: '김포공항',
  CJU: '제주공항',
  ICN: '인천공항',
};