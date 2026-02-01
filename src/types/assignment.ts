export interface Assignment {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  description: string;
  dueAt: string;
  dDay: number;
  status: "NOT_SUBMITTED" | "SUBMITTED";
  score?: number;
}
