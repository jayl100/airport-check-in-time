import axios from 'axios';
import pool from './db.js';
import qs from 'qs';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_BASE_URL;
const API_AUTH_KEY = process.env.API_AUTH_KEY.trim();
const AIRPORT_CODES = ['GMP', 'CJU'];

async function fetchAndSaveWaitTime() {
  const results = [];

  for (const code of AIRPORT_CODES) {
    const data = await fetchcOnly(code);
    results.push({ code, data });
  }

  for (const { code, data } of results) {
    if (data && data.length > 0) {
      await saveToDB(code, data);
    }
  }

  async function fetchcOnly(code) {
    const tryFetch = async(retry = false) => {
      console.log(`📡 요청 중: ${code}${retry ? ' (재시도)' : ''}`);

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Infuser ${API_AUTH_KEY}`,
        },
        params: {
          page: 1,
          perPage: 10,
          'cond[IATA_APCD::EQ]': code,
        },
        paramSerializer: (params) => qs.stringify(params, { encode: false }),
      });

      const result = response.data;
      const data = result.data;

      if (!Array.isArray(data) || result.matchCount === 0 || data.length === 0) {
        if (!retry) {
          console.log(`⚠️ ${code} 결과 없음 → 2초 후 재시도`);
          await new Promise((res) => setTimeout(res, 2000));
          return await tryFetch(true);
        } else {
          console.log(`❌ ${code} 결과 없음 (재시도 후에도 실패)`);
          return null;
        }
      }

      return data;
    };

    try {
      return await tryFetch(false);
    } catch (error) {
      console.error(`[❌] ${code} 요청 실패:`, err.response?.status, err.response?.data || err.message);
      return null;
    }
  }
}

async function saveToDB(code, data) {
  try {
    for (const row of data) {
      const {
        IATA_APCD,
        OPR_STS_CD,
        PRC_HR,
        STY_TCT_AVG_ALL,
        STY_TCT_AVG_A,
        STY_TCT_AVG_B,
        STY_TCT_AVG_C,
        STY_TCT_AVG_D,
      } = row;

      await pool.query(
        `INSERT INTO airport_wait_time
         (airport_code, opr_status, processed_at, wait_all, wait_a, wait_b, wait_c, wait_d)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          IATA_APCD,
          OPR_STS_CD,
          PRC_HR,
          STY_TCT_AVG_ALL,
          STY_TCT_AVG_A,
          STY_TCT_AVG_B,
          STY_TCT_AVG_C,
          STY_TCT_AVG_D,
        ]
      );
    }
    console.log(`✅ 저장 완료 (${data.length}건)`);
  } catch (err) {
    console.error('[❌] 저장 실패:', err.response?.status, err.response?.data || err.message);
  }
}

export default fetchAndSaveWaitTime;