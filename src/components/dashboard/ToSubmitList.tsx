import Card from "../common/Card";
import { formatUtcToKst } from "../../utils/data";
import type { Assignment } from "../../types/assignment";

interface Props {
  assignments: Assignment[];
}

export default function ToSubmitList({ assignments }: Props) {
  return (
    <Card>
      <h3>제출해야 할 수행평가</h3>
      {assignments.length === 0 ? (
        <p style={{ color: "#6b7280", marginTop: 16 }}>
          제출해야 할 수행평가가 없습니다
        </p>
      ) : (
        <div style={{ marginTop: 16 }}>
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              style={{
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                marginBottom: "8px",
                background: "#f9fafb",
              }}
            >
              <h4 style={{ margin: 0, fontSize: "14px" }}>{assignment.title}</h4>
              <p style={{ margin: "4px 0", fontSize: "12px", color: "#6b7280" }}>
                {assignment.subject} · 마감: {formatUtcToKst(assignment.dueAt)}
              </p>
              <span
                style={{
                  fontSize: "12px",
                  color: assignment.dDay === 0 || assignment.dDay === 1 ? "red" : assignment.dDay <= 3 ? "orange" : "inherit",
                  fontWeight: "bold",
                }}
              >
                {assignment.dDay === 0 ? "제출 임박" : `D-${assignment.dDay}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
