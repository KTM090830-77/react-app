import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="logo">Classroom 2.0</h1>

        <nav className="nav">
          <button onClick={() => navigate("/")}>대시보드</button>
          <button onClick={() => navigate("/assignment")}>수행평가</button>
          <button onClick={() => navigate("/settings")}>설정</button>
          <button className="logout-btn" onClick={logout}>
            로그아웃
          </button>
        </nav>
      </div>
    </header>
  );
}
