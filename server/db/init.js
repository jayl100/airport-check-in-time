import sequelize from './sequelize.js';
import AirportWaitTime from '../models/airportWaitTime.js';

export async function initializeDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB 연결 성공');

    await sequelize.sync({ alter: false }); // 테이블이 이미 있으면 건드리지 않음
    console.log('✅ Sequelize 동기화 완료');
  } catch (err) {
    console.error('❌ DB 초기화 실패:', err);
    process.exit(1); // 치명적 에러 시 앱 종료
  }
}
