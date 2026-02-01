import StatCard from "./StatCard";

export default function StatCardGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
      }}
    >
      <StatCard title="전체 수행평가" value="1" />
      <StatCard title="미제출" value="0" />
      <StatCard title="제출완료" value="1" />
      <StatCard title="평균 점수" value="85점" />
    </div>
  );
}
