import Cookies from "js-cookie";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./index.css";

const Login = () => {
  const [emailInput, setEmail] = useState("");
  const [passwordInput, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const submitForm = async (event) => {
    event.preventDefault();

    const apiUrl = "http://localhost:5000/login";
    const userDetails = {
      email: emailInput,
      password: passwordInput,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };
    try {
      // console.log(1);
      const response = await fetch(apiUrl, options);
      // console.log(2);
      const data = await response.json();
      if (response.ok) {
        Cookies.set("jwt_token", data.jwt_token, { expires: 30 });
        Cookies.set("user_id", data.user_id, { expires: 30 });
        // console.log("It is successful");
        navigate("/");
      } else {
        setErrorMsg(data.error_msg);
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again later.");
    }
  };

  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken !== undefined) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-container">
      <h1 className="login-website-image">Login Page</h1>
      <form className="form-container" onSubmit={submitForm}>
        <div className="input-container">
          <label className="label" htmlFor="username">
            EMAIL
          </label>
          <input
            className="input"
            id="email"
            type="email"
            placeholder="Enter Your Email"
            value={emailInput}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label className="label" htmlFor="password">
            PASSWORD
          </label>
          <input
            className="input"
            id="password"
            type={isChecked ? "text" : "password"}
            placeholder="Enter Your Password"
            value={passwordInput}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="showPassword"
            className="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <label className="checkbox-label" htmlFor="showPassword">
            Show Password
          </label>
        </div>
        <p className="error-message">{errorMsg}</p>
        <div className="login-button-container">
          <button type="submit" className="login-button">
            Login
          </button>
        </div>
        <NavLink to="/register" className="link-register">
          Create New Account
        </NavLink>
      </form>
    </div>
  );
};

export default Login;
