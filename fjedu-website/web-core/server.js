import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { createClient } from 'redis';
import connectRedisPkg from 'connect-redis';

const app = express();

const allowedOrigins = ['https://fjedu.online'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ⬇️ 一定要加這段來處理 OPTIONS 預檢請求
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(204);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const RedisStore = connectRedisPkg(session);

async function startServer() {
  const redisClient = createClient({
    url: 'redis://default:mzxNyvzKSwdZzulgKQSedOnHRyBTiyFY@switchyard.proxy.rlwy.net:39910'
  });

  redisClient.on('connect', () => console.log('✅ Redis 連線成功'));
  redisClient.on('error', err => console.error('❌ Redis 錯誤:', err));

  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Redis 連線失敗', err);
    process.exit(1);
  }

  app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',  // production 才啟用
      sameSite: 'none',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }
  }));

  app.use('/api', memberRouter);
  app.use('/api', loginRouter);
  app.use('/api', sessionRouter);

  const PORT = process.env.PORT || 10000;
  app.listen(PORT, () => {
    console.log(`🚀 伺服器啟動在埠號: ${PORT}`);
  });
}

startServer();

// 全域錯誤處理
app.use((err, req, res, next) => {
  console.error('全域錯誤:', err);
  res.status(500).json({ error: '伺服器錯誤' });
});
