import React, { Component } from "react";
import "./CssPages/UserProfile.css";
import "./CssPages/CompanyProfile.css";
import FirebaseServices from "../firebase/services";
import firebase from "firebase";
import ReactLoading from "react-loading";
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
      employees: []
    };
    this.subscriptions = [];
    this.timeConverter = this.timeConverter.bind(this);
    this.resendConfirmation = this.resendConfirmation.bind(this);
  }

  componentDidMount() {
    var currentUser = firebase.auth().currentUser;
    if (currentUser) {
      this.setState({ emailConfirmed: currentUser.emailVerified });
    }
    this.subscriptions.push(
      fs
        .getCompanyEmployees(this.state.user.companyID)
        .subscribe(employees => this.setState({ employees: employees }))
    );
  }
  componentWillUnmount() {
    this.subscriptions.unsubscribe();
  }
  resendConfirmation() {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        alert("Email Sent!");
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
    }
  }

  render() {
    const user = this.state.user;
    const company = this.state.company;
    const companyEmail = company.email;
    const companyName = company.name;
    const address = company.address;
    const employees = this.state.employees;
    console.log(employees);
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
                    <h6 className="p-3 text-white">Company Admin Detail </h6>
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
                      <b>Role </b>: Company Admin
                    </p>
                    <p className="ml-3">
                      <b>Joined </b>: {created}
                    </p>
                    <p className="ml-3">
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
                    </p>
                    <hr />
                    <h6 className=" pt-2 text-white">Company Details</h6>
                    <p className="ml-3">
                      <b>Company Name: </b> {companyName}
                    </p>
                    <p className="ml-3">
                      <b>Adress: </b> {address}
                    </p>
                    <p className="ml-3">
                      <b>HR Department email: </b> {companyEmail}
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
                  <h6 className="text-white">Company User Details</h6>
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

                  <h6 className="text-white"> Company Details</h6>
                  <hr />
                  <div className="row">
                    <div className="form-group input-group-sm col-sm-6">
                      <label htmlFor="companyName" className="text-white small">
                        Company Name
                      </label>
                      <input
                        className="form-control"
                        name="companyName"
                        type="text"
                        id="companyName"
                        placeholder="Company Name"
                        onChange=""
                        value=""
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
                        onChange=""
                        value=""
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
                          onChange=""
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
                          onChange=""
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
                          onChange=""
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
                          onChange=""
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

export class CompanyProfile extends Component {
  constructor(props) {
    super(props);
    this.subscriptions = [];
    this.state = {
      user: props.user,
      company: {}
    };
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
          <Panel user={user} company={company} />
        </div>
      </div>
    );
  }
}

export default CompanyProfile;
