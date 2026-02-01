// 수업 목록
export async function fetchCourses(accessToken: string) {
  const res = await fetch(
    "https://classroom.googleapis.com/v1/courses",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) throw new Error("Courses fetch failed");
  return res.json();
}

// ⭐ 과제(수행평가) 목록
export async function fetchCourseWork(
  accessToken: string,
  courseId: string
) {
  const res = await fetch(
    `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) throw new Error("CourseWork fetch failed");
  return res.json();
}
