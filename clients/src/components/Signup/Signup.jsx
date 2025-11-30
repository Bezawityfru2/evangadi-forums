import React, { useState } from "react";
import Classes from "./SignUp.module.css";
import { BiHide, BiShow } from "react-icons/bi";
import instance from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const SignUp = ({ visible }) => {
  const { show, setShow } = visible;
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    // Validate required fields
    if (!userName || !firstName || !lastName || !email || !password) {
      setError("Please fill in all required fields.");
      // setIsLoading(false);
      return;
    }

    try {
      const response = await instance.post("users/register", {
        username: userName,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      });
      console.log("User Registerd");
      setShow(false);
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        console.log(error.response.data);
        setError(error.response.data.message); // Show server error message
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };
  return (
    <div className={Classes.signup_container}>
      <h2>Join the network</h2>
      <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      <div className={Classes.login_link}>
        Already have an account?{" "}
        <Link onClick={() => setShow(false)}>Sign in</Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            size="65"
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            style={{ borderColor: error && !userName ? "red" : "" }}
          />
        </div>
        <div className={Classes.inputfirst}>
          <div>
            <input
              size="27"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              style={{ borderColor: error && !firstName ? "red" : "" }}
            />
          </div>

          <div>
            <input
              className={Classes.lastName}
              size="26"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              style={{ borderColor: error && !lastName ? "red" : "" }}
            />
          </div>
        </div>
        <div>
          <input
            size="65"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ borderColor: error && !email ? "red" : "" }}
          />
        </div>
        <div className={Classes.password_field}>
          <input
            size="65"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ borderColor: error && !password ? "red" : "" }}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={Classes.toggle_password}
          >
            {showPassword ? (
              <BiShow size={20} color="#E58600" />
            ) : (
              <BiHide size={20} color="#E58600" />
            )}
          </button>
        </div>
        <div className={Classes.paragrap}>
          <p>
            I agree to the
            <Link to="https://www.evangadi.com/legal/privacy">
              {" "}
              privacy policy{" "}
            </Link>
            and{" "}
            <Link to="https://www.evangadi.com/legal/terms/">
              terms of service
            </Link>
            .
          </p>
        </div>
        <button type="submit">
          {isLoading ? <ClipLoader size={12} color="gray" /> : "Agree and Join"}
        </button>
      </form>

      <div className={Classes.login_link}>
        <Link onClick={() => setShow(false)}>Already have an account?</Link>
      </div>
    </div>
  );
};

export default SignUp;
