import React, { Component } from "react";
import "./Footer.css";

class Footer extends Component {
  render() {
    return (
      /**/
      <div className="row">
        <div className="col-lg-4">
          <div className="myTextStyle">Step 1</div>
          <div className="d-flex justify-content-center py-2">
            <img
              src={require("../Images/getting-started/step1.png")}
              height="70"
              weight="60"
              alt=""
            />
          </div>
          <div className="myTextStyle">Register</div>
        </div>
        <div className="col-lg-4">
          <div className="myTextStyle">Step 2</div>
          <div className="d-flex justify-content-center py-2">
            <img
              src={require("../Images/getting-started/step2.png")}
              height="70"
              weight="60"
              alt=""
            />
          </div>
          <div className="myTextStyle">Connect your tracking device</div>
        </div>
        <div className="col-lg-4">
          <div className="myTextStyle">Step 3</div>
          <div className="d-flex justify-content-center py-2">
            <img
              src={require("../Images/getting-started/step5.png")}
              height="70"
              weight="60"
              alt=""
            />
          </div>
          <div className="myTextStyle">Activity and Reward</div>
        </div>
      </div>
    );
  }
}

export default Footer;
