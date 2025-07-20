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
  created_at_kst: {
    type: DataTypes.DATE,
    allowNull: true
  },
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
  const createdAtKST = dayjs(instance.created_at).tz('Asia/Seoul');
  instance.created_at_kst = createdAtKST.toDate();

  const processedTime = instance.processed_at; // e.g. '23:55'
  const processedDatetimeKST = dayjs(
    `${createdAtKST.format('YYYY-MM-DD')} ${processedTime}`,
    'YYYY-MM-DD HH:mm'
  ).toDate();

  instance.processed_datetime_kst = processedDatetimeKST;
});

export default AirportWaitTime;