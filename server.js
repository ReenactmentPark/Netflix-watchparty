const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// ✅ CORS 처리 (모든 origin 허용)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// JSON 파일 생성
const DATA_FILE = path.join(__dirname, 'latest.json');
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ currentTime: 0, duration: 0, title: '' }));
}

// POST /update
app.post('/update', (req, res) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(req.body));
  res.sendStatus(200);
});

// OPTIONS 핸들링 (중요!)
app.options('/update', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(204);
});

// GET /current
app.get('/current', (req, res) => {
  res.type('application/json').send(fs.readFileSync(DATA_FILE));
});

// GET /obs
app.get('/obs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'obs.html'));
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중 on port ${PORT}`);
});
