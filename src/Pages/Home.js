import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CssPages/Home.css";

export class Home extends Component {
  render() {
    return (
      <div className="container">
        <div className="jumbotron">
          <h6 className="h4 strong text-center">
            We are a Corporate Health Engagement Platform
          </h6>
          <p className="text-center">
            Create monthly health related competitions for your teams,
            departments and sites to compete against each other, in a few
            minutes.
          </p>
          <p className="text-center strong">
            Protect Your Most Valuable Asset!
          </p>
          <Link to="/rewards">
            <button className="btn btn-sm btn-primary">Explore</button>
          </Link>
          <div class="push" />
        </div>
        <footer className="page-footer font-small blue pt-4 ">
          <div className="row">
            <div className="col-lg-4">
              <img
                src={require("../Images/getting-started/step1.png")}
                height="80"
                weight="80"
                alt=""
              />
              <p className="h6 py-4">Register</p>
            </div>
            <div className="col-lg-4">
              <img
                src={require("../Images/getting-started/step2.png")}
                height="80"
                weight="80"
                alt=""
              />
              <p className="h6 py-4">Connect your tracking device</p>
            </div>
            <div className="col-lg-4">
              <img
                src={require("../Images/getting-started/step5.png")}
                height="80"
                weight="80"
                alt=""
              />
              <p className="h6 py-4">Activity and Reward</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Home;
