// 백엔드 이메일 전송 API 예시 (Node.js + Express)
// package.json에 다음 의존성 추가:
// "nodemailer": "^6.9.7",
// "express": "^4.18.2",
// "cors": "^2.8.5"

import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

interface SmtpConfig {
  senderId: string;
  password: string;
  server: string;
  port: number;
}

const getSmtpConfig = (): SmtpConfig => {
  return {
    senderId: "ktm090830", // 실제 네이버 메일 ID
    password: "RPXUEDVZVEF3", // 네이버 앱 비밀번호
    server: "smtp.naver.com",
    port: 465,
  };
};

const sendEmail = async (to: string, subject: string, text: string) => {
  const config = getSmtpConfig();

  const transporter = nodemailer.createTransporter({
    host: config.server,
    port: config.port,
    secure: true, // 465 포트는 true (SSL)
    auth: {
      user: config.senderId,
      pass: config.password, // 앱 비밀번호 사용
    },
  });

  const mailOptions = {
    from: `${config.senderId}@naver.com`, // 발신자 이메일 주소
    to,
    subject,
    text,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('이메일 전송 성공:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('이메일 전송 실패:', error);
    throw error;
  }
};

// 이메일 전송 API 엔드포인트
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }

    const result = await sendEmail(to, subject, text);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: '이메일 전송 실패' });
  }
});

// 수행평가 알림 전송 API
app.post('/api/send-assignment-notification', async (req, res) => {
  try {
    const { recipientEmail, assignmentTitle } = req.body;

    if (!recipientEmail || !assignmentTitle) {
      return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }

    const subject = "수행평가 알림";
    const text = `수행평가 "${assignmentTitle}"이 제출되었습니다. 확인해주세요.`;

    const result = await sendEmail(recipientEmail, subject, text);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: '알림 전송 실패' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`이메일 서버가 포트 ${PORT}에서 실행 중입니다.`);
});