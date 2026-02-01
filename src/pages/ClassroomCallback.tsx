import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ClassroomCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // URL의 #access_token=... 부분 파싱
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hash.get("access_token");

    if (accessToken) {
      localStorage.setItem("classroom_token", accessToken);
      console.log("✅ Classroom token saved:", accessToken);
    } else {
      console.error("❌ No access_token found");
    }

    // 저장 후 Settings로 이동
    navigate("/settings", { replace: true });
  }, [navigate]);

  return <div>Google Classroom 연결 중...</div>;
}
