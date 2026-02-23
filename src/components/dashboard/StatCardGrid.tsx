import StatCard from "./StatCard";

interface Props {
  total: number;
  submitted: number;
  overdue: number;
}

export default function StatCardGrid({ total, submitted, overdue }: Props) {
  const notSubmitted = total - submitted;
  // const averageScore = submitted > 0 ? "85점" : "N/A"; // 실제로는 계산 필요

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
      }}
    >
      <StatCard title="전체 수행평가" value={total.toString()} />
      <StatCard title="미제출" value={notSubmitted.toString()} />
      <StatCard title="제출완료" value={submitted.toString()} />
      <StatCard title="기한 초과" value={overdue.toString()} />
    </div>
  );
}
