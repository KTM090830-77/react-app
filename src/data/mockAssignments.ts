import type { Assignment } from "../types/assignment";

export const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "수학 1차 수행평가",
    subject: "수학",
    teacher: "김수학",
    description:
      "1학기 중간고사 범위 문제 풀이 및 서술형 평가입니다.",
    dueAt: "2026-02-15 23:59",
    dDay: 22,
    status: "NOT_SUBMITTED",
  },
  {
    id: "2",
    title: "영어 말하기 평가",
    subject: "영어",
    teacher: "박영어",
    description:
      "3~5분 분량의 영어 발표 영상을 촬영하여 제출하세요.",
    dueAt: "2026-02-20 23:59",
    dDay: 27,
    status: "NOT_SUBMITTED",
  },
  {
    id: "3",
    title: "과학 실험 보고서",
    subject: "과학",
    teacher: "이과학",
    description:
      "화학 실험 결과 정리 및 분석 보고서 작성 과제입니다.",
    dueAt: "2026-02-10 23:59",
    dDay: 0,
    status: "SUBMITTED",
    score: 90,
  },
  {
    id: "4",
    title: "국어 독후감",
    subject: "국어",
    teacher: "최국어",
    description:
      "지정 도서를 읽고 독후감을 작성하세요.",
    dueAt: "2026-02-18 23:59",
    dDay: 25,
    status: "NOT_SUBMITTED",
  },
];
