import cron from 'node-cron';
import dotenv from 'dotenv';
import express from 'express';
import fetchAndSaveWaitTime from './fetcher.js';
import cors from 'cors';

dotenv.config();
app.use(cors());

const app = express();
const PORT = process.env.PORT || 3000;



// ⏰ 5분마다 실행
cron.schedule('*/5 * * * *', fetchAndSaveWaitTime);

app.get('/', (req, res) => res.send('⏱️ 공항 대기시간 수집기 작동 중'));
app.get('/api/wait-times', async (req, res) => {
  const result = await pool.query('SELECT * FROM airport_wait_time ORDER BY created_at DESC LIMIT 20');
  res.json(result.rows);
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행됨: http://localhost:${PORT}`);
  fetchAndSaveWaitTime(); // 초기 호출
});