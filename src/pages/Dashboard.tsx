import { useEffect, useState } from "react";
import StatCardGrid from "../components/dashboard/StatCardGrid";
import CalendarCard from "../components/dashboard/CalendarCard";
import SubmittedList from "../components/dashboard/SubmittedList";
import NoticeList from "../components/dashboard/NoticeList";
import ToSubmitList from "../components/dashboard/ToSubmitList";
import { fetchCourses, fetchCourseWork, fetchStudentSubmissions, getValidToken } from "../lib/classroom";
import { checkAndSendDailyNotification } from "../lib/email";
import type { Assignment } from "../types/assignment";

export default function Dashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
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

        // 각 work의 submissions을 병렬로 가져옴
        const assignmentPromises = works.map(async (w: any) => {
          // dueDate와 dueTime을 사용하여 dueAt 계산
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

          // 제출 상태 확인
          let status: "NOT_SUBMITTED" | "SUBMITTED" = "NOT_SUBMITTED";
          let score: number | undefined;
          let submissionDate: string | undefined;
          try {
            const submissionResult = await fetchStudentSubmissions(token, course.id, w.id);
            const submissions = submissionResult.studentSubmissions ?? [];
            if (submissions.length > 0) {
              const submission = submissions[0]; // 첫 번째 제출
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
            submissionDate,
          };
        });

        const courseAssignments = await Promise.all(assignmentPromises);
        allAssignments.push(...courseAssignments);
      }

      setAssignments(allAssignments);
      setLoading(false);

      // 데일리 알림 체크 (과제 데이터 로드 후)
      setTimeout(() => {
        checkAndSendDailyNotification(allAssignments);
      }, 1000); // 1초 지연하여 UI 로드 우선
    };

    load();
  }, []);

  // 통계 계산
  const totalAssignments = assignments.length;
  const submittedAssignments = assignments.filter(a => a.status === "SUBMITTED").length;
  const overdueAssignments = assignments.filter(a => a.dDay < 0 && a.dueAt !== "마감일 없음").length;
  const upcomingAssignments = assignments
    .filter(a => a.dueAt !== "마감일 없음" && a.dDay >= 0)
    .sort((a, b) => a.dDay - b.dDay)
    .slice(0, 3);

  // 당일 제출한 과제 필터링
  const today = new Date();
  const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD
  const todaySubmittedAssignments = assignments.filter(a => {
    if (a.status !== "SUBMITTED" || !a.submissionDate) return false;
    const submissionDate = new Date(a.submissionDate).toISOString().split('T')[0];
    return submissionDate === todayString;
  });

  if (loading) return <div>로딩 중...</div>;

  return (
    <main className="container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1>내 수행평가</h1>
          <p style={{ color: "#6b7280" }}>
            제출해야 할 수행평가를 확인하고 관리하세요
          </p>
        </div>
        <button>+ 수행평가 추가</button>
      </div>

      <div style={{ marginTop: 24 }}>
        <StatCardGrid
          total={totalAssignments}
          submitted={submittedAssignments}
          overdue={overdueAssignments}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 24,
          marginTop: 24,
        }}
      >
        <CalendarCard assignments={assignments} />
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <SubmittedList assignments={todaySubmittedAssignments} />
          <NoticeList />
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <ToSubmitList assignments={upcomingAssignments} />
      </div>
    </main>
  );
}
