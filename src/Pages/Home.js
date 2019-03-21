import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CssPages/Home.css";
import "../Components/Footer.css";

export class Home extends Component {
  constructor(props) {
    super(props);
    this.choose = this.choose.bind(this);
  }

  componentDidMount() {
    //console.log(this.props.role);
    this.choose(this.props.role);
  }

  choose = role => {
    if (role === "employee") {
      return "/profile";
    } else if (role === "companyAdmin") {
      return "/companyProfile";
    } else if (role === "brandAdmin") {
      return "/brandProfile";
    }
  };

  render() {
    //(this.props.role);
    //console.log(this.choose(this.props.role));
    return (
      <div>
        <div className="container-fluid py-5">
          <div className="row">
            <div className="mx-auto text-center">
              <img
                src={require("../Images/logo.png")}
                height="50"
                weight="120"
                alt=""
              />
              <div className="pt-3 h5 text-white">
                We are a Corporate Health Engagement Platform
              </div>
              <div className="pt-3 text-white">
                Create monthly health related competitions for your teams,
                departments to compete against each other, in a few minutes.
              </div>
              <div className="pt-4 col-lg-6 mx-auto">
                {this.props.role ? (
                  <Link
                    to={this.choose(this.props.role)}
                    className="btn btn-warning text-white"
                  >
                    View Profile
                  </Link>
                ) : (
                  <Link to="/register" className="btn btn-warning text-white">
                    Become a Member
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="row py-5" style={{ marginTop: "10%" }}>
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
        </div>
      </div>
    );
  }
}

export default Home;
