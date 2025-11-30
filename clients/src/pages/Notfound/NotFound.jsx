import React from "react";
import { Link } from "react-router-dom";
import classes from "./NotFound.module.css"

function Four04() {
  return (
    <div className={classes.four04_container}>
      <div className={classes.error_content}>
        <h1 className={classes.error_code}>404</h1>
        <p className={classes.error_message}>
          Oops! The page you're looking for can't be found.
        </p>
        <Link to="/" className={classes.home_link}>
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Four04;
