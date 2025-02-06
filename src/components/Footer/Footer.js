import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <p>&copy; {new Date().getFullYear()} G-Typer. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;