import React, { useState } from "react";
import classes from "./Landing.module.css";
import SignUp from "../../components/Signup/Signup";
import Login from "../../components/Login/Login";
import About from "../../components/About/About";
function Landing() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className={classes.container}>
        <div className={classes.inner__container}>
          {show ? (
            <SignUp visible={{ show, setShow }} />
          ) : (
            <Login visible={{ show, setShow }} />
          )}
          <About />
        </div>
      </div>
    </div>
  );
}

export default Landing;
