import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CssPages/Login.css";
import fire from "firebase";
import FirebaseServices from "../firebase/services";

const fs = new FirebaseServices();

export class Login extends Component {
  constructor(props){
    super(props);
    //the values from inputs are gonna be stored in here
    this.state={
      email:'',
      password:'',
      error:'',
      authenticated:'false',
      searchedUser:props.searchedUser,
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

    e.preventDefault(); 

    fs.getUserByEmail(this.state.email)
    .then(user=>{
      fire.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
      .then(()=>{
        this.setState({
          searchedUser:user,
        })
         this.props.history.push('/')
        console.log(this.state.searchedUser);        
      })
      .catch((error)=>{
        console.log(error)
      });
    })
    .catch(err=>{
      console.log(err);
      this.setState({error: err,
      authenticated:false})
      alert(err.message);
    });
    console.log(this.state.error);
  }
  render() {
    const { email, password} = this.state;
  
    return (
      <div className="container">
            <div className="card col-lg-4 centered registerCard">
                <div className="card-block">
                  <div className="card-title text-center text-white pt-2">
                      <h4>Login</h4>
                      <hr></hr>
                  </div>
                  <div className="card-body">
                      <form className="mx-auto" onSubmit={this.handleSubmit}>
                          <div className="form-group  input-group-sm ">
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
                          </div>
                          <div className='row mx-auto pt-2'>
                                <div className='col-lg-5'>
                                  <button className="btn btn-warning btn-sm col-lg-12  text-white btn-sm" id="formSubmit" type="submit" onClick={this.handleSubmit}>
                                    Login
                                  </button>
                                </div>
                                <div className='col-lg-2'>
                                  <p className='text-white'>OR</p>
                                </div>
                                <div className='col-lg-5'>
                                  <Link to='/register' className='btn btn-warning btn-sm text-white col-lg-12'>Register</Link>
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
