// test-db.mjs
import 'dotenv/config';
import mysql from 'mysql2/promise';

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ 資料庫連線成功！");
    await connection.end();
  } catch (err) {
    console.error("❌ 資料庫連線失敗：", err);
  }
}

testConnection();
