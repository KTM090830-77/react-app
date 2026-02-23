# 무료 이메일 알림 구현 가이드 (서버 비용 없음)

## 옵션 1: EmailJS (가장 간단함)

### 장점
- 서버 불필요
- 클라이언트 사이드에서 직접 전송
- 무료 티어: 월 200통 이메일

### 설정 방법

1. **EmailJS 계정 생성**
   - https://www.emailjs.com/ 접속
   - 계정 생성 및 로그인

2. **Gmail/네이버 메일 연결**
   - Email Services → Add New Service
   - Gmail 선택 → ktm090830@naver.com 계정 연결
   - 앱 비밀번호: RPXUEDVZVEF3 사용

3. **이메일 템플릿 생성 (2개 필요)**

   **템플릿 1: 제출 알림용**
   - **Template Name**: Assignment Submitted
   - **Subject**: 수행평가 알림
   - **Content**:
     ```
     {{assignment_title}} 과제가 제출되었습니다.
     확인해주세요.
     ```

   **템플릿 2: 데일리 마감 알림용**
   - **Template Name**: Daily Deadline Reminder
   - **Subject**: 내일 마감 과제 알림
   - **Content**:
     ```
     안녕하세요!

     내일 마감인 수행평가가 {{total_count}}개 있습니다:

     {{assignment_list}}

     마감일을 놓치지 않도록 미리 확인해주세요!
     ```

4. **서비스 ID 및 키 확인**
   - **Service ID**: `service_cvqbc0q`
   - **Public Key**: Account → General → Public Key 복사
   - **Template IDs**: 각 템플릿 생성 후 ID 복사

   **.env 파일 설정:**
   ```env
   VITE_EMAILJS_SERVICE_ID=service_cvqbc0q
   VITE_EMAILJS_TEMPLATE_ID=template_your_submission_id
   VITE_EMAILJS_DAILY_TEMPLATE_ID=template_your_daily_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

## 🎨 HTML 템플릿 사용법

프로젝트에 포함된 HTML 템플릿 파일들을 EmailJS에 복사해서 사용하세요:

- `emailjs-template-submission.html` - 제출 알림용
- `emailjs-template-daily.html` - 데일리 알림용

### 템플릿 특징:
- 반응형 디자인 (모바일 호환)
- 이모지 아이콘으로 시각적 효과
- CSS 스타일링으로 전문적인 외관
- 이메일 클라이언트 호환성 고려
   ```html
   <!-- index.html -->
   <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/emailjs.min.js"></script>
   <script>
     emailjs.init('YOUR_PUBLIC_KEY'); // 대시보드에서 확인
   </script>
   ```

5. **React에서 사용**
   ```javascript
   const result = await emailjs.send(
     'YOUR_SERVICE_ID',
     'YOUR_TEMPLATE_ID',
     {
       to_email: recipientEmail,
       assignment_title: assignmentTitle,
     }
   );
   ```

## 옵션 2: Supabase Edge Functions (무료 티어)

### 장점
- 월 50만 Edge Function 호출 무료
- Supabase 프로젝트에 통합
- Deno 런타임 사용

### 설정 방법
```bash
# Supabase CLI 설치
npm install supabase --save-dev

# 프로젝트 초기화
supabase init

# Edge Function 생성
supabase functions new send-email

# 함수 배포
supabase functions deploy send-email
```

## 옵션 3: Netlify Functions (무료 티어)

### 장점
- 월 125k 함수 호출 무료
- 배포가 쉬움

### 설정 방법
```javascript
// netlify/functions/send-email.js
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  // 이메일 전송 로직
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
```

## 옵션 4: Vercel Functions (무료 티어)

### 장점
- 월 100GB-hours 무료
- Next.js와 완벽 통합

### 설정 방법
```javascript
// pages/api/send-email.js
export default async function handler(req, res) {
  // 이메일 전송 로직
  res.status(200).json({ success: true });
}
```

## 옵션 5: Firebase Cloud Functions (무료 티어)

### 장점
- 월 200만 호출 무료
- Google 생태계 통합

### 설정 방법
```javascript
// functions/index.js
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

exports.sendEmail = functions.https.onCall(async (data, context) => {
  // 이메일 전송 로직
});
```

## 추천: EmailJS (습작용)

개인 프로젝트나 습작의 경우 **EmailJS**를 가장 추천합니다:

1. **설정이 간단함** - 계정만 만들면 바로 사용 가능
2. **서버 불필요** - 클라이언트 사이드에서 직접 전송
3. **무료 티어로 충분** - 월 200통이면 개인 사용하기에 충분
4. **보안** - API 키만 노출되므로 상대적으로 안전

단, 프로덕션 환경에서는 서버리스 함수들을 고려하세요.