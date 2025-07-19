import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize.js';

class AirportWaitTime extends Model {}

AirportWaitTime.init({
  airport_code: { type: DataTypes.STRING, allowNull: false },
  processed_at: { type: DataTypes.STRING, allowNull: false },
  wait_all: DataTypes.INTEGER,
  wait_a: DataTypes.INTEGER,
  wait_b: DataTypes.INTEGER,
  wait_c: DataTypes.INTEGER,
  wait_d: DataTypes.INTEGER,
}, {
  sequelize,
  modelName: 'airport_wait_time',
  tableName: 'airport_wait_time',
  timestamps: false,
});

export default AirportWaitTime;
