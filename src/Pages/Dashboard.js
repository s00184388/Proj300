import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CssPages/Dashboard.css";

export class Dashboard extends Component {
  render() {
    return (
      <div className="jumbotron">
        <h6 className="text-center">This is the Dashboard Component! </h6>
        <p className="text-center">
          This is how you build a website with React and React-Router
        </p>
        <p className="text-center">This page is for Ryan!</p>
        <Link to="/">
          <button className="btn btn-sm btn-primary">Go Home</button>
        </Link>
      </div>
    );
  }
}

export default Dashboard;
