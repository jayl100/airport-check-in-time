import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
export const toKST = (utcString) => {
    return dayjs.utc(utcString).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm');
};
export const toKSTDate = (utcString) => {
    return dayjs.utc(utcString).tz('Asia/Seoul').format('YYYY-MM-DD');
};
export const toKSTHour = (utcString) => {
    return dayjs.utc(utcString).tz('Asia/Seoul').format('HH');
};
