import React, { Component } from "react";
import "./CssPages/UserProfile.css";
import "./CssPages/CompanyProfile.css";
import FirebaseServices from "../firebase/services";
import { withRouter } from "react-router-dom";
import firebase from "firebase";
import ReactTooltip from "react-tooltip";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faInfoCircle,
  faTrash,
  faPlus,
  faMinus
} from "@fortawesome/free-solid-svg-icons";

library.add(faPlus, faMinus, faTrash, faInfoCircle);

const fs = new FirebaseServices();

class TableRow extends Component {
  constructor(props) {
    super(props);
    this.incrementCoins = this.incrementCoins.bind(this);
    this.decrementCoins = this.decrementCoins.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);
  }

  incrementCoins() {
    var coins = this.props.row.coins;
    coins++;
    var userID = this.props.row.key;
    fs.usersCollection
      .doc(userID)
      .update({ coins: coins })
      .then(() => {
        console.log("coins incremented");
      })
      .catch(err => {
        console.log(err);
      });
  }
  decrementCoins() {
    var coins = this.props.row.coins;
    coins--;
    var userID = this.props.row.key;
    fs.usersCollection
      .doc(userID)
      .update({ coins: coins })
      .then(() => {
        console.log("coins decremented");
      })
      .catch(err => {
        console.log(err);
      });
  }

  deleteEmployee() {
    var userID = this.props.row.key;
    fs.usersCollection
      .doc(userID)
      .delete()
      .then(() => {
        console.log("employee deleted");
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const row = this.props.row;
    const index = this.props.index;
    return (
      <tr>
        <td key={index} className="text-center">
          {index}
        </td>
        <td
          key={`${index}${row.firstName}${row.lastName}`}
          className="text-center"
        >{`${row.firstName} ${row.lastName}`}</td>
        <td
          key={`${index}${row.firstName}${row.lastName}${row.coins}`}
          className="text-center"
        >
          {row.coins}
        </td>
        <td className="text-center">
          <button
            onClick={this.incrementCoins}
            className="btn btn-success btn-sm mx-1"
          >
            <FontAwesomeIcon icon="plus" />
          </button>
          <button
            onClick={this.decrementCoins}
            className="btn btn-success btn-sm mx-1"
          >
            <FontAwesomeIcon icon="minus" />
          </button>
        </td>
        <td className="text-center">
          <button
            onClick={this.deleteEmployee}
            className="btn btn-danger btn-sm"
          >
            <FontAwesomeIcon icon="trash" />
          </button>
        </td>
      </tr>
    );
  }
}

class Panel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      company: this.props.company,
      emailConfirmed: false,
      employees: [],
      userDetails: {
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        email: this.props.user.email
      },
      companyDetails: {
        name: this.props.company.name,
        address: this.props.company.address,
        email: this.props.company.email
      },
      passwords: {
        oldPassword: "",
        newPassword: "",
        newPassword2: ""
      },
      fetchInProgress: false
    };
    this.subscriptions = [];
    this.timeConverter = this.timeConverter.bind(this);
    this.resendConfirmation = this.resendConfirmation.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleCompanyChange = this.handleCompanyChange.bind(this);
    this.updateCompany = this.updateCompany.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    var currentUser = firebase.auth().currentUser;
    if (currentUser) {
      this.setState({ emailConfirmed: currentUser.emailVerified });

      /*if (currentUser.emailVerified) {
        console.log("function");
        this.setState({ showAlert: true }, () => {
          window.setTimeout(() => {
            this.setState({ showAlert: false });
          }, 4000);
        });
      }*/
    }
    this.subscriptions.push(
      fs
        .getCompanyEmployees(this.state.user.companyID)
        .subscribe(employees => this.setState({ employees: employees }))
    );
  }

  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }

  handleUserChange(e) {
    var userDetails = {};
    userDetails = { ...this.state.userDetails };
    userDetails[e.target.name] = e.target.value;
    this.setState({ userDetails });
  }

  handlePasswordChange(e) {
    var passwords = {};
    passwords = { ...this.state.passwords };
    passwords[e.target.name] = e.target.value;
    this.setState({ passwords });
  }

  handleCompanyChange(e) {
    var companyDetails = {};
    companyDetails = { ...this.state.companyDetails };
    companyDetails[e.target.name] = e.target.value;
    this.setState({ companyDetails });
  }

  submitEdit(e) {
    e.preventDefault();
    this.props.showAlert("success", "email not confirmed");
    this.setState({ fetchInProgress: true });
    var newPassword = this.state.passwords.newPassword;
    var newPassword2 = this.state.passwords.newPassword2;
    var oldPassword = this.state.passwords.oldPassword;
    var currentUser = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      currentUser.email,
      oldPassword
    );
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
                let passwords = this.state.passwords;
                passwords.oldPassword = "";
                passwords.newPassword = "";
                passwords.newPassword2 = "";
                this.setState({ passwords });
                alert("Email and Password changed! Please validate new email");
                this.resendConfirmation();
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
                        this.updateUser();
                        this.updateCompany(cred);
                        this.props.history.push("/");
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
                      alert("Wrong password");
                    }
                  });
              })
              .catch(err => {
                console.log(err);
                this.setState({ fetchInProgress: false });
                if (err.code === "auth/wrong-password") {
                  alert("Wrong password");
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
                let passwords = this.state.passwords;
                passwords.oldPassword = "";
                passwords.newPassword = "";
                passwords.newPassword2 = "";
                this.setState({ passwords });
                alert("password changed");
                this.updateUser();
                this.updateCompany(cred);
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
              alert("Wrong password");
            }
          });
      } else {
        alert("Password and verification password don't match");
        this.setState({ fetchInProgress: false });
      }
    } else if (this.props.user.email !== this.state.userDetails.email) {
      currentUser
        .reauthenticateAndRetrieveDataWithCredential(cred)
        .then(() => {
          currentUser
            .updateEmail(this.state.userDetails.email)
            .then(() => {
              this.resendConfirmation();
              alert("Email changed. Please validate new email");
              this.updateUser();
              this.updateCompany(cred);
              this.props.history.push("/");
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
            alert("Wrong password");
          }
        });
    } else {
      this.updateUser();
      this.updateCompany(cred);
    }
  }

  updateUser() {
    var userDetails = this.state.userDetails;
    var user = this.props.user;
    if (
      userDetails.firstName !== user.firstName ||
      userDetails.lastName !== user.lastName ||
      userDetails.email !== user.email
    ) {
      fs.usersCollection
        .doc(user.key)
        .update(userDetails)
        .then(() => {
          firebase.auth().currentUser.reload();
          this.setState({ fetchInProgress: false });
        })
        .catch(err => {
          console.log(err);
          this.setState({ fetchInProgress: false });
        });
    }
  }

  updateCompany(cred) {
    var companyDetails = this.state.companyDetails;
    var company = this.props.company;
    if (
      company.email !== companyDetails.email ||
      company.address !== companyDetails.address ||
      company.name !== companyDetails.name
    ) {
      var oldPassword = this.state.passwords.oldPassword;
      var currentUser = firebase.auth().currentUser;
      if (company.email !== companyDetails.email) {
        cred = firebase.auth.EmailAuthProvider.credential(
          currentUser.email,
          oldPassword
        );
        currentUser
          .reauthenticateAndRetrieveDataWithCredential(cred)
          .then(() => {
            fs.companiesCollection
              .doc(company.key)
              .update(companyDetails)
              .then(() => {
                let passwords = { ...this.state.passwords };
                passwords.oldPassword = "";
                this.setState({ passwords, fetchInProgress: false });
                alert("Company Email updated!");
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
              alert("Wrong password");
            }
          });
      } else {
        fs.companiesCollection
          .doc(company.key)
          .update(companyDetails)
          .then(() => {
            alert("Company Data updated!");
            this.setState({ fetchInProgress: false });
          })
          .catch(err => {
            console.log(err);
            this.setState({ fetchInProgress: false });
          });
      }
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

  componentWillReceiveProps(nextProps) {
    if (this.props.company !== nextProps.company) {
      this.setState({ company: nextProps.company });
      this.setState({
        companyDetails: {
          name: nextProps.company.name,
          address: nextProps.company.address,
          email: nextProps.company.email
        }
      });
    }
  }

  render() {
    const user = this.state.user;
    const userDetails = this.state.userDetails;
    const companyDetails = this.state.companyDetails;
    const company = this.state.company;
    const companyEmail = company.email;
    const companyName = company.name;
    const address = company.address;
    const employees = this.state.employees;
    const created = this.timeConverter(user.created.seconds);
    const emailConfirmed = this.state.emailConfirmed ? "Yes" : "No";
    const employeesRow = employees.map((emp, index) => (
      <TableRow row={emp} index={++index} key={emp.key} />
    ));
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
                  className="link"
                  id="nav-home-tab"
                  data-toggle="tab"
                  href="#nav-home"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                >
                  Company Details
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
                  Employees
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
                    <h6 className="p-3 text-white">Company Admin Details </h6>
                    <div className="ml-3 p">
                      <b>User Email: </b> {user.email}
                    </div>
                    <div className="ml-3 p">
                      <b>First Name: </b> {user.firstName}
                    </div>
                    <div className="ml-3 p">
                      <b>Last Name:</b> {user.lastName}
                    </div>
                    <div className="ml-3 p">
                      <b>Role </b>: Company Admin
                    </div>
                    <div className="ml-3 p">
                      <b>Joined </b>: {created}
                    </div>
                    <div className="ml-3 p">
                      <FontAwesomeIcon
                        style={{ marginLeft: "5px" }}
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
                          If email not confirmed, you cannot accept employees in
                          your company!
                        </p>
                      </ReactTooltip>
                      <b>Email confirmed: </b>
                      {emailConfirmed}
                      {emailConfirmed == "No" ? (
                        <button
                          className="btn btn-info"
                          onClick={this.resendConfirmation}
                        >
                          Resend Mail
                        </button>
                      ) : null}
                    </div>
                    <hr />
                    <h6 className=" pt-2 text-white">Company Details</h6>
                    <div className="ml-3 p">
                      <b>Company Name: </b> {companyName}
                    </div>
                    <div className="ml-3 p">
                      <b>Adress: </b> {address}
                    </div>
                    <div className="ml-3 p">
                      <b>HR Department email: </b> {companyEmail}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane "
                id="nav-device"
                role="tabpanel"
                aria-labelledby="nav-device-tab"
              >
                <h3 className="p-3 text-white text-center">Employees</h3>
                <div>
                  <div className="container">
                    <h6 className="text-white">Employee Management :</h6>
                    <hr />
                    <table className="table table-striped table-sm table-light table-hover">
                      <thead>
                        <tr>
                          <th className="text-center">#</th>
                          <th className="text-center">Name</th>
                          <th className="text-center">
                            Coins <FontAwesomeIcon icon="arrow-down" />
                          </th>
                          <th className="text-center">Manage Coins</th>
                          <th className="text-center">Delete Employee</th>
                        </tr>
                      </thead>
                      <tbody>{employeesRow}</tbody>
                    </table>
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
                  <h6 className="text-white">Company Admin Details</h6>
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
                        onChange={this.handleUserChange}
                        value={userDetails.firstName || ""}
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
                        onChange={this.handleUserChange}
                        value={userDetails.lastName || ""}
                      />
                    </div>
                  </div>

                  <h5 className="text-white"> Company Details</h5>
                  <hr />
                  <div className="row">
                    <div className="form-group input-group-sm col-sm-6">
                      <label htmlFor="companyName" className="text-white small">
                        Company Name
                      </label>
                      <input
                        className="form-control"
                        name="name"
                        type="text"
                        id="companyName"
                        placeholder="Company Name"
                        onChange={this.handleCompanyChange}
                        value={companyDetails.name || ""}
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
                        onChange={this.handleCompanyChange}
                        value={companyDetails.address || ""}
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
                          onChange={this.handleUserChange}
                          value={userDetails.email || ""}
                        />
                      </div>
                      <div className="form-group input-group-sm col-sm-6">
                        <label
                          htmlFor="emailPasswordInput"
                          className="text-white small"
                        >
                          Password
                        </label>
                        <input
                          className="form-control"
                          name="oldPassword"
                          type="password"
                          id="emailPasswordInput"
                          placeholder="Password"
                          onChange={this.handlePasswordChange}
                          value={this.state.passwords.oldPassword || ""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="collapse" id="changePassword">
                    <div className="row pt-3">
                      <div className="form-group input-group-sm col-sm-4">
                        <label
                          htmlFor="newPasswordInput"
                          className="text-white small"
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
                          value={this.state.passwords.newPassword || ""}
                        />
                      </div>
                      <div className="form-group input-group-sm col-sm-4">
                        <label
                          htmlFor="newPassword2Input"
                          className="text-white small"
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
                          value={this.state.passwords.newPassword2 || ""}
                        />
                      </div>
                      <div className="form-group input-group-sm col-sm-4">
                        <label
                          htmlFor="oldPasswordInput"
                          className="text-white small"
                        >
                          Old Password
                        </label>
                        <input
                          className="form-control"
                          name="oldPassword"
                          type="password"
                          id="oldPasswordInput"
                          placeholder="Old Password"
                          onChange={this.handlePasswordChange}
                          value={this.state.passwords.oldPassword || ""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="collapse" id="changeCompanyEmail">
                    <div className="row pt-3">
                      <div className="form-group input-group-sm col-sm-6">
                        <label
                          htmlFor="companyEmailInput"
                          className="text-white small"
                        >
                          Company Email
                        </label>
                        <input
                          className="form-control"
                          name="email"
                          type="text"
                          id="companyEmailInput"
                          placeholder="Company Email"
                          onChange={this.handleCompanyChange}
                          value={companyDetails.email || ""}
                        />
                      </div>

                      <div className="form-group input-group-sm col-sm-6">
                        <label
                          htmlFor="companyEmailPasswordInput"
                          className="text-white small"
                        >
                          Password
                        </label>
                        <input
                          className="form-control"
                          name="oldPassword"
                          type="password"
                          id="companyEmailPasswordInput"
                          placeholder="Password"
                          onChange={this.handlePasswordChange}
                          value={this.state.passwords.oldPassword || ""}
                        />
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
        </div>
      </section>
    );
  }
}
withRouter(Panel);

export class CompanyProfile extends Component {
  constructor(props) {
    super(props);
    this.subscriptions = [];
    this.state = {
      user: props.user,
      company: {}
    };
    this.showAlert = this.showAlert.bind(this);
  }

  showAlert(type, message) {
    this.props.showAlert(type, message);
  }

  componentDidMount() {
    if (this.state.user.companyID) {
      console.log();
      this.subscriptions.push(
        fs.getCompany(this.state.user.companyID).subscribe(company => {
          this.setState({ company: company });
        })
      );
    }
  }
  componentWillUnmount() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  render() {
    const user = this.state.user;
    const company = this.state.company;
    return (
      <div className="py-3 col-sm-12">
        <div className="center">
          <Panel user={user} company={company} showAlert={this.showAlert} />
        </div>
      </div>
    );
  }
}

export default withRouter(CompanyProfile);
