import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CssPages/Home.css";

class Footer extends Component{
  render(){
    return(
      <div className='row py-3 fixed-bottom'>
          <div className="col-lg-4">
          <p className='text-center text-white h6'>Step 1</p>
          <img
            src={require("../Images/getting-started/step1.png")}
            height="80"
            weight="80"
            alt=""
          />
          <p className="h6 py-4 text-white">Register</p>
        </div>
        <div className="col-lg-4">
          <p className='text-center text-white h6'>Step 2</p>
          <img
            src={require("../Images/getting-started/step2.png")}
            height="80"
            weight="80"
            alt=""
          />
          <p className="h6 py-4 text-white">Connect your tracking device</p>
        </div>
        <div className="col-lg-4">
          <p className='text-center text-white h6'>Step 3</p>
          <img
            src={require("../Images/getting-started/step5.png")}
            height="80"
            weight="80"
            alt=""
          />
          <p className="h6 py-4 text-white">Activity and Reward</p>
        </div>
      </div>
    )
  }
}

export class Home extends Component {
  render() {
    return (
        <div className='container-fluid  h-100'>
          <div className='col-lg-12' style={{marginTop:"7%"}}>
            <div className='row'>
              <div className='mx-auto text-center'>
                <img src={require("../Images/logo.png")}
                    height="50"
                    weight="120"
                />
                <div className='pt-3 h5 text-white'>
                  We are a Corporate Health Engagement Platform
                </div>
                <div className='pt-3 text-white'>
                Create monthly health related competitions for your teams,
                 departments to compete against each other, in a few
                minutes.
                </div>
                <div className='pt-4 col-lg-4 mx-auto'>
                   <Link to='/register' className="btn btn-warning text-white">Become a Member</Link>
                </div>
                <Footer></Footer>
           </div>
        </div>
      </div>
    </div>
          
    )
  }
}

export default Home;
