//modules
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import firebase from "firebase";

//styling
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faBars,
  faGift,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import * as serviceWorker from "./serviceWorker";
import FirebaseServices from "./firebase/services";

//components

import { Home } from "./Pages/Home";
import { Admin } from "./Pages/Admin";
import { CompanyDashboard } from "./Pages/CompanyDashboard";
import { BrandDashboard } from "./Pages/BrandDashboard";
import { Rewards } from "./Pages/Rewards";
import { Navbar } from "./Components/Navbar";
import { Wishlist } from "./Pages/Wishlist";
import { Login } from "./Pages/Login";
import EmployeeForm from "./Pages/Registering/EmployeeForm";
import Brands from "./Pages/Brands";
import Brand from "./Pages/Brand";

const fs = new FirebaseServices();

library.add(faHome, faBars, faGift, faTrash);

const PrivateRoute = ({
  component: Component,
  role,
  authenticated,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      authenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/Login" />
      )
    }
  />
);

class App extends Component {
  constructor(props) {
    super(props);
    this.subscriptions = [];

    this.state = {
      authenticated: false,
      userRole: "",
      userName: "",
      user: {}
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(authenticated => {
      authenticated
        ? this.setState(() => ({
            authenticated: true
          }))
        : this.setState(() => ({
            authenticated: false
          }));
    });

    firebase.auth().onAuthStateChanged(() => {
      if (this.state.authenticated) {
        this.subscriptions.push(
          fs.getConnectedUser().subscribe(user => {
            console.log(user);
            this.setState({
              user: user,
              userRole: user.role,
              userEmail: user.email
            });
          })
        );
      }
    });
  }

  componentWillUnmount() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  render() {
    const name = this.state.user.firstName + " " + this.state.user.lastName;
    const userEmail = this.state.user.email;

    const MyRewards = props => {
      return <Rewards user={this.state.user} />;
    };

    const MyBrand = props => {
      return <Brand user={this.state.user} {...props} />;
    };

    const MyWishlist = props => {
      return <Wishlist user={this.state.user} />;
    };
    return (
      <Router>
        <div>
          <div style={{ height: "100%" }}>
            <Navbar
              userName={this.state.user.firstName}
              authenticated={this.state.authenticated}
              userRole={this.state.user.role}
              name={name}
              userEmail={userEmail}
            />
            {this.state.userRole === "employee" && (
              <div>
                <Route exact path="/rewards" component={MyRewards} />
                <Route path="/wishlist" component={MyWishlist} />
                <Route exact path="/brands" component={Brands} />
                <Route path="/brands/:brandName" component={MyBrand} />
                <PrivateRoute path={"/admin"} component={Admin} />
                <PrivateRoute
                  path={"/companyDashboard"}
                  component={CompanyDashboard}
                />
                <PrivateRoute
                  path={"/brandDashboard"}
                  component={BrandDashboard}
                />
              </div>
            )}

            {this.state.userRole === "companyAdmin" && (
              <div>
                <PrivateRoute path="/rewards" component={MyRewards} />
                <PrivateRoute path="/wishlist" component={MyWishlist} />
                <PrivateRoute path={"/admin"} component={Admin} />
                <Route
                  path={"/companyDashboard"}
                  component={CompanyDashboard}
                />
                <PrivateRoute
                  path={"/brandDashboard"}
                  component={BrandDashboard}
                />
              </div>
            )}
            {this.state.userRole === "brandAdmin" && (
              <div>
                {console.log(this.state.userRole + "esti brandAdmin!")}
                <PrivateRoute path="/rewards" component={MyRewards} />
                <PrivateRoute path="/wishlist" component={MyWishlist} />
                <PrivateRoute path={"/admin"} component={Admin} />
                <PrivateRoute
                  path={"/companyDashboard"}
                  component={CompanyDashboard}
                />
                <Route path={"/brandDashboard"} component={BrandDashboard} />
              </div>
            )}

            {this.state.userRole === null && (
              <div>
                <PrivateRoute path="/rewards" component={MyRewards} />
                <PrivateRoute path="/wishlist" component={MyWishlist} />
                <PrivateRoute path={"/admin"} component={Admin} />
                <PrivateRoute
                  path={"/companyDashboard"}
                  component={CompanyDashboard}
                />
                <PrivateRoute
                  path={"/brandDashboard"}
                  component={BrandDashboard}
                />
              </div>
            )}
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={EmployeeForm} />
          </div>
        </div>
      </Router>
    );
  }
}
export default App;

serviceWorker.register();
