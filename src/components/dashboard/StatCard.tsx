import Card from "../common/Card";

interface Props {
  title: string;
  value: string;
}

export default function StatCard({ title, value }: Props) {
  return (
    <Card>
      <p style={{ color: "#6b7280", marginBottom: 8 }}>{title}</p>
      <h2>{value}</h2>
    </Card>
  );
}
