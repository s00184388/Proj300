import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CssPages/Login.css";
import firebase from "firebase";

export class Login extends Component {
  state = {
    email: "",
    password: "",
    error: null
  };
  handleInputChange = event => {
    this.setState({
       [event.target.name]: event.target.value 
      });
  };
  handleSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;
    console.log(this.state.email);
    console.log(this.state.password);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        this.props.history.push("/wishlist");
      })
      .catch(error => {
        this.setState({ error: error });
      });
  };
  render() {
    const { email, password, error } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={this.handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={this.handleInputChange}
        />

        <button children="Log In" className="btn btn-primary" />
      </form>
    );
  }
}

export default Login;
