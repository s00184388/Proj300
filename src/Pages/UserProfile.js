import React, { Component } from "react";
import "./CssPages/UserProfile.css";
import FirebaseServices from "../firebase/services";
import firebase from "firebase";
import ReactLoading from "react-loading";

const fs = new FirebaseServices();

class Sidepage extends Component {
  constructor(props) {
    super(props);
    this.state = { hasDevice: false };
    this.timeConverter = this.timeConverter.bind(this);
    this.hasDevice = this.hasDevice.bind(this);
    this.hasDevice(this.props.user.key);
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

  render() {
    const user = this.props.user;
    const coins = user.coins;
    var role = user.role;
    role = role.charAt(0).toUpperCase() + role.slice(1);
    const created = this.timeConverter(user.created.seconds);
    const isActive = user.points > 0 ? "Yes" : "No";
    const hasDevice = this.state.hasDevice ? "Yes" : "No";
    return (
      <div className="col-sm-3">
        <ul className="list-group-sm">
          <li className="list-group-item text-center">Profile</li>
          <li className="list-group-item text-left">
            <span className="pull-left h6">
              <strong>Joined: </strong>
            </span>
            {created}
          </li>
          <li className="list-group-item text-left">
            <span className="pull-left h6">
              <strong>Coins: </strong>
            </span>
            {coins} K
          </li>
          <li className="list-group-item text-left">
            <span className="pull-left h6">
              <strong>Role: </strong>
            </span>
            {role}
          </li>
          <li className="list-group-item text-left">
            <span className="pull-left h6">
              <strong>Active today: </strong>
            </span>
            {isActive}
          </li>
          <li className="list-group-item text-left">
            <span className="pull-left h6">
              <strong>Device Connected: </strong>
            </span>
            {hasDevice}
          </li>
        </ul>
      </div>
    );
  }
}

export class HeaderProfile extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="container p-2">
        <hr />
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
      fetchInProgress: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.getDevice = this.getDevice.bind(this);
    this.getDevice(this.props.user.key);

    this.subscriptions = [];
  }

  getDevice(userID) {
    fs.getDevicebyUser(userID)
      .then(device => {
        this.setState({ device: device, fetchInProgress: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ fetchInProgress: false });
      });
  }

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

  submitEdit(e) {
    e.preventDefault();
    this.setState({ fetchInProgress: true });
    if (this.props.user.email !== this.state.userDetails.email) {
      console.log("email changed");
      firebase
        .auth()
        .currentUser.updateEmail(this.state.userDetails.email)
        .then(() => {
          fs.usersCollection
            .doc(this.props.user.key)
            .update(this.state.userDetails)
            .then(() => {
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
    } else {
      fs.usersCollection
        .doc(this.props.user.key)
        .update(this.state.userDetails)
        .then(() => {
          this.setState({ fetchInProgress: false });
        })
        .catch(err => {
          console.log(err);
          this.setState({ fetchInProgress: false });
        });
    }
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
      <div className="col-sm-8">
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
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <nav>
                    <div
                      className="nav nav-tabs nav-fill"
                      id="nav-tab"
                      role="tablist"
                    >
                      <a
                        className="nav-item nav-link active links text-grey h6"
                        id="nav-home-tab"
                        data-toggle="tab"
                        href="#nav-home"
                        role="tab"
                        aria-controls="nav-home"
                        aria-selected="true"
                      >
                        Home
                      </a>
                      <a
                        className="nav-item nav-link links text-grey h6"
                        id="nav-device-tab"
                        data-toggle="tab"
                        href="#nav-device"
                        role="tab"
                        aria-controls="nav-device"
                        aria-selected="false"
                      >
                        Device
                      </a>
                      <a
                        className="nav-item nav-link links text-grey h6"
                        id="nav-settings-tab"
                        data-toggle="tab"
                        href="#nav-settings"
                        role="tab"
                        aria-controls="nav-settings"
                        aria-selected="false"
                      >
                        Settings
                      </a>
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
                      <h3 className="p-3 text-white text-center">
                        User Details
                      </h3>
                      <div className="row">
                        <div className="col-lg-4">
                          <img
                            src={require("../Images/user.png")}
                            height="150"
                            weight="150"
                            className="img-circle img-responsive"
                          />
                        </div>
                        <div className="col-lg-8">
                          <h5 className="p-3 text-white">{name}</h5>
                          <p className="ml-3">
                            <b>Email:</b> {email}
                          </p>
                          <p className="ml-3">
                            <b>Company:</b> {company}
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
                          <label htmlFor="firstNameInput">First Name</label>
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
                          <label htmlFor="lastNameInput">Last Name</label>
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
                      <div className="row">
                        <div className="form-group input-group-sm col-sm-6">
                          <label htmlFor="emailInput">Email</label>
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
                      </div>
                      <button
                        className="btn btn-success"
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

export class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user
    };
  }

  render() {
    const user = this.state.user;
    console.log(this.state.user);
    return (
      <div>
        <div className="row">
          <Sidepage user={user} />
          <Panel user={user} />
        </div>
      </div>
    );
  }
}

export default Profile;
