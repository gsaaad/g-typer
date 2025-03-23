import React from "react";
import "./Nav.css";

const Nav = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="/" className="navbar-title">
          <h1>G-Typer</h1>
        </a>

        <p className="navbar-subtitle">
          Increase Your Typing Speed &amp; Accuracy
        </p>
      </div>
    </nav>
  );
};

export default Nav;
