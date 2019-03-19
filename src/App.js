//modules
import React, { Component } from "react";
import firebase from "firebase";
import ReactLoading from "react-loading";
import { AlertList } from "react-bs-notifier";
import { Redirect, Route } from "react-router-dom";
import { Router } from "react-router";
import createHistory from "history/createBrowserHistory";

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
const history = createHistory();

library.add(faHome, faBars, faGift, faTrash);

const PrivateRoute = ({ component: Component, role, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      role === "employee" ? (
        <Component {...props} />
      ) : role === "companyAdmin" ? (
        <Component {...props} />
      ) : role === "brandAdmin" ? (
        <Component {...props} />
      ) : role === "admin" ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
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
      fetchInProgress: true,
      alertMessage: "",
      alertType: "",
      alertVisible: false,
      alertHeadline: ""
    };
    this.showAlert = this.showAlert.bind(this);
    this.AlertOnDismiss = this.AlertOnDismiss.bind(this);
    this.userRole = this.userRole.bind(this);
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

  AlertOnDismiss() {
    this.setState({
      alertVisible: false
    });
  }

  userRole(role) {
    if (this.state.userRole === role) {
      return role;
    } else return "";
  }

  showAlert(type, message, headline) {
    this.setState({
      alertType: type,
      alertMessage: message,
      alertVisible: true,
      alertHeadline: headline
    });
  }

  render() {
    console.log(this.state.userRole);
    const name = this.state.user.firstName + " " + this.state.user.lastName;
    const userEmail = this.state.user.email;
    const fetchInProgress = this.state.fetchInProgress;

    const alerts = [
      {
        id: 1,
        type: this.state.alertType,
        message: this.state.alertMessage,
        headline: this.state.alertHeadline
      }
    ];

    const MyRewards = props => {
      return <Rewards user={this.state.user} />;
    };

    const Register = props => {
      return <EmployeeForm showAlert={this.showAlert} history={history} />;
    };

    const Landing = props => {
      return <Home role={this.state.userRole} />;
    };

    const MyProfile = props => {
      return (
        <EmployeeUserProfile
          user={this.state.user}
          showAlert={this.showAlert}
          history={history}
        />
      );
    };

    const MyCompanyProfile = props => {
      return (
        <CompanyProfile
          user={this.state.user}
          showAlert={this.showAlert}
          history={history}
        />
      );
    };

    const MyBrandProfile = props => {
      return (
        <BrandProfile
          user={this.state.user}
          showAlert={this.showAlert}
          history={history}
        />
      );
    };

    const MyBrand = props => {
      return <Brand user={this.state.user} {...props} />;
    };
    const MyBrands = props => {
      return <Brands {...props} />;
    };

    const MyCompanyDashboard = props => {
      return (
        <CompanyDashboard companyID={this.state.user.companyID} {...props} />
      );
    };

    const MyBrandDashboard = props => {
      return (
        <BrandDashboard
          brandID={this.state.user.brandID}
          showAlert={this.showAlert}
        />
      );
    };

    const MyWishlist = props => {
      return <Wishlist user={this.state.user} />;
    };

    return (
      <div>
        <div
          className={
            fetchInProgress
              ? "container d-flex justify-content-center"
              : "container-fluid"
          }
        >
          {this.state.alertVisible ? (
            <div className="mr-4">
              <AlertList
                alerts={alerts}
                onDismiss={this.AlertOnDismiss}
                timeout={4000}
              />
            </div>
          ) : null}
          {fetchInProgress ? (
            <ReactLoading
              type={"spinningBubbles"}
              color={"#fff"}
              height={640}
              width={256}
            />
          ) : (
            <Router history={history}>
              <div style={{ height: "100%" }}>
                <Navbar
                  userName={this.state.user.firstName}
                  authenticated={this.state.authenticated}
                  userRole={this.state.user.role}
                  name={name}
                  userEmail={userEmail}
                  coins={this.state.coins}
                  {...this.props}
                  history={history}
                />
                {/*Employee  Role */}
                <PrivateRoute
                  exact
                  path={"/admin"}
                  role={this.userRole("admin")}
                  component={Admin}
                />

                <PrivateRoute
                  exact
                  path="/rewards"
                  role={this.userRole("employee")}
                  component={MyRewards}
                />
                <PrivateRoute
                  exact
                  path="/wishlist"
                  role={this.userRole("employee")}
                  component={MyWishlist}
                />
                <PrivateRoute
                  exact
                  path={"/brands"}
                  role={this.userRole("employee")}
                  component={MyBrands}
                />
                <PrivateRoute
                  path="/profile"
                  role={this.userRole("employee")}
                  component={MyProfile}
                />
                <PrivateRoute
                  exact
                  path="/brands/:brandName"
                  role={this.userRole("employee")}
                  component={MyBrand}
                />

                {/*Company*/}
                <PrivateRoute
                  exact
                  path={"/companyDashboard"}
                  role={this.userRole("companyAdmin")}
                  component={MyCompanyDashboard}
                />
                <PrivateRoute
                  exact
                  path={"/companyProfile"}
                  role={this.userRole("companyAdmin")}
                  component={MyCompanyProfile}
                />

                <PrivateRoute
                  exact
                  path={"/admin"}
                  role={this.userRole("admin")}
                  component={Admin}
                />

                <PrivateRoute
                  exact
                  path={"/brandProfile"}
                  role={this.userRole("brandAdmin")}
                  component={MyBrandProfile}
                />
                <PrivateRoute
                  exact
                  path={"/brandDashboard"}
                  role={this.userRole("brandAdmin")}
                  component={MyBrandDashboard}
                />
                <Route exact path="/" component={Landing} />
                <Route path="/login" component={Login} history={history} />
                <Route path="/register" component={Register} />
              </div>
            </Router>
          )}
        </div>
      </div>
    );
  }
}
export default App;

serviceWorker.register();
