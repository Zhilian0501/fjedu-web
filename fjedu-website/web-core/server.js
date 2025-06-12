import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors({
  origin: 'https://fjedu-web.pages.dev',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', (req, res) => {
  res.sendStatus(204);
});

app.post('/api/member', (req, res) => {
  res.json({ message: 'POST /api/member success' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
