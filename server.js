const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

//  CORS 처리
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// JSON 파일 경로
const DATA_FILE = path.join(__dirname, 'latest.json');
const EMPTY_DATA = { currentTime: '--:--', duration: '--:--', title: 'ing' };

// 초기 데이터 생성
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(EMPTY_DATA));
}

//  타임아웃 감지
let lastUpdate = Date.now();
const TIMEOUT_MS = 10 * 60 * 1000; // 10분

setInterval(() => {
  if (Date.now() - lastUpdate > TIMEOUT_MS) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(EMPTY_DATA));
  }
}, 60 * 1000); // 1분마다 검사

// post /update
app.post('/update', (req, res) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(req.body));
  lastUpdate = Date.now(); //  최신 타임스탬프 갱신
  res.sendStatus(200);
});

// options /update
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
  console.log(` 서버 실행 중 on port ${PORT}`);
});
