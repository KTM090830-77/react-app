const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = "http://localhost:5173/classroom/callback";

const SCOPES = [
  "https://www.googleapis.com/auth/classroom.courses.readonly",
  "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
  "openid",
  "email",
  "profile",
];

export function startClassroomOAuth() {
  const url =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    "?response_type=token" +
    `&client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SCOPES.join(" "))}` +
    "&include_granted_scopes=true" +
    "&prompt=consent";

  window.location.href = url;
}
