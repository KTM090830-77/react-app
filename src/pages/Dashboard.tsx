import StatCardGrid from "../components/dashboard/StatCardGrid";
import CalendarCard from "../components/dashboard/CalendarCard";
import SubmittedList from "../components/dashboard/SubmittedList";
import NoticeList from "../components/dashboard/NoticeList";
import ToSubmitList from "../components/dashboard/ToSubmitList";

export default function Dashboard() {
  return (
    <main className="container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1>내 수행평가</h1>
          <p style={{ color: "#6b7280" }}>
            제출해야 할 수행평가를 확인하고 관리하세요
          </p>
        </div>
        <button>+ 수행평가 추가</button>
      </div>

      <div style={{ marginTop: 24 }}>
        <StatCardGrid />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 24,
          marginTop: 24,
        }}
      >
        <CalendarCard />
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <SubmittedList />
          <NoticeList />
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <ToSubmitList />
      </div>
    </main>
  );
}
