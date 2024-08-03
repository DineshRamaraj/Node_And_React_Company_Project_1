import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    conPassword: "",
  });
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const changeShowPassword = () => {
    setIsChecked(!isChecked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, mobile, password, conPassword } = formData;

    if (!username || !email || !mobile || !password || !conPassword) {
      setErrorMessage("*All fields are required");
      setIsError(true);
      return;
    }

    if (password !== conPassword) {
      setErrorMessage("*Passwords do not match");
      setIsError(true);
      return;
    }

    const apiUrl = "https://todo-list-api-xast.onrender.com/api/register";
    const userDetails = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      mobilenumber: formData.mobile,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };

    const response = await fetch(apiUrl, options);
    if (response.ok === true) {
      setIsError(false);
      setErrorMessage("");
      console.log("Registration successful");
      navigate("/login");
    } else {
      const data = await response.json();
      setIsError(true);
      setErrorMessage(data.message);
      console.log("User registration failed");
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-heading">Register</h1>
      <form className="register-form-container" onSubmit={handleSubmit}>
        <div className="register-name-container">
          <input
            type="text"
            name="username"
            className="form-control register-input"
            placeholder="Enter Your UserName"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="register-email-container">
          <input
            type="email"
            name="email"
            className="form-control register-input"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="register-mobile-container">
          <input
            type="text"
            name="mobile"
            className="form-control register-input"
            placeholder="Enter Your Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>
        <div className="register-password-container">
          <input
            type={isChecked ? "text" : "password"}
            name="password"
            className="form-control register-input"
            placeholder="Enter Your Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="register-con-password-container">
          <input
            type={isChecked ? "text" : "password"}
            name="conPassword"
            className="form-control register-input"
            placeholder="Enter Your Confirm Password"
            value={formData.conPassword}
            onChange={handleChange}
          />
        </div>

        <div className="register-checkbox-container">
          <input
            type="checkbox"
            id="showPassword"
            className="register-checkbox"
            checked={isChecked}
            onChange={changeShowPassword}
          />
          <label className="register-checkbox-label" htmlFor="showPassword">
            Show Password
          </label>
        </div>

        {isError && (
          <div className="error-message-container">
            <p className="error-message">{errorMessage}</p>
          </div>
        )}

        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
