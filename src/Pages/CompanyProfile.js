import React, { Component } from "react";
import "./CssPages/UserProfile.css";
import "./CssPages/CompanyProfile.css";
import FirebaseServices from "../firebase/services";
import firebase from "firebase";
import ReactTooltip from "react-tooltip";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactLoading from "react-loading";

import {
  faInfoCircle,
  faTrash,
  faPlus,
  faMinus
} from "@fortawesome/free-solid-svg-icons";

library.add(faPlus, faMinus, faTrash, faInfoCircle);

const fs = new FirebaseServices();

//component for rendering employees table
class TableRow extends Component {
  constructor(props) {
    super(props);
    this.incrementCoins = this.incrementCoins.bind(this);
    this.decrementCoins = this.decrementCoins.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);
  }
  //method for incrementing an employee's coins
  //the company admin can add coins to employees by pressing on a button
  incrementCoins() {
    var coins = this.props.row.coins;
    coins++;
    var userID = this.props.row.key;
    fs.usersCollection
      .doc(userID)
      .update({ coins: coins })
      .catch(err => {
        console.log(err);
      });
  }
  //same for decrementing coins
  decrementCoins() {
    var coins = this.props.row.coins;
    coins--;
    var userID = this.props.row.key;
    fs.usersCollection
      .doc(userID)
      .update({ coins: coins })
      .catch(err => {
        console.log(err);
      });
  }

  //deleting an employee from the employees table and from the database
  //this deletes his account and everything
  deleteEmployee() {
    var userID = this.props.row.key;
    fs.usersCollection
      .doc(userID)
      .delete()
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

//component for account details, employees table and editing account details
//similar to the one from the brand profile
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
      fetchInProgress: 0
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
    this.deleteAccount = this.deleteAccount.bind(this);
    this.incrementLoading = this.incrementLoading.bind(this);
    this.decrementLoading = this.decrementLoading.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
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

  componentDidMount() {
    var currentUser = firebase.auth().currentUser;
    if (currentUser) {
      this.setState({ emailConfirmed: currentUser.emailVerified });
    }
    this.subscriptions.push(
      fs.getCompanyEmployees(this.state.user.companyID).subscribe(employees => {
        this.setState({ employees: employees });
        this.decrementLoading();
      })
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

  handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.history.push("/login");
      });
  };

  handleCompanyChange(e) {
    var companyDetails = {};
    companyDetails = { ...this.state.companyDetails };
    companyDetails[e.target.name] = e.target.value;
    this.setState({ companyDetails });
  }

  submitEdit(e) {
    e.preventDefault();
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
      this.incrementLoading();
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
                        this.props.showAlert(
                          "success",
                          "Email changed! Please validate new email as soon as possible and log in again ",
                          "Email and Password changed"
                        );
                        this.resendConfirmation();
                        this.updateUser();
                        this.updateCompany(cred);
                        this.decrementLoading();
                      })
                      .catch(err => {
                        console.log(err);
                        this.decrementLoading();
                      });
                  })
                  .catch(err => {
                    console.log(err);
                    this.decrementLoading();
                    if (err.code === "auth/wrong-password") {
                      this.props.showAlert(
                        "warning",
                        "Wrong Password! Please check your inputs and try again!",
                        "Something went wrong!"
                      );
                    }
                  });
              })
              .catch(err => {
                console.log(err);
                this.decrementLoading();
                if (err.code === "auth/wrong-password") {
                  this.props.showAlert(
                    "warning",
                    "Wrong Password! Please check your inputs and try again!",
                    "Something went wrong!"
                  );
                }
              });
          });
      }
    } else if (newPassword && newPassword2) {
      this.incrementLoading();
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
                this.props.showAlert(
                  "success",
                  "Password changed successfully!",
                  "Password changed"
                );
                this.updateUser();
                this.updateCompany(cred);
                let passwords = this.state.passwords;
                passwords.oldPassword = "";
                passwords.newPassword = "";
                passwords.newPassword2 = "";
                this.setState({ passwords });
                this.decrementLoading();
              })
              .catch(err => {
                console.log(err);
                this.decrementLoading();
              });
          })
          .catch(err => {
            console.log(err);
            this.decrementLoading();
            if (err.code === "auth/wrong-password") {
              this.props.showAlert(
                "warning",
                "Wrong Password! Check your inputs and try again!",
                "Something went wrong!"
              );
            }
          });
      } else {
        this.props.showAlert(
          "warning",
          "New password and confirmation new password are not matching!  Check your inputs and try again!",
          "Something went wrong!"
        );
        this.setState({ fetchInProgress: false });
        this.decrementLoading();
      }
    } else if (this.props.user.email !== this.state.userDetails.email) {
      this.incrementLoading();
      currentUser
        .reauthenticateAndRetrieveDataWithCredential(cred)
        .then(() => {
          currentUser
            .updateEmail(this.state.userDetails.email)
            .then(() => {
              var cred = firebase.auth.EmailAuthProvider.credential(
                currentUser.email,
                oldPassword
              );
              this.resendConfirmation();
              this.props.showAlert(
                "success",
                "Email changed! Please validate new email and log in again",
                "Update"
              );
              this.updateUser();
              this.updateCompany(cred);
              this.decrementLoading();
            })
            .catch(err => {
              console.log(err);
              this.decrementLoading();
            });
        })
        .catch(err => {
          console.log(err);
          this.decrementLoading();
          if (err.code === "auth/wrong-password") {
            this.props.showAlert(
              "warning",
              "Wrong password! Check your inputs and try again!",
              "Something went wrong!"
            );
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
      this.incrementLoading();
      fs.usersCollection
        .doc(user.key)
        .update(userDetails)
        .then(() => {
          //console.log(this.state.userDetails);
          this.decrementLoading();
          this.handleLogout();
        })
        .catch(err => {
          console.log(err);
          this.decrementLoading();
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
      this.incrementLoading();
      var currentUser = firebase.auth().currentUser;
      if (company.email !== companyDetails.email) {
        currentUser
          .reauthenticateAndRetrieveDataWithCredential(cred)
          .then(() => {
            fs.companiesCollection
              .doc(company.key)
              .update(companyDetails)
              .then(() => {
                let passwords = { ...this.state.passwords };
                passwords.oldPassword = "";
                this.decrementLoading();
              })
              .catch(err => {
                console.log(err);
                this.decrementLoading();
              });
          })
          .catch(err => {
            console.log(err);
            this.decrementLoading();
            if (err.code === "auth/wrong-password") {
              this.props.showAlert(
                "warning",
                "Wrong password! Check your inputs and try again!",
                "Something went wrong!"
              );
            }
          });
      } else {
        fs.companiesCollection
          .doc(company.key)
          .update(companyDetails)
          .then(() => {
            this.props.showAlert("success", "Your change has been saved!");
            this.decrementLoading();
          })
          .catch(err => {
            console.log(err);
            this.decrementLoading();
          });
      }
    }
  }

  deleteAccount() {
    this.incrementLoading();
    fs.usersCollection
      .doc(this.props.user.key)
      .delete()
      .then(() => {
        this.decrementLoading();
        this.handleLogout();
      })
      .catch(err => {
        console.log(err);
        this.decrementLoading();
      });
  }

  resendConfirmation() {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {})
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
    var fetchInProgress = this.state.fetchInProgress;
    return (
      <section id="tabs" className="project-tab">
        {fetchInProgress > 0 ? (
          <div className="col d-flex justify-content-center">
            <ReactLoading
              type={"spinningBubbles"}
              color={"#fff"}
              height={640}
              width={256}
            />
          </div>
        ) : (
          <div className="row py-3">
            <div className="col-sm-12">
              <nav>
                <div
                  className="nav nav-tabs nav-fill"
                  id="nav-tab"
                  role="tablist"
                >
                  <div
                    className="link h5text"
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
                    className="link h5text"
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
                    className="link h5text"
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
                    <div className="col-sm-4">
                      <h6
                        style={{
                          fontWeight: "bold",
                          color: "white",
                          textAlign: "center"
                        }}
                      >
                        User Profile
                      </h6>
                      <div className="d-flex justify-content-center py-4">
                        <img
                          src={require("../Images/user.png")}
                          height="150"
                          weight="150"
                          alt=""
                          className="img-circle img-responsive "
                        />
                      </div>
                    </div>
                    <div className="col-sm-8 text-white">
                      <h5
                        className="p-3"
                        style={{ fontWeight: "bold", color: "white" }}
                      >
                        Company Admin Details{" "}
                      </h5>
                      <hr />
                      <h6 className="ml-3 text-white small">
                        <b>User Email: </b> {user.email}
                      </h6>
                      <h6 className="ml-3 text-white small">
                        <b>First Name: </b> {user.firstName}
                      </h6>
                      <h6 className="ml-3 text-white small ">
                        <b>Last Name:</b> {user.lastName}
                      </h6>
                      <h6 className="ml-3 text-white small">
                        <b>Role </b>: Company Admin
                      </h6>
                      <h6 className="ml-3 text-white small">
                        <b>Joined </b>: {created}
                      </h6>
                      <h6 className="ml-2 text-white small">
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
                            If email not confirmed, you cannot accept employees
                            in your company!
                          </p>
                        </ReactTooltip>
                        <b>Email confirmed: </b>
                        {emailConfirmed}
                        {emailConfirmed === "No" ? (
                          <button
                            className="btn btn-warning h5text btn-sm"
                            onClick={this.resendConfirmation}
                          >
                            Resend Mail
                          </button>
                        ) : null}
                      </h6>
                      <hr />
                      <h5
                        className="p-3"
                        style={{ fontWeight: "bold", color: "white" }}
                      >
                        Company Details
                      </h5>
                      <h6 className="ml-3 text-white small">
                        <b>Company Name: </b> {companyName}
                      </h6>
                      <h6 className="ml-3 text-white small">
                        <b>Adress: </b> {address}
                      </h6>
                      <h6 className="ml-3 text-white small">
                        <b>HR Department email: </b> {companyEmail}
                      </h6>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane "
                  id="nav-device"
                  role="tabpanel"
                  aria-labelledby="nav-device-tab"
                >
                  <div>
                    <div className="container pt-3">
                      <h5 className="text-white" style={{ fontWeight: "bold" }}>
                        Employee Management :
                      </h5>
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
                    <h5 className="h5text">Company Admin Details</h5>
                    <hr />
                    <div className="row">
                      <div className="form-group input-group-sm col-sm-6">
                        <label
                          htmlFor="firstNameInput"
                          className="h5text small"
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
                        <label htmlFor="lastNameInput" className="h5text small">
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
                        <label htmlFor="companyName" className="h5text small">
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
                        <label htmlFor="address" className="h5text small">
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
                          className="btn-sm btn-warning h5text col-sm-12"
                        >
                          Change Email
                        </button>
                      </div>

                      <div className="col-sm-4">
                        <button
                          data-toggle="collapse"
                          data-target="#changePassword"
                          className="btn-sm btn-warning h5text col-sm-12"
                        >
                          Change Password
                        </button>
                      </div>
                      <div className="col-sm-4">
                        <button
                          data-toggle="collapse"
                          data-target="#changeCompanyEmail"
                          className="btn-sm btn-warning  h5text col-sm-12"
                        >
                          Change Company Email
                        </button>
                      </div>
                    </div>

                    <div id="changeEmail" className="collapse">
                      <div className="row pt-3">
                        <div className="form-group input-group-sm col-sm-6">
                          <label htmlFor="emailInput" className="h5text small">
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
                            className="h5text small"
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
                            className="h5text small"
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
                            className="h5text small"
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
                            className="h5text small"
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
                            className="h5text small"
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
                            className="h5text small"
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
                    <div className="collapse" id="deleteAccount">
                      <h6 className="h5text py-3 text-center">
                        This action cannot be undone! If You delete your
                        account, you will delete the company and all the
                        employee's accounts!
                      </h6>
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-danger btn-sm h5text"
                          onClick={this.deleteAccount}
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                    <hr />
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-sm btn-success h5text"
                      onClick={this.submitEdit}
                    >
                      Save Changes
                    </button>
                  </div>
                  <p className="h5text text-center py-3"> Or Delete Account</p>
                  <div className="d-flex justify-content-center">
                    <button
                      data-toggle="collapse"
                      data-target="#deleteAccount"
                      className="btn-sm btn-danger h5text"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }
}

export class CompanyProfile extends Component {
  constructor(props) {
    super(props);
    this.subscriptions = [];
    this.state = {
      user: props.user,
      company: {},
      fetchInProgress: false
    };
    this.showAlert = this.showAlert.bind(this);
  }

  showAlert(type, message, headline) {
    this.props.showAlert(type, message, headline);
  }

  componentDidMount() {
    this.setState({ fetchInProgress: true });
    if (this.state.user.companyID) {
      this.subscriptions.push(
        fs.getCompany(this.state.user.companyID).subscribe(company => {
          this.setState({ company: company, fetchInProgress: false });
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
    const fetchInProgress = this.state.fetchInProgress;
    return (
      <div className="container-fluid py-3">
        <div className="center">
          {fetchInProgress ? (
            <ReactLoading
              type={"spinningBubbles"}
              color={"#fff"}
              height={640}
              width={256}
            />
          ) : (
            <Panel
              user={user}
              company={company}
              showAlert={this.showAlert}
              history={this.props.history}
            />
          )}
        </div>
      </div>
    );
  }
}

export default CompanyProfile;
