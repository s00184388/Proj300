//modules
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import firebase from "firebase";
import ReactLoading from "react-loading";

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
import EmployeeUserProfile from "./Pages/EmployeeUserProfile";
import CompanyProfile from "./Pages/CompanyProfile";
import BrandProfile from "./Pages/BrandProfile";

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
      user: {},
      fetchInProgress: true
    };
  }

  componentDidMount() {
    this.setState({ fetchInProgress: true });
    firebase.auth().onAuthStateChanged(authenticated => {
      authenticated
        ? this.setState(() => ({
            authenticated: true,
            fetchInProgress: false
          }))
        : this.setState(() => ({
            authenticated: false,
            fetchInProgress: false
          }));
    });

    firebase.auth().onAuthStateChanged(() => {
      this.setState({ fetchInProgress: true });
      if (this.state.authenticated) {
        this.subscriptions.push(
          fs.getConnectedUser().subscribe(user => {
            console.log(user);
            this.setState({
              user: user,
              userRole: user.role,
              userEmail: user.email,
              coins: user.coins,
              fetchInProgress: false
            });
          })
        );
      } else {
        this.setState({ fetchInProgress: false });
      }
    });
  }

  componentWillUnmount() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  render() {
    const name = this.state.user.firstName + " " + this.state.user.lastName;
    const userEmail = this.state.user.email;
    const fetchInProgress = this.state.fetchInProgress;

    const MyRewards = props => {
      return <Rewards user={this.state.user} />;
    };

    const MyProfile = props => {
      return <EmployeeUserProfile user={this.state.user} {...props} />;
    };

    const MyCompanyProfile = props => {
      return <CompanyProfile user={this.state.user} />;
    };

    const MyBrandProfile = props => {
      return <BrandProfile user={this.state.user} {...props} />;
    };

    const MyBrand = props => {
      return <Brand user={this.state.user} {...props} />;
    };

    const MyCompanyDashboard = props => {
      return (
        <CompanyDashboard companyID={this.state.user.companyID} {...props} />
      );
    };

    const MyBrandDashboard = props => {
      return <BrandDashboard brandID={this.state.user.brandID} {...props} />;
    };

    const MyWishlist = props => {
      return <Wishlist user={this.state.user} />;
    };
    return (
      <div
        className={
          fetchInProgress
            ? "container d-flex justify-content-center"
            : "container"
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
          <Router>
            <div>
              <div style={{ height: "100%" }}>
                <Navbar
                  userName={this.state.user.firstName}
                  authenticated={this.state.authenticated}
                  userRole={this.state.user.role}
                  name={name}
                  userEmail={userEmail}
                  coins={this.state.coins}
                />
                {this.state.userRole === "employee" && (
                  <div>
                    <Route exact path="/rewards" component={MyRewards} />
                    <Route path="/wishlist" component={MyWishlist} />
                    <Route exact path="/brands" component={Brands} />
                    <Route path="/brands/:brandName" component={MyBrand} />
                    <Route path="/profile" component={MyProfile} />
                    <Route path={"/admin"} component={Admin} />
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
                    <Route path={"/admin"} component={Admin} />
                    <Route
                      path={"/companyProfile"}
                      component={MyCompanyProfile}
                    />
                    <Route
                      path={"/companyDashboard"}
                      component={MyCompanyDashboard}
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
                    <Route path={"/admin"} component={Admin} />
                    <Route path={"/brandProfile"} component={MyBrandProfile} />
                    <PrivateRoute
                      path={"/companyDashboard"}
                      component={MyCompanyDashboard}
                    />
                    <Route
                      path={"/brandDashboard"}
                      component={MyBrandDashboard}
                    />
                  </div>
                )}

                {this.state.userRole === null && (
                  <div>
                    <PrivateRoute path="/rewards" component={MyRewards} />
                    <PrivateRoute path="/wishlist" component={MyWishlist} />
                    <Route path={"/admin"} component={Admin} />
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
        )}
      </div>
    );
  }
}
export default App;

serviceWorker.register();
