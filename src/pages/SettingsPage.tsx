import { useState } from "react";

export default function SettingsPage() {
  const [submitAlert, setSubmitAlert] = useState(true);
  const [deadlineAlert, setDeadlineAlert] = useState(true);
  const [emailAlert, setEmailAlert] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [simpleView, setSimpleView] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const classroomConnected = !!localStorage.getItem("classroom_token");

  const connectClassroom = () => {
    const clientId = "288270020961-3bpsghmq11ffj2eep20u6s9uh37vhemo.apps.googleusercontent.com";
    const redirectUri = "http://localhost:5173/classroom/callback";

    const scope = [
      "https://www.googleapis.com/auth/classroom.courses.readonly",
      "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
      "https://www.googleapis.com/auth/classroom.coursework.students.readonly",
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
                ? "Classroom이 연결되어 있습니다"
                : "아직 Classroom이 연결되지 않았습니다"}
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
        <ToggleItem
          title="이메일 알림"
          desc="중요한 알림을 이메일로 받습니다"
          value={emailAlert}
          onChange={setEmailAlert}
        />
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
