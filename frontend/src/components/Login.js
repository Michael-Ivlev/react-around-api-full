import React, { useState } from "react";
import { Link } from "react-router-dom";

export function Login(props) {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    props.handleLogin({email, password})
  };
  return (
    <main className="main">
      <div className="login">
        <h1 className="login__welcome">Log in</h1>
        <form onSubmit={handleSubmit} className="login__form">
          <input
            className="login__input"
            placeholder="Email"
            id="email"
            required
            name="email"
            type="email"
            pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
          <input
            className="login__input"
            placeholder="Password"
            id="password"
            required
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="login__button-container">
            <button type="submit" className="login__link">
            Log in
            </button>
          </div>
        </form>

        <div className="login__signup">
          <p>Not a member yet?</p>
          <Link to="/signup" className="signup__link">
          Sign up here! 
          </Link>
        </div>
      </div>
    </main>
  );
}
