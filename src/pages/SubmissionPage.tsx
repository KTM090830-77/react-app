import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchCourses, fetchCourseWork } from "../lib/classroom";
import SubmissionCard from "../components/submission/SubmissionCard";

export default function SubmissionPage() {
  console.log("수행평가 페이지 정상 로딩");

  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    
    const load = async () => {
      // 1️⃣ 로그인 세션에서 Google access token 가져오기
      const token = localStorage.getItem("classroom_token");
      if (!token) {
      console.warn("classroom_token 없음");
      setLoading(false);
      return;
      }
      // 2️⃣ 내가 속한 수업 가져오기
      const courseResult = await fetchCourses(token);
      const courses = courseResult.courses ?? [];

      // 3️⃣ 모든 수업의 수행평가 가져오기
      const allAssignments: any[] = [];

      for (const course of courses) {
        const workResult = await fetchCourseWork(token, course.id);
        const works = workResult.courseWork ?? [];

        works.forEach((w: any) => {
          allAssignments.push({
            ...w,
            courseName: course.name,
          });
        });
      }

      setAssignments(allAssignments);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <div>불러오는 중...</div>;

  return (
    <div className="page">
      <h1>수행평가 제출</h1>
      <p className="page-desc">
        Google Classroom 수행평가를 확인하고 제출하세요
      </p>

      <div className="submission-list">
        {assignments.map((assignment) => (
          <SubmissionCard
            key={assignment.id}
            assignment={assignment}
          />
        ))}
      </div>
    </div>
  );
}
