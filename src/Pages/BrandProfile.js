import React, { Component } from "react";
import "./CssPages/UserProfile.css";
import FirebaseServices from "../firebase/services";
import firebase from "firebase";
import ReactLoading from "react-loading";

const fs = new FirebaseServices();

class Panel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      brand: this.props.brand,
      emailConfirmed: false,
      userDetails: {
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        email: this.props.user.email
      },
      brandDetails: {
        name: this.props.brand.name,
        address: this.props.brand.address,
        email: this.props.brand.email
      },
      passwords: {
        oldPassword: "",
        newPassword: "",
        newPassword2: ""
      },
      fetchInProgress: 0
    };
    this.timeConverter = this.timeConverter.bind(this);
    this.resendConfirmation = this.resendConfirmation.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleBrandChange = this.handleBrandChange.bind(this);
    this.updateBrand = this.updateBrand.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
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
      this.setState({
        brandDetails: {
          name: nextProps.brand.name,
          address: nextProps.brand.address,
          email: nextProps.brand.email
        }
      });
    }
  }

  componentDidMount() {
    var currentUser = firebase.auth().currentUser;
    if (currentUser) {
      this.setState({
        emailConfirmed: currentUser.emailVerified
      });
    }
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

  handleBrandChange(e) {
    var brandDetails = {};
    brandDetails = { ...this.state.brandDetails };
    brandDetails[e.target.name] = e.target.value;
    this.setState({ brandDetails });
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
                        alert(
                          "Email and Password changed! Please validate new email"
                        );
                        this.resendConfirmation();
                        this.updateUser();
                        this.updateBrand(cred);
                        this.props.history.push("/");
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
                      alert("Wrong password");
                    }
                  });
              })
              .catch(err => {
                console.log(err);
                this.decrementLoading();
                if (err.code === "auth/wrong-password") {
                  alert("Wrong password");
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
                alert("password changed");
                this.updateUser();
                this.updateBrand(cred);
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
              alert("Wrong password");
            }
          });
      } else {
        alert("Password and verification password don't match");
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
              alert("Email changed. Please validate new email");
              this.updateUser();
              this.updateBrand(cred);
              this.decrementLoading();
              this.props.history.push("/");
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
            alert("Wrong password");
          }
        });
    } else {
      this.updateUser();
      this.updateBrand(cred);
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
          firebase.auth().currentUser.reload();
          this.decrementLoading();
        })
        .catch(err => {
          console.log(err);
          this.decrementLoading();
        });
    }
  }

  updateBrand(cred) {
    var brandDetails = this.state.brandDetails;
    var brand = this.props.brand;
    if (
      brand.email !== brandDetails.email ||
      brand.address !== brandDetails.address ||
      brand.name !== brandDetails.name
    ) {
      this.incrementLoading();
      var currentUser = firebase.auth().currentUser;
      if (brand.email !== brandDetails.email) {
        currentUser
          .reauthenticateAndRetrieveDataWithCredential(cred)
          .then(() => {
            fs.brandsCollection
              .doc(brand.key)
              .update(brandDetails)
              .then(() => {
                let passwords = { ...this.state.passwords };
                passwords.oldPassword = "";
                this.decrementLoading();
                alert("Brand Email updated!");
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
              alert("Wrong password");
            }
          });
      } else {
        fs.brandsCollection
          .doc(brand.key)
          .update(brandDetails)
          .then(() => {
            alert("Brand Data updated!");
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
        console.log("account deleted");
        this.decrementLoading();
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
      .then(() => {
        alert("Verification Email Sent!");
      })
      .catch(err => console.log(err));
  }

  render() {
    const user = this.state.user;
    const brand = this.state.brand;
    const userDetails = this.state.userDetails;
    const brandDetails = this.state.brandDetails;
    const emailConfirmed = this.state.emailConfirmed ? "Yes" : "No";
    const fetchInProgress = this.state.fetchInProgress;
    console.log(fetchInProgress);
    return (
      <section id="tabs" className="project-tab">
        {fetchInProgress > 0 ? (
          <ReactLoading
            type={"spinningBubbles"}
            color={"#fff"}
            height={640}
            width={256}
          />
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

                    <h6 className="text-white"> Brand Details</h6>
                    <hr />
                    <div className="row">
                      <div className="form-group input-group-sm col-sm-6">
                        <label htmlFor="brandName" className="text-white small">
                          Brand Name
                        </label>
                        <input
                          className="form-control"
                          name="name"
                          type="text"
                          id="brandName"
                          placeholder="Brand Name"
                          onChange={this.handleBrandChange}
                          value={brandDetails.name || ""}
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
                          onChange={this.handleBrandChange}
                          value={brandDetails.address || ""}
                        />
                      </div>
                    </div>

                    <div className="row pt-3">
                      <div className="col-sm-3">
                        <button
                          data-toggle="collapse"
                          data-target="#changeEmail"
                          className="btn-sm btn-warning text-white col-sm-12"
                        >
                          Change Email
                        </button>
                      </div>

                      <div className="col-sm-3">
                        <button
                          data-toggle="collapse"
                          data-target="#changePassword"
                          className="btn-sm btn-warning text-white col-sm-12"
                        >
                          Change Password
                        </button>
                      </div>
                      <div className="col-sm-3">
                        <button
                          data-toggle="collapse"
                          data-target="#changeBrandEmail"
                          className="btn-sm btn-warning text-white col-sm-12"
                        >
                          Change Brand Email
                        </button>
                      </div>
                      <div className="col-sm-3">
                        <button
                          data-toggle="collapse"
                          data-target="#deleteAccount"
                          className="btn-sm btn-danger text-white col-sm-12"
                        >
                          Delete Account
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
                    <div className="collapse" id="changeBrandEmail">
                      <div className="row pt-3">
                        <div className="form-group input-group-sm col-sm-6">
                          <label
                            htmlFor="brandEmailInput"
                            className="text-white small"
                          >
                            Brand Email
                          </label>
                          <input
                            className="form-control"
                            name="email"
                            type="text"
                            id="brandEmailInput"
                            placeholder="Brand Email"
                            onChange={this.handleBrandChange}
                            value={brandDetails.email || ""}
                          />
                        </div>

                        <div className="form-group input-group-sm col-sm-6">
                          <label
                            htmlFor="brandEmailPasswordInput"
                            className="text-white small"
                          >
                            Password
                          </label>
                          <input
                            className="form-control"
                            name="oldPassword"
                            type="password"
                            id="brandEmailPasswordInput"
                            placeholder="Password"
                            onChange={this.handlePasswordChange}
                            value={this.state.passwords.oldPassword || ""}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="collapse" id="deleteAccount">
                      <p className="text-white">
                        <b>
                          This action cannot be undone! If You delete your
                          account, you will delete the brand and all the brand
                          products!
                        </b>
                      </p>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={this.deleteAccount}
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                  <hr />
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
        )}
      </section>
    );
  }
}

export class BrandProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      brand: {},
      fetchInProgress: false
    };
    this.subscriptions = [];
    this.showAlert = this.showAlert.bind(this);
  }

  showAlert(type, message) {
    this.props.showAlert(type, message);
  }

  componentDidMount() {
    this.setState({ fetchInProgress: true });
    if (this.state.user.brandID) {
      this.subscriptions.push(
        fs.getBrand(this.state.user.brandID).subscribe(brand => {
          this.setState({ brand: brand, fetchInProgress: false });
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
    const fetchInProgress = this.state.fetchInProgress;
    return (
      <div className="container-fluid py-3 ">
        <div className="center">
          {fetchInProgress ? (
            <ReactLoading
              type={"spinningBubbles"}
              color={"#fff"}
              height={640}
              width={256}
            />
          ) : (
            <Panel user={user} brand={brand} />
          )}
        </div>
      </div>
    );
  }
}

export default BrandProfile;
