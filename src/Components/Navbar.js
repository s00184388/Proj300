import React from "react";
import { Link } from "react-router-dom";
import {faSignInAlt} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import firebase from "firebase";



//style
import "./Navbar.css";
import LogOut from "./LogOut";

export class Navbar extends React.Component {
  
  componentDidMount(){
    var user = firebase.auth().currentUser
    if(user){
      console.log(user.email);
    }
  }
  render() {
    const imageStyle = { marginLeft: "15px", marginRight:"15px",paddingtop:"0px" };
    return (
      <nav className="navbar navbar-expand-lg navbar-dark backgr">
          {/* Brand*/}
          <Link to="/">
                  <img className="logoImg"
                    src={require("../Images/logo.png")}
                    height="22"
                    alt=""
                    style={imageStyle}
                  />
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto mt-2">
              <li><Link to={'/'} className="nav-link text-white h6 ">Home </Link></li>
              <li><Link to={'/'} className="nav-link text-white h6">Contact</Link></li>
              <li><Link to={'/'} className="nav-link text-white h6">AboutUs</Link></li>
            </ul>
            <ul className="navbar-nav">
              {
                this.props.authenticated ?
                  (
                    <div className="pull-right">
                        <li className="nav-link">
                          <Link to="/"><LogOut></LogOut></Link>
                        </li> 
                    </div>
                  ):
                  (
                    <div  className="pull-right">

                    <div className="nav-item">
                      <Link to="/login" className="text-white h6" style={{ textDecoration: 'none' }}>
                      <FontAwesomeIcon icon={faSignInAlt} className="fa-lg mr-2 backgr"/> 
                      Login
                      </Link>
                    </div> 
                    </div>
                  )
              }       
          </ul> 
          </div>
      </nav>
    );
  }
}

export default Navbar;
