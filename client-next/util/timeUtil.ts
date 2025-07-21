import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const toKST = (utcString: string | Date): string => {
  return dayjs.utc(utcString).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm');
};

export const toKSTDate = (utcString: string | Date): string => {
  return dayjs.utc(utcString).tz('Asia/Seoul').format('YYYY-MM-DD');
};

export const toKSTHour = (utcString: string | Date): string => {
  return dayjs.utc(utcString).tz('Asia/Seoul').format('HH');
};
