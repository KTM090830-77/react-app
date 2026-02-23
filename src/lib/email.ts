// 이메일 알림을 위한 EmailJS 설정 (무료)
// 설치: npm install @emailjs/browser
// 설정: https://www.emailjs.com/ 에서 계정 생성 후 서비스 설정

import emailjs from '@emailjs/browser';
import { formatUtcToKst } from '../utils/data';

// EmailJS 초기화
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

export interface SmtpConfig {
  senderId: string;
  password: string;
  server: string;
  port: number;
}

export const getSmtpConfig = (): SmtpConfig => {
  // 미리 설정된 SMTP 값 사용(naver SMTP)
  return {
    senderId: "ktm090830",
    password: "RPXUEDVZVEF3",
    server: "smtp.naver.com",
    port: 465,
  };
};

// 과제 제출 알림 전송(수행평가 제출 시)
export const sendAssignmentNotification = async (recipientEmail: string, assignmentTitle: string) => {
  try {
    const templateParams = {
      to_email: recipientEmail,
      assignment_title: assignmentTitle,
      from_name: '수행평가 시스템',
      message: `수행평가 "${assignmentTitle}"이 제출되었습니다. 확인해주세요.`,
    };

    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('제출 알림 이메일 전송 성공:', result);
    return { success: true, result };
  } catch (error) {
    console.error('제출 알림 이메일 전송 실패:', error);
    throw error;
  }
};

// 데일리 마감일 알림 전송(매일 설정된 시간에 실행) - 내일 마감인 과제들을 포함하여 최대 3개까지 알림, 테스트 전용 기능 구현 상태
export const sendDailyDeadlineNotification = async (recipientEmail: string, assignments: Array<{
  title: string;
  subject: string;
  dueAt: string;
  dDay: number;
}>) => {
  try {
    // 다음 날 마감인 과제들만 필터링, 마감일이 없는 과제는 제외
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD 형식

    const tomorrowAssignments = assignments.filter(assignment => {
      if (!assignment.dueAt || assignment.dueAt === "마감일 없음") return false;

      try {
        // dueAt을 Date 객체로 변환하여 비교
        const dueDate = new Date(assignment.dueAt);
        if (isNaN(dueDate.getTime())) {
          console.warn('Invalid due date for assignment:', assignment.title, assignment.dueAt);
          return false;
        }
        const dueDateString = dueDate.toISOString().split('T')[0];

        return dueDateString === tomorrowString;
      } catch (error) {
        console.warn('Error parsing due date for assignment:', assignment.title, error);
        return false;
      }
    }).sort((a, b) => {
      try {
        return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
      } catch {
        return 0;
      }
    }) // 마감일 가까운 순으로 정렬
    .slice(0, 3); // 상위 3개만 선택

    if (tomorrowAssignments.length === 0) {
      console.log('내일 마감인 과제가 없습니다.');
      return { success: true, message: '내일 마감인 과제가 없습니다.' };
    }

    // 과제 목록을 텍스트로 포맷팅
    const assignmentList = tomorrowAssignments
      .map((assignment, index) =>
        `${index + 1}. ${assignment.subject} - ${assignment.title} (마감: ${formatUtcToKst(assignment.dueAt)})`
      )
      .join('\n');

    const templateParams = {
      to_email: recipientEmail,
      assignment_list: assignmentList,
      total_count: tomorrowAssignments.length,
      from_name: '수행평가 시스템',
      message: `내일 마감인 수행평가가 ${tomorrowAssignments.length}개 있습니다.`,
    };

    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_DAILY_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('데일리 마감일 알림 전송 성공:', result);
    return { success: true, result, assignmentCount: tomorrowAssignments.length };
  } catch (error) {
    console.error('데일리 마감일 알림 전송 실패:', error);
    throw error;
  }
};

// 데일리 알림 확인 및 전송 (설정된 시간에 실행)
export const checkAndSendDailyNotification = async (assignments: Array<{
  title: string;
  subject: string;
  dueAt: string;
  dDay: number;
}>) => {
  try {
    // Supabase에서 사용자 이메일 가져오기
    const { data: { user } } = await import('@supabase/supabase-js').then(({ createClient }) => {
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL!,
        import.meta.env.VITE_SUPABASE_ANON_KEY!
      );
      return supabase.auth.getUser();
    });

    if (!user?.email) {
      console.warn('사용자 이메일을 찾을 수 없습니다.');
      return;
    }

    // Google SSO의 경우 실제 Gmail 주소를 사용
    let recipientEmail = user.email;
    if (user.app_metadata?.provider === 'google' && user.identities) {
      const googleIdentity = user.identities.find(identity => identity.provider === 'google');
      if (googleIdentity?.identity_data?.email) {
        recipientEmail = googleIdentity.identity_data.email;
        console.log('Google SSO 이메일 사용:', recipientEmail);
      }
    }

    // 사용자가 설정한 이메일 주소가 있으면 우선 사용
    const savedEmail = localStorage.getItem('notificationEmail');
    if (savedEmail && savedEmail.trim()) {
      recipientEmail = savedEmail.trim();
      console.log('사용자 설정 이메일 사용:', recipientEmail);
    } else {
      console.log('사용자 설정 이메일 없음, 기본 이메일 사용:', recipientEmail);
    }

    console.log('알림을 보낼 이메일 주소:', recipientEmail);

    // 현재 시간과 설정된 알림 시간 비교
    const now = new Date();
    const currentHour = now.getHours();

    // 설정된 알림 시간 가져오기 (localStorage에서)
    const savedNotificationTime = localStorage.getItem('notificationTime');
    const notificationHour = savedNotificationTime ? Number(savedNotificationTime) : 9; // 기본 9시

    // 오늘 이미 알림을 보냈는지 확인 (localStorage 사용)
    const todayKey = `daily_notification_${now.toDateString()}`;
    const alreadySent = localStorage.getItem(todayKey);

    if (currentHour === notificationHour && !alreadySent) {
      await sendDailyDeadlineNotification(user.email, assignments);
      localStorage.setItem(todayKey, 'sent');
      console.log('데일리 알림 전송 완료');
    } else if (alreadySent) {
      console.log('오늘은 이미 데일리 알림을 전송했습니다.');
    } else {
      console.log(`알림 시간(${notificationHour}시)이 아닙니다. 현재: ${currentHour}시`);
    }
  } catch (error) {
    console.error('데일리 알림 확인 실패:', error);
  }
};