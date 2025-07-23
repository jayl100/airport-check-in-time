// 📁 server/routes/waitTimes.js
import express from 'express';
import { Op, Sequelize } from 'sequelize';
import AirportWaitTime from '../models/airportWaitTime.js';
import sequelize from '../db/sequelize.js';

const router = express.Router();

// ✅ 날짜 목록 조회 (KST 기준으로 DATE만 추출)
router.get('/dates', async (req, res) => {
  try {
    const dates = await AirportWaitTime.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.fn('DATE', Sequelize.col('processed_datetime_kst'))), 'date'],
      ],
      order: [[Sequelize.literal('date'), 'DESC']],
    });
    res.json(dates.map(r => r.get('date')));
  } catch (err) {
    console.error('❌ 날짜 조회 실패:', err);
    res.status(500).json({ error: '서버 오류' });
  }
});

// ✅ 시간 목록 조회 (해당 날짜, 공항 기준으로 시(hour)만 추출)
router.get('/hours', async (req, res) => {
  const { date, airport } = req.query;
  if (!date) return res.status(400).json({ error: '날짜가 필요합니다.' });

  try {
    const whereConditions = [
      Sequelize.where(
        Sequelize.fn('DATE', Sequelize.col('processed_datetime_kst')),
        date
      )
    ];
    if (airport) whereConditions.push({ airport_code: airport });

    const hours = await AirportWaitTime.findAll({
      where: { [Op.and]: whereConditions },
      attributes: [
        // to_char로 시(hour)만 추출한 뒤 DISTINCT
        [
          Sequelize.literal(`DISTINCT to_char("processed_datetime_kst", 'HH24')`),
          'hour'
        ]
      ],
      order: [[Sequelize.literal(`hour`), 'ASC']],
    });

    // 이미 '00' ~ '23' 문자열
    res.json(hours.map(r => r.get('hour')));
  } catch (err) {
    console.error('❌ 시간 조회 실패:', err);
    res.status(500).json({ error: '서버 오류' });
  }
});
// ✅ 공항 목록 조회
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

// ✅ 대기시간 데이터 조회
router.get('/', async (req, res) => {
  try {
    const { airport, date, hour, page = 1, limit = 20 } = req.query;
    const whereClauses = [];

    if (airport) whereClauses.push({ airport_code: airport });
    if (date) {
      whereClauses.push(
        Sequelize.where(
          Sequelize.fn('DATE', Sequelize.col('processed_datetime_kst')),
          date
        )
      );
    }
    if (hour) {
      whereClauses.push(
        // processed_datetime_kst의 시가 쿼리파라미터 hour와 같아야
        Sequelize.where(
          Sequelize.literal(`to_char("processed_datetime_kst", 'HH24')`),
          hour
        )
      );
    }

    const where = whereClauses.length ? { [Op.and]: whereClauses } : {};

    const data = await AirportWaitTime.findAll({
      where,
      order: [['processed_datetime_kst', 'ASC']],
      limit:  parseInt(limit,  10),
      offset: (parseInt(page,  10) - 1) * parseInt(limit, 10),
    });

    const total = await AirportWaitTime.count({ where });

    res.json({
      total,
      page:       parseInt(page,  10),
      limit:      parseInt(limit, 10),
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (err) {
    console.error('❌ 대기시간 조회 에러:', err);
    res.status(500).json({ error: '대기시간 조회 실패' });
  }
});
export default router;