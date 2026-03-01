import Card from "../common/Card";

interface Props {
  title: string;
  value: string;
  icon?: React.ReactNode;
  color?: "primary" | "success" | "warning" | "error";
}

export default function StatCard({ title, value, icon, color = "primary" }: Props) {
  const colorMap = {
    primary: "#3b82f6",
    success: "#22c55e",
    warning: "#eab308",
    error: "#ef4444",
  };

  return (
    <Card>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start",
        marginBottom: "1rem"
      }}>
        <p style={{ 
          color: "rgb(107, 114, 128)", 
          marginBottom: 0,
          fontSize: "0.875rem",
          fontWeight: 500
        }}>
          {title}
        </p>
        {icon && (
          <div style={{
            fontSize: "1.5rem",
            color: colorMap[color],
            opacity: 0.7
          }}>
            {icon}
          </div>
        )}
      </div>
      <h2 style={{
        margin: 0,
        fontSize: "2rem",
        fontWeight: "bold",
        color: colorMap[color],
        lineHeight: 1
      }}>
        {value}
      </h2>
    </Card>
  );
}
