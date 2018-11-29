import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CssPages/Rewards.css";

export class Rewards extends Component {
  render() {
    return (
      <div className="jumbotron">
        <h6 className="text-center">This is the Rewards Component! </h6>
        <p className="text-center">
          This is how you build a website with React and React-Router
        </p>
        <p className="text-center">This page is for Cristian!</p>
        <Link to="/wishlist">
          <button className="btn btn-sm btn-primary">Go to Wishlist</button>
        </Link>
      </div>
    );
  }
}

export default Rewards;
