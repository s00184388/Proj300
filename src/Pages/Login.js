import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CssPages/Login.css";
import fire from "firebase";
import FirebaseServices from "../firebase/services";
import ReactLoading from "react-loading";

const fs = new FirebaseServices();

export class Login extends Component {
  constructor(props) {
    super(props);
    //the values from inputs are gonna be stored in here
    this.state = {
      email: "",
      password: "",
      error: "",
      AuthPass: "",
      authenticated: "false",
      fetchInProgress: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.history = this.history.bind(this);
  }

  handleChange = e => {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  history() {
    //console.log(this.state.user.role);

    if (this.state.user.role === "employee") {
      return "/profile";
    } else if (this.state.user.role === "companyAdmin") {
      return "/companyProfile";
    } else if (this.state.user.role === "brandAdmin") {
      return "/brandProfile";
    }
  }

  handleSubmit = async e => {
    this.setState({ fetchInProgress: true });
    //(this.state.email);
    //console.log(this.state.password);

    e.preventDefault();

    fs.getUserByEmail(this.state.email)
      .then(user => {
        fire
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password)
          .then(() => {
            this.setState({
              user,
              fetchInProgress: false
            });
            this.props.history.push("/");
            setTimeout(2000);
          })
          .catch(error => {
            this.setState({
              AuthPass: error.message,
              fetchInProgress: false
            });
          });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: err.message,
          authenticated: false,
          fetchInProgress: false
        });
      });
    //console.log(this.state.error);
  };
  render() {
    const email = this.state.email;
    const password = this.state.password;
    const fetchInProgress = this.state.fetchInProgress;
    return (
      <div
        className={
          fetchInProgress
            ? "container pt-5 d-flex justify-content-center"
            : "container pt-5"
        }
      >
        {fetchInProgress ? (
          <ReactLoading
            type={"spinningBubbles"}
            color={"#fff"}
            height={640}
            width={256}
          />
        ) : (
          <div className="form-signin py-3">
            <h4 className="text-white text-center">Please Sign In</h4>
            <hr />
            <form className="mx-auto pt-4" onSubmit={this.handleSubmit}>
              <div className="form-group  input-group-sm">
                <input
                  id="email"
                  className="form-control"
                  name="email"
                  type="text"
                  placeholder="Enter Your Email"
                  onChange={this.handleChange}
                  value={email}
                />
                {this.state.error ? (
                  <div className="small text-white text-center">
                    {this.state.error}
                  </div>
                ) : null}
              </div>
              <div className="form-group input-group-sm">
                <input
                  id="pwd"
                  className="form-control"
                  name="password"
                  type="password"
                  placeholder="Enter Your Password"
                  onChange={this.handleChange}
                  value={password}
                />
                {this.state.AuthPass ? (
                  <div className="small text-white text-center">
                    {"*" + this.state.AuthPass}
                  </div>
                ) : null}
              </div>
              <div className="d-flex justify-content-center pt-3">
                <button
                  className="btn btn-warning btn-sm text-white col-lg-12"
                  id="formSubmit"
                  type="submit"
                  onClick={this.handleSubmit}
                >
                  Login
                </button>
              </div>
              <p className="pt-4 text-white text-center">
                No account yet? Sign up on KudosHealth.
              </p>
              <div className="d-flex justify-content-center ">
                <Link
                  to="/register"
                  className="btn btn-warning btn-sm text-white col-lg-12"
                >
                  Register
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }
}
export default Login;
