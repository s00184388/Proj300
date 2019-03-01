import React, { Component } from "react";
import "./CssPages/UserProfile.css";
import "./CssPages/CompanyProfile.css";
import FirebaseServices from "../firebase/services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const fs = new FirebaseServices();

class TableRow extends Component {
  render() {
    const row = this.props.row;
    const index = this.props.index;
    return (
      <tr>
        <td key={index}>{index}</td>
        <td key={row.name}>{row.name}</td>
        <td key={row.coins}>{row.coins}</td>
      </tr>
    );
  }
}

class Panel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user
    };
    this.timeConverter = this.timeConverter.bind(this);
  }

  /*componentDidMount() {
    this.employeesSubscr = fs
      .getEmployees(this.props.company.name)
      .subscribe(employees => this.setState({ employees: employees }));
  }
  componentWillUnmount() {
    this.employeesSubscr.unsubscribe();
  }*/

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

  render() {
    const user = this.state.user;
    const employees = this.state.employees;
    //const employeesList = employees.map((emp, index) => (
    //<TableRow row={emp} index={++index} key={emp.key} />
    //));
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
                    <h6 className="p-3 text-white">Company User Detail </h6>
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
                    <hr />
                    <h6 className=" pt-2 text-white">Company Details</h6>
                    <p className="ml-3">
                      <b>Company Name: </b> {this.props.companyName}
                    </p>
                    <p className="ml-3">
                      <b>Adress: </b> {this.props.address}
                    </p>

                    <p className="ml-3">
                      <b>HR Department email: </b> {this.props.companyEmail}
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
                    <table className="table table-striped table-sm">
                      <thead>
                        <tr className="row">
                          <th>#</th>
                          <th className="col-sm-4 text-center">Name</th>
                          <th className="col-sm-3 text-center">
                            Coins <FontAwesomeIcon icon="arrow-down" />
                          </th>
                          <th className="col-sm-4 text-center">
                            Employee Management
                          </th>
                        </tr>
                      </thead>
                      <tbody />
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
              </div>
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
      companyName: "",
      address: "",
      email: ""
    };
  }

  componentDidMount() {
    if (this.props.companyID) {
      this.subscriptions.push(
        fs.getCompanies(this.props.companyID).subscribe(company => {
          this.setState(
            {
              companyName: company[0].name,
              address: company[0].address,
              email: company[0].email
            },
            () => {}
          );
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
    return (
      <div className="py-3 col-sm-12">
        <div className="center">
          <Panel
            user={user}
            companyName={this.state.companyName}
            address={this.state.address}
            companyEmail={this.state.email}
          />
        </div>
      </div>
    );
  }
}

export default CompanyProfile;
