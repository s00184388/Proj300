import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CssPages/Home.css";

export class Home extends Component {
  render() {
    return (
      <div className="jumbotron">
        <h6 className="text-center">This is the home Component! </h6>
        <p className="text-center">
          This is how you build a website with React and React-Router
        </p>
        <p className="text-center">Feel free to edit anything you want here!</p>
        <Link to="/rewards">
          <button className="btn btn-sm btn-primary">Rewards</button>
        </Link>
      </div>
    );
  }
}

export default Home;
