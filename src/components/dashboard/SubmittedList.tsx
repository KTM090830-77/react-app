import Card from "../common/Card";
import type { Assignment } from "../../types/assignment";

interface Props {
  assignments: Assignment[];
}

export default function SubmittedList({ assignments }: Props) {
  return (
    <Card>
      <h3>제출 완료</h3>
      {assignments.length === 0 ? (
        <p style={{ color: "#6b7280", marginTop: 16 }}>제출 완료된 과제가 없습니다</p>
      ) : (
        <div style={{ marginTop: 16 }}>
          {assignments.map((assignment) => (
            <div key={assignment.id} style={{ marginBottom: 12 }}>
              <strong>{assignment.title}</strong>
              <p style={{ color: "#6b7280", margin: "4px 0" }}>
                {assignment.subject} · {assignment.score ? `${assignment.score}점` : "점수 미정"}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
