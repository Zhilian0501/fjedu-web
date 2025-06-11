import express from 'express';
import authRoutes from './api/auth.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api', authRoutes);
app.use(express.static('.')); // 提供 index.html 等靜態資源

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`伺服器啟動於 http://localhost:${port}`));
