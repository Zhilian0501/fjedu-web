import express from 'express';
import authRoutes from './routes/auth.js';

const app = express();
app.use(express.json());

app.use('/api', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`伺服器已啟動：http://localhost:${PORT}`);
});
