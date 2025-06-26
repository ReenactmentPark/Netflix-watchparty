const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 저장 JSON 초기파일 생성
const DATA_FILE = path.join(__dirname, 'latest.json');
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({currentTime:0,duration:0,title:''}));

// POST /update: 타이머 정보 수신
app.post('/update', (req, res) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(req.body));
  res.sendStatus(200);
});

// GET /current: 최신 정보 응답
app.get('/current', (req, res) => {
  res.type('application/json').send(fs.readFileSync(DATA_FILE));
});

// GET /obs: OBS 브라우저 소스 UI
app.get('/obs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'obs.html'));
});

app.listen(PORT, () => {
  console.log(`>> Netflix Timer Server running on port ${PORT}`);
});
