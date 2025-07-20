import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

class AirportWaitTime extends Model {}

AirportWaitTime.init({
  airport_code: { type: DataTypes.STRING, allowNull: false },
  opr_status: DataTypes.INTEGER,
  processed_at: { type: DataTypes.STRING, allowNull: false },
  wait_all: DataTypes.INTEGER,
  wait_a: DataTypes.INTEGER,
  wait_b: DataTypes.INTEGER,
  wait_c: DataTypes.INTEGER,
  wait_d: DataTypes.INTEGER,
  processed_datetime_kst: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'airport_wait_time',
  tableName: 'airport_wait_time',
  timestamps: false,
});

AirportWaitTime.beforeCreate((instance) => {
  // 1) 지금 KST 시각
  const nowKst = dayjs().tz('Asia/Seoul');

  // 2) API에서 넘어온 'HH:mm' 파싱
  const [hh, mm] = instance.processed_at.split(':').map(Number);

  // 3) 오늘 날짜에 그 시각 붙여본다
  let dt = nowKst.hour(hh).minute(mm).second(0).millisecond(0);

  // 4) 만약 그 시각이 아직 오지 않은(== 미래) 시각이면, 전날로 조정
  if (dt.isAfter(nowKst)) {
    dt = dt.subtract(1, 'day');
  }

  // 5) 최종 datetime 과 날짜 컬럼에 반영
  instance.processed_datetime_kst = dt.toDate();
});

export default AirportWaitTime;