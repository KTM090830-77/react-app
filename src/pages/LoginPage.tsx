import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const navigate = useNavigate();

  // 1️⃣ 이미 로그인된 상태면 바로 메인으로 이동
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/", { replace: true });
      }
    });
  }, [navigate]);

  // 2️⃣ Google 로그인
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // 로그인 후 다시 우리 사이트로 돌아오게
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <h1>로그인</h1>
      <button onClick={loginWithGoogle}>
        Google로 로그인
      </button>
    </div>
  );
}
