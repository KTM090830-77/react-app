import { useRef, useState } from "react";
import { modifyAttachments, turnIn, getValidToken } from "../../lib/classroom";
import { sendAssignmentNotification } from "../../lib/email";
import { supabase } from "../../lib/supabase";
import { formatUtcToKst } from "../../utils/data";
import type { Assignment, Attachment } from "../../types/assignment";
import { initGapiClient, uploadFileWithGapi, addAttachmentsViaGapi } from "../../lib/gapi";

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

  const handleAddAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !assignment.courseId || !assignment.submissionId) {
      setError("파일을 선택할 수 없거나 과제 정보가 부족합니다.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let token = getValidToken();
      if (!token) {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.provider_token || null;
      }
      if (!token) throw new Error("Google 인증 토큰이 없습니다. 다시 로그인해 주세요.");

      await initGapiClient(token as string);

      const fileArray = Array.from(files);
      const newlyAdded: Attachment[] = [];

      for (const file of fileArray) {
        // 1. 드라이브 업로드
        const uploadResult = await uploadFileWithGapi(file);
        
        // 2. 클래스룸에 즉시 첨부
        const attachmentObj: Attachment = {
          driveFile: {
            driveFile: { id: uploadResult.id, title: uploadResult.title },
            shareMode: "OWNER",
          },
        };

        await addAttachmentsViaGapi(
          assignment.courseId,
          assignment.id, 
          assignment.submissionId,
          [attachmentObj]
        );

        newlyAdded.push(attachmentObj);
      }

      setAttachments((prev) => [...prev, ...newlyAdded]);
    } catch (err: any) {
      setError(err.message || "파일 업로드 실패");
      console.error("파일 업로드 오류:", err);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!assignment.courseId || !assignment.submissionId) {
      setError("제출 정보가 없습니다.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let token = getValidToken();
      if (!token) {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.provider_token || null;
      }
      if (!token) throw new Error("인증 토큰이 없습니다.");

      await turnIn(
        token,
        assignment.courseId,
        assignment.id,
        assignment.submissionId
      );

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          // sendAssignmentNotification now checks submit/email toggles internally
          await sendAssignmentNotification(user.email, assignment.title);
        }
      } catch (e) { console.warn("알림 실패:", e); }

      setAttachments([]);
      onSubmissionSuccess?.();
    } catch (err: any) {
      setError(err.message || "제출 실패");
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

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            style={{ display: "none" }}
            multiple
          />

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
                  assignment.dDay <= 0 || assignment.dDay === 1
                    ? "red"
                    : assignment.dDay <= 3
                    ? "orange"
                    : "inherit",
              }}
            >
              {assignment.dDay === 0 ? "제출 임박" : assignment.dDay > 0 ? `D-${assignment.dDay}` : "기한 지남"}
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