// 📁 server/routes/waitTimes.js
import express from 'express';
import { Op, Sequelize } from 'sequelize';
import AirportWaitTime from '../models/airportWaitTime.js';

const router = express.Router();

// ✅ 날짜 목록 조회
router.get('/dates', async (req, res) => {
  try {
    const results = await AirportWaitTime.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date']
      ],
      group: ['date'],
      order: [[Sequelize.literal('date'), 'DESC']],
      raw: true,
    });
    res.json(results.map(r => r.date));
  } catch (err) {
    console.error('❌ 날짜 목록 에러:', err);
    res.status(500).json({ error: '날짜 목록 조회 실패' });
  }
});

// ✅ 시간 목록 조회
router.get('/hours', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: '날짜가 필요합니다' });

    const results = await AirportWaitTime.findAll({
      attributes: [
        [Sequelize.fn('LEFT', Sequelize.col('processed_at'), 2), 'hour']
      ],
      where: Sequelize.where(Sequelize.fn('DATE', Sequelize.col('created_at')), date),
      group: ['hour'],
      order: [[Sequelize.literal('hour'), 'ASC']],
      raw: true,
    });
    res.json(results.map(r => r.hour));
  } catch (err) {
    console.error('❌ 시간 목록 에러:', err);
    res.status(500).json({ error: '시간 목록 조회 실패' });
  }
});

// ✅ 공항 목록 조회
router.get('/airports', async (req, res) => {
  try {
    const results = await AirportWaitTime.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('airport_code')), 'airport_code']],
      raw: true,
    });
    res.json(results.map(r => r.airport_code));
  } catch (err) {
    console.error('❌ 공항 목록 에러:', err);
    res.status(500).json({ error: '공항 목록 조회 실패' });
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
