import React, { Component } from "react";
import "./CssPages/UserProfile.css";
import FirebaseServices from "../firebase/services";
import firebase from "firebase";
import ReactLoading from "react-loading";
import ReactTooltip from "react-tooltip";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

library.add(faInfoCircle);

const fs = new FirebaseServices();

class Sidepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasDevice: false,
      emailConfirmed: false
    };
    this.timeConverter = this.timeConverter.bind(this);
    this.hasDevice = this.hasDevice.bind(this);
    this.hasDevice(this.props.user.key);
    this.resendConfirmation = this.resendConfirmation.bind(this);
  }

  componentDidMount() {
    var currentUser = firebase.auth().currentUser;
    if (currentUser) {
      this.setState({ emailConfirmed: currentUser.emailVerified });
    }
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

  hasDevice(userID) {
    fs.getDevicebyUser(userID)
      .then(device => {
        if (device.key) {
          this.setState({ hasDevice: true });
        } else this.setState({ hasDevice: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ hasDevice: false });
      });
  }

  resendConfirmation() {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        this.showAlert(
          "success",
          "Your email verification has been sent. Please check your email and log in again!",
          "Email Updated"
        );
        //logout here
      })
      .catch(err => {
        console.log(err);
        this.showAlert(
          "success",
          err.message,
          "Something went wrong! Check your inputs and try again!"
        );
      });
  }

  render() {
    const user = this.props.user;
    const coins = user.coins;
    var role = user.role;
    role = role.charAt(0).toUpperCase() + role.slice(1);
    const created = this.timeConverter(user.created.seconds);
    const isActive = user.points > 0 ? "Yes" : "No";
    const hasDevice = this.state.hasDevice ? "Yes" : "No";
    const emailConfirmed = this.state.emailConfirmed ? "Yes" : "No";
    return (
      <div>
        <ul className="list-group-sm small">
          <li className="list-group-item text-center">
            <b>Profile</b>
          </li>
          <li className="list-group-item">
            <span className="pull-left">
              <strong>Joined: </strong>
            </span>
            {created}
          </li>
          <li className="list-group-item p">
            <span className="pull-left">
              <strong>Coins: </strong>
            </span>
            {coins} K
          </li>
          <li className="list-group-item p ">
            <span className="pull-left ">
              <strong>Role: </strong>
            </span>
            {role}
          </li>
          <li className="list-group-item p">
            <span className="pull-left ">
              <strong>Active today: </strong>
            </span>
            {isActive}
          </li>
          <li className="list-group-item p">
            <span className="pull-left ">
              <strong>Device Connected: </strong>
            </span>
            {hasDevice}
          </li>
          <li className="list-group-item p">
            <span className="pull-left ">
              <FontAwesomeIcon
                style={{ marginLeft: "1px" }}
                data-tip="React-tooltip"
                data-for="confirmationMailTooltip"
                icon="info-circle"
              />
              <ReactTooltip
                place="top"
                type="dark"
                effect="solid"
                id="confirmationMailTooltip"
              >
                <p>
                  If email not confirmed, you cannot gain Kudos and buy
                  products!
                </p>
              </ReactTooltip>
              <strong>Email confirmed: </strong>
            </span>
            {emailConfirmed}
            {emailConfirmed == "No" ? (
              <div className="d-flex justify-content-center pt-2">
                <button
                  className="btn btn-sm btn-warning text-white"
                  onClick={this.resendConfirmation}
                >
                  Resend Mail
                </button>
              </div>
            ) : null}
          </li>
        </ul>
      </div>
    );
  }
}

export class Panel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device: {},
      company: { name: "" },
      userDetails: {
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        email: this.props.user.email
      },
      passwords: {
        oldPassword: "",
        newPassword: "",
        newPassword2: ""
      },
      fetchInProgress: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.getDevice = this.getDevice.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.getDevice(this.props.user.key);

    this.subscriptions = [];
  }

  getDevice(userID) {
    this.setState({ fetchInProgress: true });
    fs.getDevicebyUser(userID)
      .then(device => {
        this.setState({ device: device, fetchInProgress: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ fetchInProgress: false });
      });
  }
  handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.history.push("/login");
      });
  };

  componentDidMount() {
    this.setState({ fetchInProgress: true });
    this.subscriptions.push(
      fs.getCompany(this.props.user.companyID).subscribe(comp => {
        this.setState({ company: comp, fetchInProgress: false });
      })
    );
  }

  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }

  handleChange(e) {
    var userDetails = {};
    userDetails = { ...this.state.userDetails };
    userDetails[e.target.name] = e.target.value;
    this.setState({ userDetails });
    console.log(userDetails);
  }

  handlePasswordChange(e) {
    var passwords = {};
    passwords = { ...this.state.passwords };
    passwords[e.target.name] = e.target.value;
    this.setState({ passwords });
  }

  submitEdit(e) {
    e.preventDefault();
    this.setState({ fetchInProgress: true });
    var currentUser = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      currentUser.email,
      this.state.passwords.oldPassword
    );
    var newPassword = this.state.passwords.newPassword;
    var newPassword2 = this.state.passwords.newPassword2;
    if (
      newPassword &&
      newPassword2 &&
      this.props.user.email !== this.state.userDetails.email
    ) {
      if (newPassword === newPassword2) {
        currentUser
          .reauthenticateAndRetrieveDataWithCredential(cred)
          .then(() => {
            currentUser
              .updatePassword(newPassword)
              .then(() => {
                cred = firebase.auth.EmailAuthProvider.credential(
                  currentUser.email,
                  newPassword
                );
                currentUser
                  .reauthenticateAndRetrieveDataWithCredential(cred)
                  .then(() => {
                    currentUser
                      .updateEmail(this.state.userDetails.email)
                      .then(() => {
                        fs.usersCollection
                          .doc(this.props.user.key)
                          .update(this.state.userDetails)
                          .then(() => {
                            this.setState({ fetchInProgress: false });
                            this.props.showAlert(
                              "success",
                              "Email changed! Please validate new email and log in again",
                              "Update"
                            );
                          })
                          .catch(err => {
                            console.log(err);
                            this.setState({ fetchInProgress: false });
                          });
                      })
                      .catch(err => {
                        console.log(err);
                        this.setState({ fetchInProgress: false });
                      });
                  })
                  .catch(err => {
                    console.log(err);
                    this.setState({ fetchInProgress: false });
                    if (err.code === "auth/wrong-password") {
                      this.props.showAlert(
                        "warning",
                        "Wrong password! Check your inputs and try again!",
                        "Something went wrong!"
                      );
                    }
                  });
              })
              .catch(err => {
                console.log(err);
                this.setState({ fetchInProgress: false });
                if (err.code === "auth/wrong-password") {
                  this.props.showAlert(
                    "warning",
                    "Wrong password! Check your inputs and try again!",
                    "Something went wrong!"
                  );
                }
              });
          });
      }
    } else if (newPassword && newPassword2) {
      if (newPassword === newPassword2) {
        currentUser
          .reauthenticateAndRetrieveDataWithCredential(cred)
          .then(() => {
            currentUser
              .updatePassword(newPassword)
              .then(() => {
                this.props.showAlert(
                  "success",
                  "Password changed successfully!",
                  "Update"
                );
                fs.usersCollection
                  .doc(this.props.user.key)
                  .update(this.state.userDetails)
                  .then(() => {
                    currentUser.reload();
                    this.setState({ fetchInProgress: false });
                  })
                  .catch(err => {
                    console.log(err);
                    this.setState({ fetchInProgress: false });
                  });
              })
              .catch(err => {
                console.log(err);
                this.setState({ fetchInProgress: false });
              });
          })
          .catch(err => {
            console.log(err);
            this.setState({ fetchInProgress: false });
            if (err.code === "auth/wrong-password") {
              this.props.showAlert(
                "warning",
                "Wrong password! Check your inputs and try again!",
                "Something went wrong!"
              );
            }
          });
      } else {
        this.props.showAlert(
          "warning",
          "Check your inputs and try again!",
          "Something went wrong!"
        );
        this.setState({ fetchInProgress: false });
      }
    } else if (this.props.user.email !== this.state.userDetails.email) {
      currentUser
        .reauthenticateAndRetrieveDataWithCredential(cred)
        .then(() => {
          currentUser
            .updateEmail(this.state.userDetails.email)
            .then(() => {
              fs.usersCollection
                .doc(this.props.user.key)
                .update(this.state.userDetails)
                .then(() => {
                  this.setState({ fetchInProgress: false });
                  this.handleLogout();
                  this.props.showAlert(
                    "success",
                    "Email changed! Please validate new email as soon as possible and log in again ",
                    "Update"
                  );
                })
                .catch(err => {
                  console.log(err);
                  this.setState({ fetchInProgress: false });
                  this.props.showAlert(
                    "warning",
                    err.message,
                    "Something went wrong!"
                  );
                });
            })
            .catch(err => {
              console.log(err);
              this.setState({ fetchInProgress: false });
              this.props.showAlert(
                "warning",
                err.message,
                "Something went wrong!"
              );
            });
        })
        .catch(err => {
          console.log(err);
          this.setState({ fetchInProgress: false });
          if (err.code === "auth/wrong-password") {
            this.props.showAlert(
              "warning",
              "Wrong password! Check your inputs and try again!",
              "Something went wrong!"
            );
          }
        });
    } else {
      fs.usersCollection
        .doc(this.props.user.key)
        .update(this.state.userDetails)
        .then(() => {
          this.setState({ fetchInProgress: false });
          this.props.showAlert("success", "Your change has been saved!");
        })
        .catch(err => {
          console.log(err);
          this.setState({ fetchInProgress: false });
          this.props.showAlert("warning", err.message, "Something went wrong!");
        });
    }
  }

  deleteAccount() {
    this.setState({ fetchInProgress: true });
    fs.usersCollection
      .doc(this.props.user.key)
      .delete()
      .then(() => {
        this.setState({ fetchInProgress: false });
        this.handleLogout();
      })
      .catch(err => {
        console.log(err);
        this.setState({ fetchInProgress: false });
      });
  }

  render() {
    const user = this.props.user;
    const userID = user.key;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const name = `${firstName} ${lastName}`;
    const email = user.email;
    const device = this.state.device;
    var deviceApi = device.api;
    if (deviceApi) {
      deviceApi = deviceApi.charAt(0).toUpperCase() + deviceApi.slice(1);
    }
    const company = this.state.company.name;
    const fetchInProgress = this.state.fetchInProgress;

    return (
      <div className="col-sm-9">
        {fetchInProgress ? (
          <div className="col d-flex justify-content-center">
            <ReactLoading
              type={"spinningBubbles"}
              color={"#fff"}
              height={640}
              width={256}
            />
          </div>
        ) : (
          <section id="tabs" className="project-tab">
            <div className="row">
              <div className="col-sm-12">
                <nav>
                  <div
                    className="nav nav-tabs nav-fill"
                    id="nav-tab"
                    role="tablist"
                  >
                    <div
                      className="link"
                      id="nav-home-tab"
                      data-toggle="tab"
                      href="#nav-home"
                      role="tab"
                      aria-controls="nav-home"
                      aria-selected="true"
                    >
                      Home
                    </div>
                    <div
                      className="link"
                      id="nav-device-tab"
                      data-toggle="tab"
                      href="#nav-device"
                      role="tab"
                      aria-controls="nav-device"
                      aria-selected="false"
                    >
                      Device
                    </div>
                    <div
                      className="link"
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
                <hr />
                <div className="tab-content" id="nav-tabContent">
                  <div
                    className="tab-pane active"
                    id="nav-home"
                    role="tabpanel"
                    aria-labelledby="nav-home-tab"
                  >
                    <div className="row">
                      <div className="col-sm-4 d-flex justify-content-center">
                        <img
                          src={require("../Images/user.png")}
                          height="150"
                          weight="150"
                          className="img-circle img-responsive "
                        />
                      </div>
                      <div className="col-sm-8">
                        <h5 className="p-3 text-white">{name}</h5>
                        <hr />
                        <p className="ml-3">
                          <b>Email: </b> {email}
                        </p>
                        <p className="ml-3">
                          <b>Company: </b> {company}
                        </p>
                        <p className="ml-3">
                          <b>Conected to:</b> {deviceApi}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane "
                    id="nav-device"
                    role="tabpanel"
                    aria-labelledby="nav-device-tab"
                  >
                    <h3 className="p-3 text-white text-center">
                      Connect your Device
                    </h3>
                    <h6 className="p-3 text-white text-center">
                      Please connect you device before starting any activity.
                    </h6>
                    {device.key ? (
                      `Connected with ${deviceApi}`
                    ) : (
                      <div>
                        <a
                          href={`https://stravakudos.herokuapp.com/strava/authorize?userId=${userID}`}
                          className="btn btn-sm btn-warning col-lg-6"
                        >
                          Strava
                        </a>
                        <a
                          href={`https://stravakudos.herokuapp.com/fitbit/authorize?userId=${userID}`}
                          className="btn btn-sm btn-warning col-lg-6"
                        >
                          Fitbit
                        </a>
                      </div>
                    )}
                  </div>

                  <div
                    className="tab-pane"
                    id="nav-settings"
                    role="tabpanel"
                    aria-labelledby="nav-settings-tab"
                  >
                    <h3 className="p-3 text-white text-center">
                      Edit User Details
                    </h3>
                    <div className="row">
                      <div className="form-group input-group-sm col-sm-6">
                        <label htmlFor="firstNameInput" className="text-white">
                          First Name
                        </label>
                        <input
                          className="form-control"
                          name="firstName"
                          type="text"
                          id="firstNameInput"
                          placeholder="First Name"
                          onChange={this.handleChange}
                          defaultValue={firstName}
                        />
                      </div>
                      <div className="form-group input-group-sm col-sm-6">
                        <label htmlFor="lastNameInput" className="text-white">
                          Last Name
                        </label>
                        <input
                          className="form-control"
                          name="lastName"
                          type="text"
                          id="lastNameInput"
                          placeholder="Last Name"
                          onChange={this.handleChange}
                          defaultValue={lastName}
                        />
                      </div>
                    </div>

                    <div className="row py-2">
                      <button
                        className="btn btn-primary"
                        type="button"
                        data-toggle="collapse"
                        data-target="#collapseEmail"
                        aria-expanded="false"
                        aria-controls="collapseEmail"
                      >
                        Change Email
                      </button>
                      <button
                        className="btn btn-primary mx-2"
                        type="button"
                        data-toggle="collapse"
                        data-target="#collapsePassword"
                        aria-expanded="false"
                        aria-controls="collapsePassword"
                      >
                        Change Password
                      </button>
                      <button
                        data-toggle="collapse"
                        data-target="#deleteAccount"
                        className="btn-sm btn-danger text-white mx-2"
                      >
                        Delete Account
                      </button>
                    </div>

                    <div
                      className="collapse"
                      id="collapseEmail"
                      style={{ width: "100%" }}
                    >
                      <div className="row">
                        <div className="form-group input-group-sm col-sm-6">
                          <label htmlFor="emailInput" className="text-white">
                            Email
                          </label>
                          <input
                            className="form-control"
                            name="email"
                            type="email"
                            id="emailInput"
                            placeholder="Email"
                            onChange={this.handleChange}
                            defaultValue={email}
                          />
                        </div>
                        <div className="form-group input-group-sm col-sm-6">
                          <label
                            htmlFor="emailPasswordInput"
                            className="text-white"
                          >
                            Password
                          </label>
                          <input
                            className="form-control"
                            name="oldPassword"
                            type="password"
                            id="emailPasswordInput"
                            placeholder="Enter Password"
                            onChange={this.handlePasswordChange}
                            defaultValue=""
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="collapse"
                      id="collapsePassword"
                      style={{ width: "100%" }}
                    >
                      <div className="row">
                        <div className="form-group input-group-sm col-md-4">
                          <label
                            htmlFor="newPasswordInput"
                            className="text-white"
                          >
                            New Password
                          </label>
                          <input
                            className="form-control"
                            name="newPassword"
                            type="password"
                            id="newPasswordInput"
                            placeholder="New Password"
                            onChange={this.handlePasswordChange}
                            defaultValue=""
                          />
                        </div>
                        <div className="form-group input-group-sm col-md-4">
                          <label
                            htmlFor="newPassword2Input"
                            className="text-white"
                          >
                            Re-enter New Password
                          </label>
                          <input
                            className="form-control"
                            name="newPassword2"
                            type="password"
                            id="newPassword2Input"
                            placeholder="Re-enter New Password"
                            onChange={this.handlePasswordChange}
                            defaultValue=""
                          />
                        </div>
                        <div className="form-group input-group-sm col-md-4">
                          <label htmlFor="oldPassword" className="text-white">
                            Old Password
                          </label>
                          <input
                            className="form-control"
                            name="oldPassword"
                            type="password"
                            id="oldPassword"
                            placeholder="Enter Old Password"
                            onChange={this.handlePasswordChange}
                            defaultValue=""
                          />
                        </div>
                      </div>
                    </div>
                    <div className="collapse" id="deleteAccount">
                      <p className="text-white">
                        <b>
                          This action cannot be undone! If You delete your
                          account, you will loose all your Kudos Coins!
                        </b>
                      </p>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={this.deleteAccount}
                      >
                        Delete Account
                      </button>
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
            </div>
          </section>
        )}
      </div>
    );
  }
}

export class EmployeeProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user
    };
    this.showAlert = this.showAlert.bind(this);
  }

  showAlert(type, message, headline) {
    this.props.showAlert(type, message, headline);
  }

  render() {
    const user = this.state.user;
    console.log(this.state.user);
    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <Sidepage user={user} />
          </div>

          <Panel
            user={user}
            showAlert={this.showAlert}
            history={this.props.history}
          />
        </div>
      </div>
    );
  }
}

export default EmployeeProfile;
