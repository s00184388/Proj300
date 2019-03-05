import React, { Component } from "react";
import "./CssPages/UserProfile.css";
import FirebaseServices from "../firebase/services";
import firebase from "firebase";

const fs = new FirebaseServices();

class Panel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      brand: this.props.brand,
      emailConfirmed: false,
      fetchInProgress: 0
    };
    this.timeConverter = this.timeConverter.bind(this);
    this.resendConfirmation = this.resendConfirmation.bind(this);
    this.incrementLoading = this.incrementLoading.bind(this);
    this.decrementLoading = this.decrementLoading.bind(this);
  }

  timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var day = a.getDate();
    var time = `${day} ${month} ${year}`;
    return time;
  }

  incrementLoading() {
    var ct = this.state.fetchInProgress;
    ct++;
    this.setState({ fetchInProgress: ct });
  }
  decrementLoading() {
    var ct = this.state.fetchInProgress;
    ct--;
    this.setState({ fetchInProgress: ct });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.brand !== nextProps.brand) {
      this.setState({ brand: nextProps.brand });
    }
  }

  componentDidMount() {
    this.incrementLoading();
    var currentUser = firebase.auth().currentUser;
    if (currentUser) {
      this.setState({
        emailConfirmed: currentUser.emailVerified
      });
    }
  }

  resendConfirmation() {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        alert("Verification Email Sent!");
      })
      .catch(err => console.log(err));
  }

  render() {
    const user = this.state.user;
    const brand = this.state.brand;
    const emailConfirmed = this.state.emailConfirmed ? "Yes" : "No";
    return (
      <section id="tabs" className="project-tab">
        <div className="row py-3">
          <div className="col-sm-12">
            <nav>
              <div
                className="nav nav-tabs nav-fill"
                id="nav-tab"
                role="tablist"
              >
                <div
                  className="link col-sm-6 active"
                  id="nav-home-tab"
                  data-toggle="tab"
                  href="#nav-home"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                >
                  Brand Details
                </div>
                <div
                  className="link col-sm-6"
                  id="nav-settings-tab"
                  data-toggle="tab"
                  href="#nav-settings"
                  role="tab"
                  aria-controls="nav-settings"
                  aria-selected="false"
                >
                  Settings
                </div>
              </div>
            </nav>
            <div className="tab-content py-4" id="nav-tabContent">
              <div
                className="tab-pane active"
                id="nav-home"
                role="tabpanel"
                aria-labelledby="nav-home-tab"
              >
                <div className="row py-2">
                  <div className="col-sm-4 d-flex justify-content-center">
                    <img
                      src={require("../Images/user.png")}
                      height="150"
                      weight="150"
                      className="img-circle img-responsive "
                    />
                  </div>
                  <div className="col-sm-8">
                    <h6 className="p-3 text-white">Brand Admin Details </h6>
                    <p className="ml-3">
                      <b>User Email: </b> {user.email}
                    </p>
                    <p className="ml-3">
                      <b>First Name: </b> {user.firstName}
                    </p>
                    <p className="ml-3">
                      <b>Last Name:</b> {user.lastName}
                    </p>
                    <p className="ml-3">
                      <b>Role </b>: Brand Admin
                    </p>
                    <p className="ml-3">
                      <b>Email confirmed: </b>
                      {emailConfirmed}
                      {emailConfirmed == "No" ? (
                        <button
                          className="btn btn-info btn-sm mx-1"
                          onClick={this.resendConfirmation}
                        >
                          Resend Mail
                        </button>
                      ) : null}
                    </p>
                    <hr />
                    <h6 className=" pt-2 text-white">Brand Details</h6>
                    <p className="ml-3">
                      <b>Brand Name: </b> {brand.name}
                    </p>
                    <p className="ml-3">
                      <b>Adress: </b> {brand.address}
                    </p>

                    <p className="ml-3">
                      <b>HR Department email: </b> {brand.email}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane"
                id="nav-settings"
                role="tabpanel"
                aria-labelledby="nav-settings-tab"
              >
                <div className="col-sm-10 mx-auto">
                  <h6 className="text-white">Brand Admin Details</h6>
                  <hr />
                  <div className="row">
                    <div className="form-group input-group-sm col-sm-6">
                      <label
                        htmlFor="firstNameInput"
                        className="text-white small"
                      >
                        First Name
                      </label>
                      <input
                        className="form-control"
                        name="firstName"
                        type="text"
                        id="firstNameInput"
                        placeholder="First Name"
                        onChange={this.handleChange}
                        defaultValue={user.firstName}
                      />
                    </div>
                    <div className="form-group input-group-sm col-sm-6">
                      <label
                        htmlFor="lastNameInput"
                        className="text-white small"
                      >
                        Last Name
                      </label>
                      <input
                        className="form-control"
                        name="lastName"
                        type="text"
                        id="lastNameInput"
                        placeholder="Last Name"
                        onChange={this.handleChange}
                        defaultValue={user.lastName}
                      />
                    </div>
                  </div>

                  <h6 className="text-white"> Brand Details</h6>
                  <hr />
                  <div className="row">
                    <div className="form-group input-group-sm col-sm-6">
                      <label htmlFor="companyName" className="text-white small">
                        Brand Name
                      </label>
                      <input
                        className="form-control"
                        name="companyName"
                        type="text"
                        id="companyName"
                        placeholder="Brand Name"
                        onChange={this.handleChange}
                        defaultValue=""
                      />
                    </div>
                    <div className="form-group input-group-sm col-sm-6">
                      <label htmlFor="address" className="text-white small">
                        Address
                      </label>
                      <input
                        className="form-control"
                        name="address"
                        type="text"
                        id="address"
                        placeholder="Address"
                        onChange={this.handleChange}
                        defaultValue=""
                      />
                    </div>
                  </div>

                  <div className="row pt-3">
                    <div className="col-sm-4">
                      <button
                        data-toggle="collapse"
                        data-target="#changeEmail"
                        className="btn-sm btn-warning text-white col-sm-12"
                      >
                        Change Email
                      </button>
                    </div>

                    <div className="col-sm-4">
                      <button
                        data-toggle="collapse"
                        data-target="#changePassword"
                        className="btn-sm btn-warning text-white col-sm-12"
                      >
                        Change Password
                      </button>
                    </div>
                    <div className="col-sm-4">
                      <button
                        data-toggle="collapse"
                        data-target="#changeCompanyEmail"
                        className="btn-sm btn-warning text-white col-sm-12"
                      >
                        Change Company Email
                      </button>
                    </div>
                  </div>

                  <div id="changeEmail" className="collapse">
                    <div className="row pt-3">
                      <div className="form-group input-group-sm col-sm-6">
                        <label
                          htmlFor="emailInput"
                          className="text-white small"
                        >
                          User Email
                        </label>
                        <input
                          className="form-control"
                          name="email"
                          type="email"
                          id="emailInput"
                          placeholder="Email"
                          onChange={this.handleChange}
                          defaultValue={user.email}
                        />
                      </div>
                      <div className="form-group input-group-sm col-sm-6">
                        <label htmlFor="pwd" className="text-white small">
                          Password
                        </label>
                        <input
                          className="form-control"
                          name="password"
                          type="password"
                          id="pwd"
                          placeholder="Password"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="collapse" id="changePassword">
                    <div className="row pt-3">
                      <div className="form-group input-group-sm col-sm-4">
                        <label htmlFor="pwd1" className="text-white small">
                          Old Password
                        </label>
                        <input
                          className="form-control"
                          name="oldPassword"
                          type="password"
                          id="pwd1"
                          placeholder="Old Password"
                          onChange={this.handleChange}
                          value=""
                        />
                      </div>
                      <div className="form-group input-group-sm col-sm-4">
                        <label htmlFor="pwd2" className="text-white small">
                          New Password
                        </label>
                        <input
                          className="form-control"
                          name="newPassword"
                          type="password"
                          id="pwd2"
                          placeholder="New Password"
                          onChange={this.handleChange}
                          value=""
                        />
                      </div>
                      <div className="form-group input-group-sm col-sm-4">
                        <label htmlFor="pwd3" className="text-white small">
                          Retype new password
                        </label>
                        <input
                          className="form-control"
                          name="retypePassword"
                          type="password"
                          id="pwd3"
                          placeholder="Retype Password"
                          onChange={this.handleChange}
                          value=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="collapse" id="changeCompanyEmail">
                    <div className="row pt-3">
                      <div className="form-group input-group-sm col-sm-6">
                        <label
                          htmlFor="companyEmail"
                          className="text-white small"
                        >
                          Company Email
                        </label>
                        <input
                          className="form-control"
                          name="companyEmail"
                          type="text"
                          id="companyEmail"
                          placeholder="Company Email"
                          onChange={this.handleChange}
                          value=""
                        />
                      </div>

                      <div className="form-group input-group-sm col-sm-6">
                        <label htmlFor="password" className="text-white small">
                          Password
                        </label>
                        <input
                          className="form-control"
                          name="password"
                          type="password"
                          id="password"
                          placeholder="Password"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
              </div>
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-sm btn-success"
                  onClick={this.submitEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export class BrandProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      brand: {}
    };
    this.subscriptions = [];
    this.showAlert = this.showAlert.bind(this);
  }

  showAlert(type, message) {
    this.props.showAlert(type, message);
  }

  componentDidMount() {
    if (this.state.user.brandID) {
      this.subscriptions.push(
        fs.getBrand(this.state.user.brandID).subscribe(brand => {
          this.setState({ brand: brand });
        })
      );
    }
  }
  componentWillUnmount() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  render() {
    const user = this.state.user;
    console.log(this.state.user);
    const brand = this.state.brand;
    return (
      <div className="py-3 col-sm-12">
        <div className="center">
          <Panel user={user} brand={brand} />
        </div>
      </div>
    );
  }
}

export default BrandProfile;
