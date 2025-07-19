// 📁 server/routes/waitTimes.js
import express from 'express';
import { Op, Sequelize } from 'sequelize';
import AirportWaitTime from '../models/airportWaitTime.js';
import sequelize from '../db/sequelize.js';

const router = express.Router();

// ✅ 날짜 목록 조회
router.get('/dates', async (req, res) => {
  try {
    const result = await AirportWaitTime.findAll({
      attributes: [
        [Sequelize.fn(
          'to_char',
          Sequelize.literal(`created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul'`),
          'YYYY-MM-DD'
        ), 'kst_date']
      ],
      group: ['kst_date'],
      order: [[Sequelize.literal('kst_date'), 'DESC']]
    });

    const dates = result.map(row => row.getDataValue('kst_date'));
    res.json(dates);
  } catch (err) {
    console.error('❌ 날짜 조회 실패:', err);
    res.status(500).json({ error: '서버 오류' });
  }
});


// ✅ 시간 목록 조회
router.get('/hours', async (req, res) => {
  const { date, airport } = req.query;

  if (!date) return res.status(400).json({ error: '날짜가 필요합니다.' });

  try {
    const where = [];

    if (airport) {
      where.push(`airport_code = '${airport}'`);
    }

    where.push(`to_char(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD') = '${date}'`);

    const query = `
      SELECT DISTINCT 
        to_char(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul', 'HH24') AS kst_hour
      FROM airport_wait_time
      WHERE ${where.join(' AND ')}
      ORDER BY kst_hour ASC
    `;

    const [rows] = await sequelize.query(query);
    const hours = rows.map(r => r.kst_hour);
    res.json(hours);
  } catch (err) {
    console.error('❌ 시간 조회 실패:', err);
    res.status(500).json({ error: '서버 오류' });
  }
});

// GET /api/wait-times/airports
router.get('/airports', async (req, res) => {
  try {
    const result = await AirportWaitTime.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('airport_code')), 'airport_code']
      ],
      order: [[Sequelize.col('airport_code'), 'ASC']]
    });

    const airports = result.map(row => row.getDataValue('airport_code'));
    res.json(airports);
  } catch (err) {
    console.error('❌ 공항 목록 조회 실패:', err);
    res.status(500).json({ error: '서버 오류' });
  }
});



// ✅ 대기시간 조회 with 조건
router.get('/wait-times', async (req, res) => {
  try {
    const { airport, date, hour, page = 1, limit = 20 } = req.query;
    const where = {};

    if (airport) where.airport_code = airport;
    if (date)
      where.created_at = Sequelize.where(
        Sequelize.fn('DATE', Sequelize.col('created_at')),
        date
      );
    if (hour)
      where.processed_at = Sequelize.where(
        Sequelize.fn('LEFT', Sequelize.col('processed_at'), 2),
        hour
      );

    const results = await AirportWaitTime.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json(results);
  } catch (err) {
    console.error('❌ 대기시간 조회 에러:', err);
    res.status(500).json({ error: '대기시간 조회 실패' });
  }
});

export default router;
