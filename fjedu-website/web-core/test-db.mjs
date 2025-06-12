import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306,
    });

    const [rows] = await conn.execute('SELECT 1 + 1 AS result');
    console.log('資料庫連線成功 ✅：', rows);
    await conn.end();
  } catch (err) {
    console.error('❌ 資料庫連線失敗：', err);
  }
};

testConnection();
