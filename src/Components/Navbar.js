import React from "react";
import { Link } from "react-router-dom";
import {faSignInAlt} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


//style
import "./Navbar.css";
import LogOut from "./LogOut";


export class Navbar extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    const imageStyle = { marginLeft: "15px", marginRight:"15px",paddingtop:"0px" }
    
    const Round=(props)=>{      
      return(
        <div>
          {this.props.userRole==='brandAdmin'&&
            (
                <span className='circle'>BA</span>
            )}
          
          {this.props.userRole==='employee'&&
            <span className=''>E</span>
          }

          {this.props.userRole==='companyAdmin'&&
            <span className=''>CA</span>
          }

        </div>
      )
    }

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
              <div className='row'>
                {this.props.userRole===null &&
                  <li><Link to={'/'} className="nav-link text-white h6 ">Home </Link></li>
                }
                {this.props.userRole==='employee' &&
                  (
                    <div className='row m-2'>
                      <li><Link to={'/'} className="nav-link text-white h6 ">Home </Link></li>
                      <li><Link to={'/rewards'} className="nav-link text-white h6 ">Rewards </Link></li>
                      <li><Link to={'/wishlist'} className="nav-link text-white h6 ">Wishlist </Link></li>
                      <li><Link to={'/brands'} className="nav-link text-white h6 ">Brands </Link></li>
                    </div>
                  )}
                {this.props.userRole==='brandAdmin' &&
                  (
                    <div className='row m-2'>
                      <li><Link to={'/'} className="nav-link text-white h6 ">Home </Link></li>
                      <li><Link to={'/brandDashboard'} className="nav-link text-white h6 ">Dashboard </Link></li>
                      <li><Link to={'/brands'} className="nav-link text-white h6 ">Brands </Link></li>
                    </div>
                  )}
                
                {this.props.userRole==='companyAdmin' &&
                  (
                    <div className='row m-2'>
                      <li><Link to={'/'} className="nav-link text-white h6 ">Home </Link></li>
                      <li><Link to={'/companyDashboard'} className="nav-link text-white h6 ">Dashboard </Link></li>
                      <li><Link to={'/brands'} className="nav-link text-white h6 ">Brands </Link></li>
                    </div>
                  )}

              </div>
            </ul>
            <ul className="navbar-nav">
              {
                this.props.authenticated ?
                  (
                    <div className="pull-right">
                      <div className='row'>
                      <Round></Round>
                        <p className='text-white pt-3 h6'>Hello, {this.props.userName}! Your role  {this.props.userRole}</p>
                        <li className="nav-link">
                          <Link to="/"><FontAwesomeIcon icon={faSignInAlt} className="fa-lg m-1 backgr"/> <LogOut></LogOut></Link>
                        </li>
                      </div>
                    </div>
                  ):
                  (
                    <div  className="pull-right">
                    <div className="nav-item">
                      <Link to="/login" className="text-white h6" style={{ textDecoration: 'none' }}>
                      <FontAwesomeIcon icon={faSignInAlt} className="fa-lg m-1 backgr"/> 
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
