import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CssPages/Wishlist.css";

export class Wishlist extends Component {
  render() {
    return (
      <div className="jumbotron">
        <h6 className="text-center">This is the Wishlist Component! </h6>
        <p className="text-center">
          This is how you build a website with React and React-Router
        </p>
        <p className="text-center">This page is for Cristina!</p>
        <Link to="/">
          <button className="btn btn-sm btn-primary">Go Home</button>
        </Link>
      </div>
    );
  }
}

export default Wishlist;
