# 이메일 알림 백엔드 구현 가이드

## 개요
프론트엔드에서는 보안 정책으로 직접 SMTP를 사용할 수 없으므로, 별도의 백엔드 서버에서 이메일 전송을 처리합니다.

## 구현 방법

### 1. Node.js + Express 서버

#### 설치
```bash
npm install express nodemailer cors
npm install -D nodemon
```

#### 서버 실행
```bash
npm run dev  # 개발 모드
npm start    # 프로덕션 모드
```

#### API 엔드포인트
- `POST /api/send-email` - 일반 이메일 전송
- `POST /api/send-assignment-notification` - 수행평가 알림 전송

### 2. Supabase Edge Functions

#### 파일 구조
```
supabase/
  functions/
    send-email/
      index.ts
```

#### 배포
```bash
supabase functions deploy send-email
```

#### 호출 URL
```
https://[project-id].supabase.co/functions/v1/send-email
```

## 환경변수 설정

### Node.js 서버
```javascript
// .env 파일
PORT=3001
SMTP_USER=your_naver_id
SMTP_PASS=your_app_password
```

### Supabase Edge Functions
Supabase 대시보드에서 환경변수 설정

## 네이버 메일 설정

1. 네이버 메일 계정으로 로그인
2. 환경설정 > IMAP/SMTP 설정
3. SMTP 사용: 사용함
4. 앱 비밀번호 발급 (2단계 인증 필요)

## 보안 고려사항

- 앱 비밀번호를 사용하세요 (계정 비밀번호 아님)
- 환경변수에 민감한 정보 저장
- CORS 설정으로 도메인 제한
- Rate limiting 구현 고려

## 테스트

```bash
# 서버 실행 후
curl -X POST http://localhost:3001/api/send-assignment-notification \
  -H "Content-Type: application/json" \
  -d '{"recipientEmail":"test@example.com","assignmentTitle":"수학 과제"}'
```