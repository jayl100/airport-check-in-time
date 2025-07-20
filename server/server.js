import cron from 'node-cron';
import dotenv from 'dotenv';
import express from 'express';
import fetchAndSaveWaitTime from './fetcher.js';
import cors from 'cors';
import AirportWaitTime from './models/airportWaitTime.js';
import { initializeDB } from './db/init.js';
import { Op, Sequelize } from 'sequelize';
import waitTimesRouter from './routes/waitTimesRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => res.send('⏱️ 공항 대기시간 수집기 작동 중'));
app.use('/api/wait-times', waitTimesRouter);

async function startServer() {
  await initializeDB();

  app.listen(PORT, () => {
    console.log(`🚀 서버 실행됨: http://localhost:${PORT}`);

    if (process.env.NODE_ENV === 'production') {
      console.log('📡 프로덕션 모드 → 수집 스케줄러 작동');
      fetchAndSaveWaitTime();
      cron.schedule('*/5 * * * *', fetchAndSaveWaitTime);
    } else {
      console.log('🛠️ 개발 모드 → 수집 스케줄러 작동 안함');
    }
  });
}

startServer();
