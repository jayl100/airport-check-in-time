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
app.get('/api/wait-times', async (req, res) => {
  const {
    airport,     // 'GMP', 'CJU'
    date,        // '2025-07-20'
    hour,        // '09'
    page = 1,
    limit = 20,
  } = req.query;
  const where = {};

  if (airport) where.airport_code = airport;

  if (date) {
    where.created_at = Sequelize.where(
      Sequelize.fn('DATE', Sequelize.col('created_at')), date
    );
  }

  if (hour) {
    where.processed_at = {
      [Op.like]: `${hour}:%`,
    };
  }

  const offset = (Number(page) - 1) * Number(limit);
  const total = await AirportWaitTime.count({ where });

  try {
    const result = await AirportWaitTime.findAll({
      where,
      limit: Number(limit),
      offset,
      order: [['created_at', 'DESC']],
    });
    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      data: result
    });
  } catch (err) {
    console.error('❌ 데이터 조회 실패:', err);
    res.status(500).json({ error: '서버 오류' });
  }
});

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
