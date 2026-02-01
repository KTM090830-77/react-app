import Card from "../common/Card";

export default function CalendarCard() {
  return (
    <Card>
      <h3>수행평가 캘린더</h3>
      <div
        style={{
          marginTop: 20,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
        }}
      >
        📅 1월 2026 (캘린더 자리)
      </div>
    </Card>
  );
}
