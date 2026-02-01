import { NavLink, useNavigate } from "react-router-dom";
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
        <h1 className="logo">Classroom</h1>

        <nav className="nav">
          <NavLink to="/" end>대시보드</NavLink>
          <NavLink to="/assignment">수행평가</NavLink>
          <NavLink to="/settings">설정</NavLink>
          <button className="logout-btn" onClick={logout}>
            로그아웃
          </button>
        </nav>
      </div>
    </header>
  );
}
