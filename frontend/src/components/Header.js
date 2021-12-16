import logo from "../images/logo.svg";
import { Link } from "react-router-dom";

export function Header(props) {
  const handleClick = (e) => {
    e.preventDefault();
    props.onSignOut();
  };
  return (
    <header className="header">
      <img className="logo" src={logo} alt="Around The U.S. logo" />
      <div className="header__nav-container">
        <p className="header__email">{props.email}</p>
        <Link
          className="header__link"
          to={props.linkPath ? props.linkPath : "/signin"}
          onClick={props.email ? handleClick : null}
        >
          {props.buttonTitle}
        </Link>
      </div>
    </header>
  );
}
