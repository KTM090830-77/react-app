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
export async function createCourseWork(token: string, courseId: string) {
  const response = await fetch(
    `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "API 테스트 과제 (소유권 확인용)",
        description: "이 과제는 API를 통해 직접 생성되었습니다. 여기서 TurnIn이 되는지 확인하세요.",
        workType: "ASSIGNMENT",
        state: "PUBLISHED", // 바로 게시
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "과제 생성 실패");
  }

  return response.json();
}
// 학생 제출 상태
export async function fetchStudentSubmissions(
  accessToken: string,
  courseId: string,
  courseWorkId: string
) {
  const res = await fetch(
    `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions?userId=me`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) throw new Error("StudentSubmissions fetch failed");
  return res.json();
}

// 토큰 만료 확인
export function isTokenExpired(): boolean {
  const expiresAt = localStorage.getItem("classroom_token_expires");
  if (!expiresAt) return true;
  return Date.now() > parseInt(expiresAt);
}

// 유효한 토큰 가져오기 (만료되었으면 null)
export function getValidToken(): string | null {
  if (isTokenExpired()) {
    localStorage.removeItem("classroom_token");
    localStorage.removeItem("classroom_token_expires");
    return null;
  }
  return localStorage.getItem("classroom_token");
}

// 제출물에 첨부파일 수정 (추가/삭제)
export async function modifyAttachments(
  accessToken: string,
  courseId: string,
  courseWorkId: string,
  submissionId: string,
  attachments: Array<{
    driveFile?: {
      driveFile?: {
        id: string;
        title: string;
      };
      shareMode: string;
    };
  }>
) {
  const res = await fetch(
    `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions/${submissionId}/modifyAttachments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addAttachments: attachments,
      }),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`ModifyAttachments failed: ${errorData.error?.message || res.statusText}`);
  }
  return res.json();
}

// 과제 제출
export async function turnIn(
  accessToken: string,
  courseId: string,
  courseWorkId: string,
  submissionId: string
) {
  const res = await fetch(
    `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions/${submissionId}:turnIn`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`TurnIn failed: ${errorData.error?.message || res.statusText}`);
  }
  return res.json();
}

// 학생 제출물 상세 정보 조회
export async function getStudentSubmission(
  accessToken: string,
  courseId: string,
  courseWorkId: string,
  submissionId: string
) {
  const res = await fetch(
    `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions/${submissionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) throw new Error("StudentSubmission fetch failed");
  return res.json();
}