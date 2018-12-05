import React from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class Sidebar extends React.Component {
  render() {
    return (
      <Menu>
        <Link to="/" className="menu-item">
          <FontAwesomeIcon icon="home" />
          <span>Home</span>
        </Link>
        <Link to="/rewards" className="menu-item">
          <FontAwesomeIcon icon="gift" />
          <span>Rewards</span>
        </Link>
        <Link to="/wishlist" className="menu-item">
          <i className="fa fa-tachometer" />
          <span>Wishlist</span>
        </Link>
        <Link to="/dashboard" className="menu-item">
          Dashboard
        </Link>
        <Link to="/register" className="menu-item">
          Register
        </Link>
        <Link to="/login" className="menu-item">
          Login
        </Link>
      </Menu>
    );
  }
}

export default Sidebar;
