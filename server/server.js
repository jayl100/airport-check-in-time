import cron from 'node-cron';
import dotenv from 'dotenv';
import express from 'express';
import fetchAndSaveWaitTime from './fetcher.js';
import cors from 'cors';
import { initializeDB } from './db/init.js';
import waitTimesRouter from './routes/waitTimesRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [process.env.URL_LOCAL, process.env.URL_CLIENT];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
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
