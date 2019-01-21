import React, { Component } from "react";
import "./CssPages/Register.css";
import FirebaseServices from "../firebase/services";
import { withRouter } from 'react-router-dom';
import firebase from "firebase";


const fs = new FirebaseServices();

export class Register extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: "",
      name:'',
      location:'',
      passwordOne:'',
      passwordTwo:''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };
  //on change method
  
  handleChange = e => {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  handleSubmit=e=>{
    console.log(this.state);

    e.preventDefault(); 
    let user = {
      email: this.state.email,
      name: this.state.name,
      passwordOne: this.state.passwordOne,
      location: this.state.location,
    };

    firebase
     .auth()
     .createUserWithEmailAndPassword(this.state.email, this.state.passwordOne)
     .then((user) => {
       this.props.history.push('/login');
     })
     .catch((error) => {
       this.setState({ error: error });
     });

    fs.createUser(user);
    console.log(user); 
  }
  render() {
    //companies
    const companies = ['Overstock', 'Kudos Health', 'DHL', 'Continental'];
    const options = companies.map(opt=>
      <option key={opt}>{opt}</option>)
    const { email,name,location,passwordOne,passwordTwo} = this.state;
    return (
      <div className="container">
      <div className="card col-lg-6 centered bg-primary">
          <div className="card-block">
            <div className="card-title text-center pt-2">
                <h4>Register</h4>
                <hr></hr>
            </div>
            <div className="card-body">
                <form className="col-lg-12 mx-auto" onSubmit={this.handleSubmit}>
                  <div className="row">
                      <div className="col-lg-6">
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
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="h6 text-white" htmlFor="name">
                            Name
                          </label>
                          <input
                              id="name"
                              className="form-control"
                              name="name"
                              type="text"
                              placeholder="Enter your name"
                              onChange={this.handleChange}
                              value={name}
                              />
                        </div>
                      </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="h6 text-white" htmlFor="companyList">
                            Select a Category
                        </label>
                          <select id="companyList" name="category" className="form-control" defaultValue="">
                            <option value=""disabled hidden>Select a Company</option>
                            {options}
                          </select>
                      </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-group">
                          <label className="h6 text-white" htmlFor="location">
                            Location
                          </label>
                          <input
                              id="location"
                              className="form-control"
                              name="location"
                              type="text"
                              placeholder="Enter the location"
                              onChange={this.handleChange}
                              value={location}
                          />
                        </div>
                      </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                    <div className="form-group">
                          <label className="h6 text-white" htmlFor="pwdone">
                            Password
                          </label>
                          <input
                              id="pwdone"
                              className="form-control"
                              name="passwordOne"
                              type="password"
                              placeholder="Enter the password"
                              onChange={this.handleChange}
                              value={passwordOne}
                          />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-group">
                          <label className="h6 text-white" htmlFor="pwdtwo">
                            Confirm Password
                          </label>
                          <input
                              id="pwdtwo"
                              className="form-control"
                              name="passwordTwo"
                              type="password"
                              placeholder="Confirm Password"
                              onChange={this.handleChange}
                              value={passwordTwo}
                          />
                        </div>
                      </div>
                  </div>
                    
                  {/* Buttons*/}  
                  <div className="d-flex justify-content-center py-4">
                      <button className="btn btnColor col-lg-12" id="formSubmit" type="submit" onClick={this.handleSubmit}>
                        Register
                      </button>
                  </div>
            </form>
        </div>
      </div>
    </div>
  </div>
    );
  }
}


export default withRouter(Register)

