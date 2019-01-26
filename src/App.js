//modules
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import firebase from "firebase";


//styling
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faBars,
  faGift,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import * as serviceWorker from './serviceWorker';

//components

import { Home } from "./Pages/Home";
import { Admin } from "./Pages/Admin";
import { CompanyDashboard } from "./Pages/CompanyDashboard";
import { BrandDashboard } from "./Pages/BrandDashboard";
import { Rewards } from "./Pages/Rewards";
import { Navbar } from "./Components/Navbar";
import { Test } from "./Pages/Test";
import {Login } from "./Pages/Login";
import EmployeeForm from "./Pages/Registering/EmployeeForm";


library.add(faHome, faBars, faGift, faTrash);

class App extends Component {
  
  state = {
    authenticated: false,
  };
  
  componentDidMount() {
    firebase.auth().onAuthStateChanged((authenticated) => {
      authenticated
        ? this.setState(() => ({
            authenticated: true,
          }))
        : this.setState(() => ({
            authenticated: false,
          }));
    });
  }
  render() {
    return (
      <Router>
        <div>
          <div style={{ height: "100%" }}>
            <Navbar  authenticated={this.state.authenticated } />
            <div>
              <Route exact path="/" component={Home} />
              <Route path="/admin" component={Admin} />
              <Route path="/CompanyDashboard" component={CompanyDashboard} />
              <Route path="/BrandDashboard" component={BrandDashboard} />
              <Route path="/wishlist" component={Test} />
              <Route path="/rewards" component={Rewards} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={EmployeeForm} />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;

serviceWorker.register();
