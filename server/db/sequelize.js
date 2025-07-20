import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
      useUTC: false,        // JS → DB 로컬타임(Asia/Seoul)으로 쓰려면 false
    },
    timezone: '+09:00',     // JS → DB 로 넘어갈 때 KST 로 변환
  },
  logging: false,
});

export default sequelize;
