import { MdLogin } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import "./index.css";

const Header = () => {
  const navigate = useNavigate();
  const clickLogout = (e) => {
    Cookies.remove('jwt_token');
    Cookies.remove('user_id');
    navigate('/login');
  };

  return (
    <div className="header-container">
      <div className="header-logo-container">
        <h1 className="logo">
          <Link to="/" className="nav-logo-he
          ading">
            Dinesh
          </Link>
        </h1>
      </div>
      <div className="header-login-container">
        <button type="button" className="logout-button" onClick={clickLogout}>
          <MdLogin className="logout-logo" />
        </button>
      </div>
    </div>
  );
};

export default Header;
