# Netflix Timer Server

## 📌 개요
- Netflix 콘텐츠에서 재생시간 / 제목을 **content script**로 추출하여 `/update` 엔드포인트로 전송
- 서버는 최신 정보를 `latest.json`에 저장
- `/obs` 경로에 브라우저 소스 UI 제공 → OBS에 이 주소를 추가해 타이머 표시 가능

## 💻 사용법 (전체 구조)
1. **Chrome 확장 (content.js)** 에서 `http(s)://YOUR_SERVER/update`로 POST
2. **OBS 브라우저 소스**에 `http(s)://YOUR_SERVER/obs` URL 입력
3. 실시간 타이머와 제목 표시됨

## 🚀 배포 (Railway 등)
```bash
npm install
npm start
