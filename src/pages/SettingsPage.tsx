import { useState, useEffect } from "react";
import { fetchCourses, fetchCourseWork, getValidToken } from "../lib/classroom";
import { sendDailyDeadlineNotification } from "../lib/email";
import type { Assignment } from "../types/assignment";

export default function SettingsPage() {
  const [submitAlert, setSubmitAlert] = useState(true);
  const [deadlineAlert, setDeadlineAlert] = useState(true);
  const [emailAlert, setEmailAlert] = useState(false);

  // load persisted toggle settings
  useEffect(() => {
    const savedSubmit = localStorage.getItem('submitAlert');
    if (savedSubmit !== null) setSubmitAlert(savedSubmit === 'true');
    const savedDeadline = localStorage.getItem('deadlineAlert');
    if (savedDeadline !== null) setDeadlineAlert(savedDeadline === 'true');
    const savedEmail = localStorage.getItem('emailAlert');
    if (savedEmail !== null) setEmailAlert(savedEmail === 'true');
  }, []);

  // persist toggles when they change
  useEffect(() => {
    localStorage.setItem('submitAlert', submitAlert.toString());
  }, [submitAlert]);
  useEffect(() => {
    localStorage.setItem('deadlineAlert', deadlineAlert.toString());
  }, [deadlineAlert]);
  useEffect(() => {
    localStorage.setItem('emailAlert', emailAlert.toString());
  }, [emailAlert]);
  const [notificationTime, setNotificationTime] = useState(9); // 기본 9시
  const [notificationEmail, setNotificationEmail] = useState(""); // 알림 이메일 주소
  const [darkMode, setDarkMode] = useState(false);
  const [simpleView, setSimpleView] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // 과제 데이터 로드
  useEffect(() => {
    const loadAssignments = async () => {
      const token = getValidToken();
      if (!token) return;

      const courseResult = await fetchCourses(token);
      const courses = courseResult.courses ?? [];
      const allAssignments: Assignment[] = [];

      for (const course of courses) {
        const workResult = await fetchCourseWork(token, course.id);
        const works = workResult.courseWork ?? [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const assignmentPromises = works.map(async (w: any) => {
          let dueAt = "마감일 없음";
          let dDay = 0;
          if (w.dueDate && w.dueTime && 
              typeof w.dueDate.year === 'number' && 
              typeof w.dueDate.month === 'number' && 
              typeof w.dueDate.day === 'number' &&
              typeof w.dueTime.hours === 'number' && 
              typeof w.dueTime.minutes === 'number') {
            try {
              const dueDate = new Date(Date.UTC(
                w.dueDate.year,
                w.dueDate.month - 1,
                w.dueDate.day,
                w.dueTime.hours,
                w.dueTime.minutes
              ));
              
              // 유효한 날짜인지 확인
              if (isNaN(dueDate.getTime())) {
                console.warn('Invalid due date for assignment:', w.title, w.dueDate, w.dueTime);
                return {
                  id: w.id,
                  title: w.title,
                  subject: course.name,
                  dueAt,
                  dDay,
                  status: "pending" as const,
                };
              }

              dueAt = dueDate.toISOString();
              const now = new Date();
              const diffTime = dueDate.getTime() - now.getTime();
              dDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            } catch (error) {
              console.warn('Error parsing due date for assignment:', w.title, error);
            }
          }

          return {
            id: w.id,
            title: w.title,
            subject: course.name,
            dueAt,
            dDay,
            status: "pending" as const,
          };
        });

        const courseAssignments = await Promise.all(assignmentPromises);
        allAssignments.push(...courseAssignments);
      }

      setAssignments(allAssignments);
    };

    loadAssignments();
  }, []);

  // 설정 불러오기
  useEffect(() => {
    const savedNotificationTime = localStorage.getItem('notificationTime');
    if (savedNotificationTime) {
      setNotificationTime(Number(savedNotificationTime));
    }
    const savedNotificationEmail = localStorage.getItem('notificationEmail');
    if (savedNotificationEmail) {
      setNotificationEmail(savedNotificationEmail);
    }
  }, []);

  const classroomConnected = !!localStorage.getItem("classroom_token");

  // 설정 저장
  const saveNotificationTime = (time: number) => {
    setNotificationTime(time);
    localStorage.setItem('notificationTime', time.toString());
  };

  const saveNotificationEmail = (email: string) => {
    setNotificationEmail(email);
    localStorage.setItem('notificationEmail', email);
  };

  // 데일리 알림 테스트
  const testDailyNotification = async () => {
    try {
      // 현재 사용자 이메일 가져오기
      const { data: { user } } = await import('@supabase/supabase-js').then(({ createClient }) => {
        const supabase = createClient(
          import.meta.env.VITE_SUPABASE_URL!,
          import.meta.env.VITE_SUPABASE_ANON_KEY!
        );
        return supabase.auth.getUser();
      });

      if (!user?.email) {
        alert("로그인이 필요합니다.");
        return;
      }

      // Google SSO의 경우 실제 Gmail 주소를 사용
      let recipientEmail = user.email;
      if (user.app_metadata?.provider === 'google' && user.identities) {
        const googleIdentity = user.identities.find(identity => identity.provider === 'google');
        if (googleIdentity?.identity_data?.email) {
          recipientEmail = googleIdentity.identity_data.email;
        }
      }

      // 사용자가 설정한 이메일 주소가 있으면 우선 사용
      if (notificationEmail && notificationEmail.trim()) {
        recipientEmail = notificationEmail.trim();
        console.log('사용자 설정 이메일 사용:', recipientEmail);
      } else {
        console.log('사용자 설정 이메일 없음, 기본 이메일 사용:', recipientEmail);
      }

      const result = await sendDailyDeadlineNotification(recipientEmail, assignments);
      alert(`테스트 이메일이 ${recipientEmail}로 전송되었습니다! 스팸 폴더도 확인해보세요.`);
      console.log("테스트 결과:", result);
      console.log("수신자 이메일:", recipientEmail);
    } catch (error) {
      alert("테스트 이메일 전송 실패: " + error);
      console.error("테스트 실패:", error);
    }
  };

  const connectClassroom = () => {
    const clientId = "288270020961-3bpsghmq11ffj2eep20u6s9uh37vhemo.apps.googleusercontent.com";
    const redirectUri = "http://localhost:5173/classroom/callback";

    const scope = [
      "openid",
      "email",
      "profile",
      // classroom scopes
      "https://www.googleapis.com/auth/classroom.courses.readonly",
      "https://www.googleapis.com/auth/classroom.coursework.me",
      "https://www.googleapis.com/auth/classroom.coursework.students",
      // drive scope for file upload
      "https://www.googleapis.com/auth/drive.file"
    ].join(" ");

    const url =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent(scope)}` +
      `&prompt=consent`;

    window.location.href = url;
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
      <h2>설정</h2>
      <p style={{ color: "#666" }}>계정 정보와 알림을 설정하세요</p>

      {/* ===== Google Classroom 연결 (최상단) ===== */}
      <Section
        title="Google Classroom 연동"
        description="수행평가를 불러오기 위해 Google Classroom과 연결합니다"
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <strong>연결 상태</strong>
            <p style={{ fontSize: 13, color: "#666" }}>
              {classroomConnected
                ? "Classroom 및 Drive 권한이 연결되어 있습니다"
                : "아직 Classroom/Drive가 연결되지 않았습니다"}
            </p>
          </div>

          <button onClick={connectClassroom}>
            {classroomConnected ? "다시 연결" : "Classroom 연결"}
          </button>
        </div>
      </Section>

      {/* ===== 알림 설정 ===== */}
      <Section title="알림 설정" description="알림 수신 방법을 설정합니다">
        <ToggleItem
          title="수행평가 제출 알림"
          desc="학생이 수행평가를 제출하면 알림을 받습니다"
          value={submitAlert}
          onChange={setSubmitAlert}
        />
        <ToggleItem
          title="마감일 알림"
          desc="수행평가 마감 3일 전 알림을 받습니다"
          value={deadlineAlert}
          onChange={setDeadlineAlert}
        />
        <SelectItem
          title="수행평가 알림 시간"
          desc="수행평가 관련 알림을 받을 시간을 선택하세요"
          value={notificationTime}
          onChange={saveNotificationTime}
          options={Array.from({ length: 24 }, (_, i) => ({ value: i, label: `${i}시` }))}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <strong>알림 이메일 주소</strong>
            <p style={{ fontSize: 13, color: "#666" }}>알림을 받을 이메일 주소를 입력하세요</p>
          </div>
          <input
            type="email"
            value={notificationEmail}
            onChange={(e) => saveNotificationEmail(e.target.value)}
            placeholder="example@gmail.com"
            style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #ccc", width: 200 }}
          />
        </div>
        <ToggleItem
          title="이메일 알림"
          desc="중요한 알림을 이메일로 받습니다"
          value={emailAlert}
          onChange={setEmailAlert}
        />
        <div style={{ marginTop: 16, padding: 12, backgroundColor: "#f8f9fa", borderRadius: 6 }}>
          <strong>데일리 알림 테스트</strong>
          <p style={{ fontSize: 13, color: "#666", margin: "4px 0" }}>
            현재 설정된 시간에 관계없이 데일리 알림을 테스트합니다
          </p>
          <button 
            onClick={testDailyNotification}
            style={{ 
              padding: "6px 12px", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            테스트 이메일 보내기
          </button>
        </div>
      </Section>

      {/* ===== 보안 설정 ===== */}
      <Section title="보안 설정" description="계정 보안을 강화합니다">
        <RowItem
          title="비밀번호 변경"
          desc="정기적인 비밀번호 변경을 권장합니다"
          button="변경하기"
        />
        <ToggleItem
          title="2단계 인증"
          desc="추가 보안 단계를 활성화합니다"
          value={twoFactor}
          onChange={setTwoFactor}
        />
      </Section>

      {/* ===== 표시 설정 ===== */}
      <Section title="표시 설정" description="화면 표시 방식을 설정합니다">
        <ToggleItem
          title="다크 모드"
          desc="어두운 테마를 사용합니다"
          value={darkMode}
          onChange={setDarkMode}
        />
        <ToggleItem
          title="간단한 표시"
          desc="화면을 단순하게 표시합니다"
          value={simpleView}
          onChange={setSimpleView}
        />
      </Section>

      {/* ===== 데이터 관리 ===== */}
      <Section title="데이터 관리" description="데이터를 관리하고 백업합니다">
        <RowItem
          title="데이터 내보내기"
          desc="수행평가 데이터를 내보냅니다"
          button="내보내기"
        />
        <RowItem
          title="데이터 가져오기"
          desc="외부 데이터를 가져옵니다"
          button="가져오기"
        />
      </Section>

      {/* ===== 도움말 ===== */}
      <Section title="도움말 및 지원" description="사용 가이드와 지원을 받습니다">
        <RowItem title="사용 가이드" desc="시스템 사용 방법을 확인합니다" button="보기" />
        <RowItem title="문의하기" desc="문제가 있으면 문의해주세요" button="문의" />
        <div style={{ marginTop: 12, color: "#888" }}>버전 정보 v1.0.0</div>
      </Section>
    </div>
  );
}

/* ================= 공통 컴포넌트 ================= */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        marginTop: 24,
        boxShadow: "0 0 0 1px #eee",
      }}
    >
      <h3>{title}</h3>
      <p style={{ color: "#666", fontSize: 14 }}>{description}</p>
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}

function ToggleItem({
  title,
  desc,
  value,
  onChange,
}: {
  title: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
      <div>
        <strong>{title}</strong>
        <p style={{ fontSize: 13, color: "#666" }}>{desc}</p>
      </div>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  );
}

function RowItem({
  title,
  desc,
  button,
}: {
  title: string;
  desc: string;
  button: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
      <div>
        <strong>{title}</strong>
        <p style={{ fontSize: 13, color: "#666" }}>{desc}</p>
      </div>
      <button>{button}</button>
    </div>
  );
}

function SelectItem({
  title,
  desc,
  value,
  onChange,
  options,
}: {
  title: string;
  desc: string;
  value: number;
  onChange: (v: number) => void;
  options: { value: number; label: string }[];
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
      <div>
        <strong>{title}</strong>
        <p style={{ fontSize: 13, color: "#666" }}>{desc}</p>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #ccc" }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}