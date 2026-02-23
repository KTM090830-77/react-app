import { useEffect, useState } from "react";
import { 
  fetchCourses, 
  fetchCourseWork, 
  fetchStudentSubmissions, 
  getValidToken,
  // 아래에 createCourseWork 함수가 lib/classroom.ts에 정의되어 있어야 합니다.
  createCourseWork 
} from "../lib/classroom";
import SubmissionCard from "../components/submission/SubmissionCard";
import type { Assignment } from "../types/assignment";
import "./SubmissionPage.css";

export default function SubmissionPage() {
  console.log("수행평가 페이지 정상 로딩");

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [hideExpired, setHideExpired] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreating, setIsCreating] = useState(false); // 테스트 생성 상태 추가

  const loadAssignments = async () => {
    setRefreshing(true);
    try {
      const token = getValidToken();
      if (!token) {
        console.warn("classroom_token 없음 또는 만료됨");
        setLoading(false);
        return;
      }
      const courseResult = await fetchCourses(token);
      const courses = courseResult.courses ?? [];
      const allAssignments: Assignment[] = [];

      for (const course of courses) {
        const workResult = await fetchCourseWork(token, course.id);
        const works = workResult.courseWork ?? [];

        interface CourseWork {
          id: string;
          title: string;
          description?: string;
          dueDate?: { year: number; month: number; day: number };
          dueTime?: { hours: number; minutes: number };
        }

        const assignmentPromises = works.map(async (w: CourseWork) => {
          let dueAt = "마감일 없음";
          let dDay = 0;
          if (w.dueDate && w.dueTime) {
            const dueDate = new Date(Date.UTC(
              w.dueDate.year,
              w.dueDate.month - 1,
              w.dueDate.day,
              w.dueTime.hours,
              w.dueTime.minutes
            ));
            dueAt = dueDate.toLocaleString("ko-KR", {
              timeZone: 'Asia/Seoul',
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            });
            const now = new Date();
            const diffTime = dueDate.getTime() - now.getTime();
            dDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }

          let status: "NOT_SUBMITTED" | "SUBMITTED" = "NOT_SUBMITTED";
          let score: number | undefined;
          let submissionDate: string | undefined;
          let submissionId: string | undefined;

          try {
            const submissionResult = await fetchStudentSubmissions(token, course.id, w.id);
            const submissions = submissionResult.studentSubmissions ?? [];
            if (submissions.length > 0) {
              const submission = submissions[0];
              submissionId = submission.id;
              if (submission.state === "TURNED_IN" || submission.state === "RETURNED") {
                status = "SUBMITTED";
                score = submission.assignedGrade;
                submissionDate = submission.updateTime;
              }
            }
          } catch (error) {
            console.warn("제출 상태 확인 실패:", error);
          }

          return {
            id: w.id,
            title: w.title,
            subject: course.name,
            teacher: course.ownerId || "알 수 없음",
            description: w.description || "",
            dueAt,
            dDay,
            status,
            score,
            courseName: course.name,
            courseId: course.id,
            submissionDate,
            submissionId,
          };
        });

        const courseAssignments = await Promise.all(assignmentPromises);
        allAssignments.push(...courseAssignments);
      }

      setAssignments(allAssignments);
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  // --- 테스트용 과제 생성 핸들러 추가 ---
  const handleTestCreate = async () => {
    const token = getValidToken();
    if (!token) return alert("토큰이 만료되었습니다. 다시 로그인해주세요.");

    // 첫 번째 수업을 테스트 대상으로 지정 (실제 테스트 시 본인이 '선생님'인 수업이 목록 상단에 있어야 함)
    if (assignments.length === 0) return alert("참여 중인 수업이 없어 테스트가 불가능합니다.");
    const targetCourseId = assignments[0].courseId;

    if (!targetCourseId) return alert("수업 ID를 찾을 수 없습니다.");

    if (!window.confirm(`[${assignments[0].courseName}] 수업에 테스트 과제를 생성할까요?`)) return;

    setIsCreating(true);
    try {
      await createCourseWork(token, targetCourseId);
      alert("테스트 과제가 성공적으로 생성되었습니다! 새로고침 후 TurnIn을 시도해보세요.");
      await loadAssignments();
    } catch (err: any) {
      console.error(err);
      alert("과제 생성 실패: " + (err.message || "권한이 없거나 오류가 발생했습니다."));
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  if (loading) return <div>수행평가를 불러오는 중...</div>;

  const filteredAssignments = hideExpired
    ? assignments.filter((assignment) => assignment.dDay >= 0 || assignment.dueAt === "마감일 없음")
    : assignments;

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>수행평가 제출</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* 테스트 과제 생성 버튼 */}
          <button
            onClick={handleTestCreate}
            disabled={isCreating || refreshing}
            style={{
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 16px",
              cursor: (isCreating || refreshing) ? "not-allowed" : "pointer",
              opacity: (isCreating || refreshing) ? 0.6 : 1,
              fontWeight: "bold"
            }}
          >
            {isCreating ? "생성 중..." : "테스트 과제 생성"}
          </button>

          <button
            onClick={loadAssignments}
            disabled={refreshing}
            style={{
              background: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 16px",
              cursor: refreshing ? "not-allowed" : "pointer",
              opacity: refreshing ? 0.6 : 1,
            }}
          >
            {refreshing ? "새로고침 중..." : "새로고침"}
          </button>
        </div>
      </div>
      <p className="page-desc">
        Google Classroom 수행평가를 확인하고 제출하세요
      </p>

      <div className="filter-section">
        <label>
          <input
            type="checkbox"
            checked={hideExpired}
            onChange={(e) => setHideExpired(e.target.checked)}
          />
          마감된 과제 숨기기
        </label>
      </div>

      <div className="submission-list">
        {filteredAssignments.map((assignment) => (
          <SubmissionCard
            key={assignment.id}
            assignment={assignment}
            onSubmissionSuccess={loadAssignments}
          />
        ))}
      </div>
    </div>
  );
}