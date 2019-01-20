import React from "react";
import { Link } from "react-router-dom";


//style
import "./Navbar.css";
import LogOut from "./LogOut";

export class Navbar extends React.Component {
  render() {
    const imageStyle = { marginLeft: "25px" };
    return (
      <nav className="navbar navbar-default navbar-fixed-top bg-primary white">
        <div className="pull-left">
          <div className="navbar-brand m-a-0 p-a-0">
            <Link to="/">
              <img className="logoImg"
                src={require("../Images/logo.png")}
                height="22"
                alt=""
                style={imageStyle}
              />
            </Link>
          </div>
        </div>
          <ul class="navbar-nav">
          {this.props.authenticated ?
          (
            <li class="nav-item  pull-right active">
              <Link  to="/"><LogOut></LogOut></Link>
            </li> 
          ):
          (
            <li class="nav-item  pull-right active">
              <Link  to="/login"><button className="btn btn-defaut">Login</button></Link>
            </li> 
          )}       
          </ul>
      </nav>
    );
  }
}

export default Navbar;
