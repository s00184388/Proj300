import React from "react";
import { Link } from "react-router-dom";
import {faUser} from "@fortawesome/free-solid-svg-icons";
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
        <div className='ml-2'>
          {this.props.userRole==='brandAdmin'&&
            (
                <span className='circle'>
                <p>B</p></span>
            )}
          
          {this.props.userRole==='employee'&&
               <span className='circle'>
              <p>E</p>
            </span>
          }
          {this.props.userRole==='companyAdmin'&&
            <span className='circle'><p>C</p></span>
          }
        </div>
      )
    }

    const User=(props)=>{
      return(
      <div className="pull-right">
                <ul className="pull-right ml-5 p-4">
                    <li className="dropdown row">
                        <div  className="dropdown-toggle text-white rows p-1" data-toggle="dropdown">  
                           Welcome, {this.props.userName}!
                        </div>
                        <Round></Round>

                        <ul className="dropdown-menu customMenu">
                            
                            <div className="navbar-login ">
                                  <div className="row">
                                      <div className='mx-auto row'>
                                        <FontAwesomeIcon icon={faUser} className="fa-lg mr-2"/>
                                        <p className="text-center p-0"><strong>{this.props.name}</strong></p>
                                      </div>
                                  </div>
                                  <p className="text-center small p-0">{this.props.userEmail}</p>
                            <li>
                                <div className='row ml-2'>
                                    <button className='btn-sm btn btn-success col-lg-5 mr-2'>My Profile</button>
                                    <LogOut></LogOut>
                                </div>
                            </li>
                             </div> 
                            
                        </ul>
                      </li>

                </ul>
              </div>
      )
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-dark backgr">
          {/* Brand
          <Link to="/">
                  <img className="logoImg"
                    src={require("../Images/logo.png")}
                    height="22"
                    alt=""
                    style={imageStyle}
                  />
          </Link>*/}
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto ">
              <div className='row ml-4 p-2'>
                {this.props.userRole===null &&
                  <li className="nav-link text-white"><Link to={'/'}> Home </Link></li>
                }
                {this.props.userRole==='employee' &&
                  (
                    <div className='row'>
                      <li><Link to={'/'} className="nav-link text-white h6 ml-2">Home </Link></li>
                      <li><Link to={'/rewards'} className="nav-link text-white h6 ml-2 ">Rewards </Link></li>
                      <li><Link to={'/wishlist'} className="nav-link text-white h6 ml-2 ">Wishlist </Link></li>
                      <li><Link to={'/brands'} className="nav-link text-white h6 ml-2 ">Brands </Link></li>
                    </div>
                  )}
                {this.props.userRole==='brandAdmin' &&
                  (
                    <div className='row'>
                      <li><Link to={'/'} className="nav-link text-white h6 ml-2 ">Home</Link></li>
                      <li><Link to={'/brandDashboard'} className="nav-link h6 text-white ml-2">Dashboard </Link></li>
                      <li><Link to={'/brands'} className="nav-link text-white h6 ml-2 ">Brands </Link></li>
                    </div>
                  )}
                
                {this.props.userRole==='companyAdmin' &&
                  (
                    <div className='row'>
                      <li><Link to={'/'} className="nav-link text-white ml-2 h6 ">Home </Link></li>
                      <li><Link to={'/companyDashboard'} className="nav-link text-white ml-2 h6 ">Dashboard </Link></li>
                      <li><Link to={'/brands'} className="nav-link text-white ml-2 h6 ">Brands </Link></li>
                    </div>
                  )}

              </div>
            </ul>
            <ul className="navbar-nav">
              {
                this.props.authenticated ?
                  (
                    <User></User>
                  ):
                  (
                    <div  className="pull-right">
                    <div className="nav-item mr-5">
                      <div className='pt-4 col-lg-4 mx-auto'>
                         <Link to='/login' className="btn btn-warning btn-sm text-white">Login</Link>
                      </div>
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
