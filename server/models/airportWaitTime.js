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
    type: DataTypes.DATEONLY,
    allowNull: true
  },
}, {
  sequelize,
  modelName: 'airport_wait_time',
  tableName: 'airport_wait_time',
  timestamps: false,
});

AirportWaitTime.beforeCreate((instance) => {
  const kstDate = dayjs(instance.created_at).tz('Asia/Seoul').format('YYYY-MM-DD');
  instance.created_at_kst = kstDate;
});

export default AirportWaitTime;
