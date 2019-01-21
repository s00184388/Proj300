import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CssPages/Login.css";
import fire from "firebase";



export class Login extends Component {
  constructor(props){
    super(props);
    //the values from inputs are gonna be stored in here
    this.state={
      email:'',
      password:'',
      error:''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = e => {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  handleSubmit=e=>{
    console.log(this.state.email);
    console.log(this.state.password);
    console.log(this.state.error);
    e.preventDefault(); 
    fire.auth().signInWithEmailAndPassword(this.state.email,this.state.password).
    then((u)=>{this.props.history.push('/rewards');}).catch((error)=>{
      console.log(error)
    });
  }
  render() {
    const { email, password } = this.state;
    return (
      <div className="container">
            <div className="card col-sm-4 centered bg-primary">
                <div className="card-block">
                  <div className="card-title text-center pt-2">
                      <h4>Sign In</h4>
                      <hr></hr>
                  </div>
                  <div className="card-body">
                      <form className="col-sm-12 mx-auto" onSubmit={this.handleSubmit}>
                          <div className="form-group">
                              <label className="h6 text-white" htmlFor="email">
                                Email
                              </label>
                              <input
                                  id="email"
                                  className="form-control"
                                  name="email"
                                  type="text"
                                  placeholder="Enter Your Email"
                                  onChange={this.handleChange}
                                  value={email}
                                   />
                          </div>
                          <div className="form-group">
                            <label className="h6 text-white" htmlFor="pwd">
                              Password
                            </label>
                            <input
                              id="pwd"
                              className="form-control"
                              name="password"
                              type="password"
                              placeholder="Enter Your Password"
                              onChange={this.handleChange}
                              value={password}
                            />
                          </div>
                          <div className="d-flex justify-content-center py-4">
                          <div className="col-lg-6">
                          <button className="btn btnColor col-lg-12" id="formSubmit" type="submit" onClick={this.handleSubmit}>
                              Login
                          </button>
                          </div>
                          <div className="col-lg-6">
                          <Link to="/register">
                              <button type="button" className="btn btnColor">
                                    Create an Account
                              </button>
                          </Link>
                          </div>
                          </div>
                      </form>
                  </div>
                </div>
            </div>
        </div>
    );
  }
}

export default Login;
