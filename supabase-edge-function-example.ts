// Supabase Edge Functions 예시
// supabase/functions/send-email/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

interface SmtpConfig {
  senderId: string;
  password: string;
  server: string;
  port: number;
}

const getSmtpConfig = (): SmtpConfig => {
  return {
    senderId: "ktm090830",
    password: "RPXUEDVZVEF3",
    server: "smtp.naver.com",
    port: 465,
  };
};

const sendEmail = async (to: string, subject: string, text: string) => {
  const config = getSmtpConfig();

  const client = new SmtpClient();

  try {
    await client.connect({
      hostname: config.server,
      port: config.port,
      username: config.senderId,
      password: config.password,
    });

    await client.send({
      from: `${config.senderId}@naver.com`,
      to,
      subject,
      content: text,
    });

    await client.close();
    console.log('이메일 전송 성공');
    return { success: true };
  } catch (error) {
    console.error('이메일 전송 실패:', error);
    throw error;
  }
};

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { to, subject, text, assignmentTitle } = await req.json();

    let emailSubject = subject;
    let emailText = text;

    // 수행평가 알림인 경우
    if (assignmentTitle) {
      emailSubject = "수행평가 알림";
      emailText = `수행평가 "${assignmentTitle}"이 제출되었습니다. 확인해주세요.`;
    }

    if (!to || !emailSubject || !emailText) {
      return new Response(
        JSON.stringify({ error: '필수 필드가 누락되었습니다.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await sendEmail(to, emailSubject, emailText);

    return new Response(
      JSON.stringify(result),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: '이메일 전송 실패' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});