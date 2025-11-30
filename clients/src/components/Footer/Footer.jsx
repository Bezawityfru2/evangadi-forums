import React from "react";
import classes from "./Footer.module.css";
import { LuFacebook } from "react-icons/lu";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa";
import footerLogo from "../../assets/footerLogo.png";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <section className={classes.footer_outer_container}>
        <div className={classes.footer_inner_container}>
          <div className={classes.first_section}>
            <div className={classes.logo_wrapper}>
              <Link to="/">
                <img src={footerLogo} alt="Footer logo" />
              </Link>
            </div>

            <ul className={classes.footer_icons}>
              <li>
                <Link
                  to="https://www.facebook.com/evangaditech"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LuFacebook />
                </Link>
              </li>
              <li>
                <Link
                  to="https://www.instagram.com/evangaditech/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </Link>
              </li>
              <li>
                <Link
                  to="https://www.youtube.com/@EvangadiTech"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AiOutlineYoutube />
                </Link>
              </li>
            </ul>
          </div>

          <div className={classes.second_section}>
            <h3>Useful Links</h3>
            <ul className={classes.lists}>
              <li>
                <Link
                  to="/how-it-works"
                  aria-label="Learn how Evangadi Networks works"
                >
                  How it works
                </Link>
              </li>
              <li>
                <a
                  href="https://www.evangadi.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Terms of Service"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="https://www.evangadi.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Privacy Policy"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div className={classes.third_section}>
            <h3>Contact Info</h3>
            <ul className={classes.lists}>
              <li>
                <Link to="/" aria-label="Visit Evangadi Networks homepage">
                  Evangadi Networks
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@evangadi.com"
                  aria-label="Email support at Evangadi"
                >
                  support@evangadi.com
                </a>
              </li>
              <li>
                <a href="tel:+12023862702" aria-label="Call Evangadi support">
                  +1-202-386-2702
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
