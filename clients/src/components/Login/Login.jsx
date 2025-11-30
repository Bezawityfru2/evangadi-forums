import { Link, useNavigate } from "react-router-dom";
import instance from "../../api/axios";
import classes from "./Login.module.css";
import { useContext, useRef, useState } from "react";
import { AppContext } from "../DataContext/DataContext";
import { BiHide, BiShow } from "react-icons/bi";
import { ClipLoader } from "react-spinners";

function Login({ visible }) {
  const { setShow } = visible;
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useContext(AppContext);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const emailValue = emailRef.current.value.trim();
    const passwordValue = passwordRef.current.value;

    if (!emailValue || !passwordValue) {
      setErrorMessage("Please provide all required information.");
      setIsLoading(false);
      return;
    }

    try {
      const loginResponse = await instance.post("/users/login", {
        email: emailValue,
        password: passwordValue,
      });
      if (loginResponse.status === 200) {
        const token = loginResponse.data.token;
        localStorage.setItem("token", token);

        // Manually set Authorization header for /users/check
        const checkResponse = await instance.get("/users/check", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(checkResponse.data.username); // Adjust based on actual response
        navigate("/");
        

      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Something went wrong!");
      } else {
        setErrorMessage("Network error. Please try again later.");
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className={classes.signIn_container}>
      <h1>Login to your account</h1>
      <p>
        Don't have an account?
        <Link onClick={() => setShow(true)}> Create a new account</Link>
      </p>
      {errorMessage && <p className={classes.error_message}>{errorMessage}</p>}
      <form onSubmit={handleSubmit} className={classes.signIn_form}>
        <div className={classes.label_in}>
          <input
            ref={emailRef}
            type="email"
            placeholder="Email address"
            required
          />
          <div className={classes.password_field}>
            <input
              size="65"
              ref={passwordRef}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={classes.toggle_password}
            >
              {showPassword ? (
                <BiShow size={20} color="#E58600" />
              ) : (
                <BiHide size={20} color="#E58600" />
              )}
            </button>
          </div>
        </div>

        <p className={classes.forgotPwd}>
          <Link className={classes.lnk_toggler} data-panel="panel-forgot">
            Forgot password ?
          </Link>
        </p>
        <button className={classes.submit} type="submit">
          {isLoading ? <ClipLoader size={12} color="gray" /> : "Login"}
        </button>
      </form>
    </section>
  );
}

export default Login;
