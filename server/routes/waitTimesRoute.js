// 📁 server/routes/waitTimes.js
import express from 'express';
import { Op, Sequelize } from 'sequelize';
import AirportWaitTime from '../models/airportWaitTime.js';
import sequelize from '../db/sequelize.js';

const router = express.Router();

// ✅ 날짜 목록 조회
router.get('/dates', async (req, res) => {
  try {
    const dates = await AirportWaitTime.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('created_at_kst')), 'date'],
      ],
      order: [[Sequelize.col('date'), 'DESC']],
    });
    const dateList = dates.map((row) => row.get('date'));
    res.json(dateList);
  } catch (err) {
    console.error('❌ 날짜 조회 실패:', err);
    res.status(500).json({ error: '서버 오류' });
  }
});

// ✅ 시간 목록 조회
router.get('/hours', async (req, res) => {
  const { date, airport } = req.query;

  if (!date) return res.status(400).json({ error: '날짜가 필요합니다.' });

  const where = { created_at_kst: date };
  if (airport) where.airport_code = airport;

  try {
    const hours = await AirportWaitTime.findAll({
      where,
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.fn('SUBSTRING', Sequelize.col('processed_at'), 1, 2)), 'hour'],
      ],
      order: [[Sequelize.literal('hour'), 'ASC']],
    });
    const hourList = hours.map((row) => row.get('hour'));
    res.json(hourList);
  } catch (err) {
    console.error('❌ 시간 조회 실패:', err);
    res.status(500).json({ error: '서버 오류' });
  }
});

// ✅ 공항 코드 목록 조회
router.get('/airports', async (req, res) => {
  try {
    const airports = await AirportWaitTime.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('airport_code')), 'airport'],
      ],
      order: [[Sequelize.col('airport'), 'ASC']],
    });
    const airportList = airports.map((row) => row.get('airport'));
    res.json(airportList);
  } catch (err) {
    console.error('❌ 공항 조회 실패:', err);
    res.status(500).json({ error: '서버 오류' });
  }
});

// ✅ 대기시간 조회 with 조건
// ✅ routes/waitTimesRoute.js

router.get('/', async (req, res) => {
  try {
    const { airport, date, hour, page = 1, limit = 20 } = req.query;
    const whereConditions = [];

    if (airport) {
      whereConditions.push({ airport_code: airport });
    }

    if (date) {
      whereConditions.push(
        Sequelize.where(
          Sequelize.fn('DATE', Sequelize.col('created_at_kst')),
          date
        )
      );
    }

    if (hour) {
      whereConditions.push(
        Sequelize.where(
          Sequelize.fn('LEFT', Sequelize.col('processed_at'), 2),
          hour
        )
      );
    }

    const results = await AirportWaitTime.findAll({
      where: {
        [Op.and]: whereConditions,
      },
      order: [['created_at_kst', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    const total = await AirportWaitTime.count({ whereConditions });

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      data: results,
    });
  } catch (err) {
    console.error('❌ 대기시간 조회 에러:', err);
    res.status(500).json({ error: '대기시간 조회 실패' });
  }
});


export default router;
