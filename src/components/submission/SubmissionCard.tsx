import { useRef, useState } from "react";
import { modifyAttachments, turnIn, getValidToken } from "../../lib/classroom";
import { sendAssignmentNotification } from "../../lib/email";
import { supabase } from "../../lib/supabase";
import { formatUtcToKst } from "../../utils/data";
import type { Assignment, Attachment } from "../../types/assignment";

interface Props {
  assignment: Assignment;
  onSubmissionSuccess?: () => void;
}

export default function SubmissionCard({ assignment, onSubmissionSuccess }: Props) {
  const isSubmitted = assignment.status === "SUBMITTED";
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 첨부 클릭
  const handleAddAttachment = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 시 처리
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !assignment.courseId || !assignment.submissionId) {
      setError("파일을 선택할 수 없습니다.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getValidToken();
      if (!token) throw new Error("인증 토큰이 없습니다.");

      // 실제 구현에서는 Google Drive API를 사용하여 파일을 업로드해야 합니다
      // 현재는 모의 구현으로 대체합니다
      const fileArray = Array.from(files);
      
      // 파일 업로드 로직 (실제로는 Google Drive API 필요)
      console.log("파일 업로드:", fileArray);
      
      // modifyAttachments API 호출
      const newAttachments: Attachment[] = fileArray.map((file, index) => ({
        driveFile: {
          driveFile: {
            id: `file-${Date.now()}-${index}`,
            title: file.name,
          },
          shareMode: "OWNER",
        },
      }));

      await modifyAttachments(
        token,
        assignment.courseId,
        assignment.id,
        assignment.submissionId,
        newAttachments
      );

      // 첨부파일 목록 업데이트
      setAttachments((prev) => [...prev, ...newAttachments]);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "파일 업로드 실패";
      setError(errorMessage);
      console.error("파일 업로드 오류:", err);
    } finally {
      setLoading(false);
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // 첨부파일 삭제
  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // 제출하기
  const handleSubmit = async () => {
    if (!assignment.courseId || !assignment.submissionId) {
      setError("제출 정보가 없습니다.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = getValidToken();
      if (!token) throw new Error("인증 토큰이 없습니다.");

      // 먼저 첨부파일이 있으면 추가
      if (attachments.length > 0) {
        await modifyAttachments(
          token,
          assignment.courseId,
          assignment.id,
          assignment.submissionId,
          attachments
        );
      }

      // 과제 제출
      await turnIn(
        token,
        assignment.courseId,
        assignment.id,
        assignment.submissionId
      );

      // 제출 성공 알림 보내기
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          await sendAssignmentNotification(user.email, assignment.title);
        }
      } catch (notificationError) {
        console.warn("알림 전송 실패:", notificationError);
      }

      setError(null);
      setAttachments([]);
      onSubmissionSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "제출 실패";
      setError(errorMessage);
      console.error("제출 오류:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`submission-card ${isSubmitted ? "submitted" : ""}`}>
      <div className="card-top">
        <div>
          <h3>{assignment.title}</h3>
          {!isSubmitted && <span className="badge warning">미제출</span>}
          {isSubmitted && <span className="badge success">제출완료</span>}
        </div>

        {!isSubmitted && (
          <button className="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "제출 중..." : "제출하기"}
          </button>
        )}
      </div>

      <p className="description">{assignment.description}</p>

      {/* 첨부파일 섹션 (미제출인 경우만 표시) */}
      {!isSubmitted && (
        <div className="attachment-section">
          <div className="attachment-header">
            <h4>과제물 첨부</h4>
            <button
              className="add-attachment-btn"
              onClick={handleAddAttachment}
              disabled={loading}
            >
              + 파일 추가
            </button>
          </div>

          {/* 첨부파일 목록 */}
          {attachments.length > 0 && (
            <div className="attachment-list">
              {attachments.map((attachment, index) => (
                <div key={index} className="attachment-item">
                  <span className="file-icon">📎</span>
                  <span className="file-name">
                    {attachment.driveFile?.driveFile?.title || `파일 ${index + 1}`}
                  </span>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveAttachment(index)}
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 파일 입력 (숨김) */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            style={{ display: "none" }}
            multiple
          />

          {/* 에러 메시지 */}
          {error && <div className="error-message">{error}</div>}
        </div>
      )}

      <div className="meta">
        <div className="meta-row">
          <span className="subject-teacher">
            {assignment.subject} · {assignment.teacher} 선생님
          </span>
        </div>
        <div className="meta-row">
          <span className="due-date">마감: {formatUtcToKst(assignment.dueAt)}</span>
          {!isSubmitted && assignment.dueAt !== "마감일 없음" && (
            <span
              className="d-day"
              style={{
                color:
                  assignment.dDay === 0 || assignment.dDay === 1
                    ? "red"
                    : assignment.dDay <= 3
                    ? "orange"
                    : "inherit",
              }}
            >
              {assignment.dDay === 0 ? "제출 임박" : `D-${assignment.dDay}`}
            </span>
          )}
          {isSubmitted && (
            <span className="score">
              <strong>{assignment.score}점 / 100점</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
