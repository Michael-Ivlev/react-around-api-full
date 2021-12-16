import React, { useState } from "react";
import { Link } from "react-router-dom";

export function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    props.handleRegister({ email, password });
  };
  return (
    <main className="main">
      <div className="register">
        <h1 className="register__welcome">Sign up</h1>
        <form onSubmit={handleSubmit} className="register__form">
          <input
            className="register__input"
            placeholder="Email"
            id="email"
            required
            name="email"
            type="email"
            pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="register__input"
            placeholder="Password"
            id="password"
            required
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="register__button-container">
            <button type="submit" className="register__button">
              Sign up
            </button>
          </div>
        </form>

        <div className="register__signup">
          <p>Already a member? </p>
          <Link to="/signin" className="register__signup_link">
            Log in here!
          </Link>
        </div>
      </div>
    </main>
  );
}
