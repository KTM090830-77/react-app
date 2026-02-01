import type { Assignment } from "../../types/assignment";

interface Props {
  assignment: Assignment;
}

export default function SubmissionCard({ assignment }: Props) {
  const isSubmitted = assignment.status === "SUBMITTED";

  return (
    <div className={`submission-card ${isSubmitted ? "submitted" : ""}`}>
      <div className="card-top">
        <div>
          <h3>{assignment.title}</h3>
          {!isSubmitted && (
            <span className="badge warning">미제출</span>
          )}
          {isSubmitted && (
            <span className="badge success">제출완료</span>
          )}
        </div>

        {!isSubmitted && (
          <button className="primary">제출하기</button>
        )}
      </div>

      <p className="description">{assignment.description}</p>

      <div className="meta">
        <span>
          {assignment.subject} · {assignment.teacher} 선생님
        </span>
        <span>마감: {assignment.dueAt}</span>
        {!isSubmitted && <span>D-{assignment.dDay}</span>}
        {isSubmitted && (
          <strong>{assignment.score}점 / 100점</strong>
        )}
      </div>
    </div>
  );
}
