import React, { Component } from "react";
import "./CssPages/UserProfile.css";

export class BrandProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user
    };
  }

  render() {
    const user = this.state.user;
    console.log(this.state.user);
    return (
      <div>
        <div className="row">hello</div>
      </div>
    );
  }
}

export default BrandProfile;
