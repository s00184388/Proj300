import React from "react";
import { Link } from "react-router-dom";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import firebase from "firebase";
import ReactTooltip from "react-tooltip";

//style
import "./Navbar.css";

export class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setTimeout(() => {
          this.props.history.push("/");
        }, 500);
      });
  };

  render() {
    const Round = props => {
      var letter = "";
      var role = "";
      if (this.props.userRole) {
        role = this.props.userRole;
        letter = role.charAt(0).toUpperCase();
        role = letter + role.substr(1);
      }
      return (
        <div className="ml-2 pt-1">
          <span className="circle" data-tip="React-tooltip">
            <p>{letter}</p>
          </span>
          <ReactTooltip place="bottom" type="dark" effect="float">
            {role}
          </ReactTooltip>
        </div>
      );
    };

    const User = props => {
      return (
        <div>
          <li className="dropdown">
            <div
              className="dropdown-toggle text-white myAccount"
              data-toggle="dropdown"
            >
              <div className="pt-2">Welcome, {this.props.userName}!</div>
            </div>
            <div id="dropdown" className="dropdown-menu">
              <div className="navbar-login">
                <div className="row">
                  <div className="mx-auto row">
                    <FontAwesomeIcon icon={faUser} className="fa-lg mr-2" />
                    <p className="text-center p-0">
                      <strong>{this.props.name}</strong>
                    </p>
                  </div>
                </div>

                {this.props.userRole === "employee" && (
                  <p className="small ml-2 p-0">
                    <strong>Coins: </strong>
                    {this.props.coins} Kudos
                  </p>
                )}
                <p className="small ml-2">{this.props.userEmail}</p>
                <div className="">
                  {this.props.userRole === "employee" ? (
                    <Link
                      to="profile"
                      className="btn-sm btn btn-success col-sm-11 m-2"
                    >
                      My Profile
                    </Link>
                  ) : this.props.userRole === "companyAdmin" ? (
                    <Link
                      to="companyProfile"
                      className="btn-sm btn btn-success col-sm-11 m-2"
                    >
                      Company Profile
                    </Link>
                  ) : (
                    <Link
                      to="brandProfile"
                      className="btn-sm btn btn-success col-sm-11 m-2"
                    >
                      Brand Profile
                    </Link>
                  )}
                  <button
                    className="btn btn-sm btn-danger col-sm-11 m-2"
                    onClick={this.handleLogout}
                  >
                    LogOut
                  </button>
                </div>
              </div>
            </div>
          </li>
        </div>
      );
    };
    return (
      <div className="pb-3">
        <nav className="navbar navbar-expand-lg navbar-dark backgr">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto ">
              {this.props.authenticated === false ? (
                <li>
                  <Link to={"/"} className="nav-link text-white">
                    {" "}
                    Home{" "}
                  </Link>
                </li>
              ) : (
                <div>
                  {this.props.userRole === "employee" && (
                    <div className="row">
                      <li className="">
                        <Link to={"/"} className="nav-link text-white">
                          Home{" "}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/rewards"} className="nav-link text-white">
                          Rewards{" "}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/wishlist"} className="nav-link text-white">
                          Wishlist{" "}
                        </Link>
                      </li>
                      <li>
                        <Link to={"/brands"} className="nav-link text-white">
                          Brands{" "}
                        </Link>
                      </li>
                    </div>
                  )}
                  {this.props.userRole === "brandAdmin" && (
                    <div className="row">
                      <li>
                        <Link to={"/"} className="nav-link text-white">
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={"/brandDashboard"}
                          className="nav-link text-white "
                        >
                          Dashboard{" "}
                        </Link>
                      </li>
                    </div>
                  )}

                  {this.props.userRole === "companyAdmin" && (
                    <div className="row">
                      <li>
                        <Link to={"/"} className="nav-link text-white ">
                          Home{" "}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={"/companyDashboard"}
                          className="nav-link text-white "
                        >
                          Dashboard{" "}
                        </Link>
                      </li>
                    </div>
                  )}
                </div>
              )}
            </ul>
            {this.props.authenticated ? (
              <form className="form-inline my-2 my-lg-0">
                <ul className="navbar-nav mr-auto">
                  <User /> <Round />
                </ul>
              </form>
            ) : (
              <form className="form-inline my-2 my-lg-0">
                <Link to="/login" className="nav-link text-white">
                  Login
                </Link>
              </form>
            )}
          </div>
        </nav>
        <hr />
      </div>
    );
  }
}

export default Navbar;
