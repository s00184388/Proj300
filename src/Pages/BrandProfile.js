import React, { Component } from "react";
import "./CssPages/UserProfile.css";
import FirebaseServices from "../firebase/services";
import firebase from "firebase";
import ReactLoading from "react-loading";

const fs = new FirebaseServices();

//component for showing main data about the account
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
    //binding methods so they can use the "this."
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

  //converting timestamp into time
  //because we save the created datetime as a timestamp
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
    return time; //as a string
  }

  //increment the number of loading processes
  incrementLoading() {
    var ct = this.state.fetchInProgress;
    ct++;
    this.setState({ fetchInProgress: ct });
  }

  //decrements the number of processes
  //the loading animation stops if this number is 0
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

  //when user changed data, the object is modified
  handleUserChange(e) {
    var userDetails = {};
    userDetails = { ...this.state.userDetails };
    userDetails[e.target.name] = e.target.value;
    this.setState({ userDetails });
  }

  //on logout the firebase logout method is being called
  handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        //redirects to the login page
        this.props.history.push("/login");
      });
  };

  //when the passwords are changed, the object is being saved
  handlePasswordChange(e) {
    var passwords = {};
    passwords = { ...this.state.passwords };
    passwords[e.target.name] = e.target.value;
    this.setState({ passwords });
  }

  //when brand info changed, they are saved in an object
  handleBrandChange(e) {
    var brandDetails = {};
    brandDetails = { ...this.state.brandDetails };
    brandDetails[e.target.name] = e.target.value;
    this.setState({ brandDetails });
  }

  //method called on submitting the info changed
  submitEdit(e) {
    e.preventDefault();
    var newPassword = this.state.passwords.newPassword;
    var newPassword2 = this.state.passwords.newPassword2;
    var oldPassword = this.state.passwords.oldPassword;
    var currentUser = firebase.auth().currentUser;
    //saving credentials given by the firebase using email and password
    //password was provided in a special field, email is already saved
    //some special actions like changing the email or password requires these credentials
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
        //if the user wants to change password, it has to be recently logged in.
        //to be sure of that, on every password change, it will reauthenticate using the credentials
        //this doesn't mean user is getting logged out and relogged in
        //user will see no difference
        currentUser
          .reauthenticateAndRetrieveDataWithCredential(cred)
          .then(() => {
            //updating password in db
            currentUser
              .updatePassword(newPassword)
              .then(() => {
                //emptying fields
                let passwords = this.state.passwords;
                passwords.oldPassword = "";
                passwords.newPassword = "";
                passwords.newPassword2 = "";
                this.setState({ passwords });
                //getting new credentials for changing the email
                cred = firebase.auth.EmailAuthProvider.credential(
                  currentUser.email,
                  newPassword
                );
                //same as before, only differnce is that
                //user will get logged out only when email changed
                //and has to login again
                currentUser
                  .reauthenticateAndRetrieveDataWithCredential(cred)
                  .then(() => {
                    currentUser
                      .updateEmail(this.state.userDetails.email)
                      .then(() => {
                        //on correclty changing email, notification is shown
                        this.props.showAlert(
                          "success",
                          "Email changed! Pleadsadsse validate new email as soon as possible and log in again ",
                          "Email and Password changed"
                        );
                        //updating all other fields
                        this.resendConfirmation();
                        this.updateUser();
                        this.updateBrand(cred);
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

              this.updateUser();
              this.updateBrand(cred);
              this.props.showAlert(
                "success",
                "Email changed!Please validate new email as soon as possible and log in again ",
                "Email and Password changed"
              );
              this.decrementLoading();
              this.handleLogout();
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
      this.updateUser();
      this.updateBrand(cred);
    }
  }

  updateUser() {
    var userDetails = this.state.userDetails;
    var user = this.props.user;
    //checking if user data needs to be updated
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
    //checking if brand data needs to be updated
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
                this.props.showAlert(
                  "success",
                  "Brand email updated!",
                  "Update"
                );
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
        fs.brandsCollection
          .doc(brand.key)
          .update(brandDetails)
          .then(() => {
            this.props.showAlert(
              "success",
              "Brand data has been updated!",
              "Update"
            );
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

  //method for resending confirmation email
  //for having a verified email
  resendConfirmation() {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {})
      .catch(err => console.log(err));
  }

  render() {
    const user = this.state.user;
    const brand = this.state.brand;
    const userDetails = this.state.userDetails;
    const brandDetails = this.state.brandDetails;
    const emailConfirmed = this.state.emailConfirmed ? "Yes" : "No";
    const fetchInProgress = this.state.fetchInProgress;
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
                    className="link col-sm-6 active h5text"
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
                    className="link col-sm-6 h5text"
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
                        alt=""
                        weight="150"
                        className="img-circle img-responsive "
                      />
                    </div>
                    <div className="col-sm-8">
                      <h5 className="p-3 text-white h5text">
                        Brand Admin Details{" "}
                      </h5>
                      <hr />
                      <p className="ml-3 text-white">
                        <b>User Email: </b>
                        {user.email}
                      </p>
                      <p className="ml-3 text-white">
                        <b>First Name: </b> {user.firstName}
                      </p>
                      <p className="ml-3 text-white">
                        <b>Last Name:</b> {user.lastName}
                      </p>
                      <p className="ml-3 text-white">
                        <b>Role </b>: Brand Admin
                      </p>
                      <p className="ml-3 text-white">
                        <b>Email confirmed: </b>
                        {emailConfirmed}
                        {emailConfirmed === "No" ? (
                          <button
                            className="btn btn-warning btn-sm mx-2 h5text"
                            onClick={this.resendConfirmation}
                          >
                            Resend Mail
                          </button>
                        ) : null}
                      </p>
                      <hr />
                      <h5 className="ml-3 h5text">Brand Details</h5>
                      <hr />
                      <p className="ml-3 text-white">
                        <b>Brand Name: </b> {brand.name}
                      </p>
                      <p className="ml-3 text-white">
                        <b>Adress: </b> {brand.address}
                      </p>

                      <p className="ml-3 text-white">
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
                    <h5 className="h5text">Brand Admin Details</h5>
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

                    <h5 className="h5text"> Brand Details</h5>
                    <hr />
                    <div className="row">
                      <div className="form-group input-group-sm col-sm-6">
                        <label htmlFor="brandName" className="h5text small">
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
                        <label htmlFor="address" className="h5text small">
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
                          className="btn-sm btn-warning h5text col-sm-12"
                        >
                          Change Email
                        </button>
                      </div>

                      <div className="col-sm-3">
                        <button
                          data-toggle="collapse"
                          data-target="#changePassword"
                          className="btn-sm btn-warning h5text col-sm-12"
                        >
                          Change Password
                        </button>
                      </div>
                      <div className="col-sm-3">
                        <button
                          data-toggle="collapse"
                          data-target="#changeBrandEmail"
                          className="btn-sm btn-warning h5text col-sm-12"
                        >
                          Change Brand Email
                        </button>
                      </div>
                      <div className="col-sm-3">
                        <button
                          data-toggle="collapse"
                          data-target="#deleteAccount"
                          className="btn-sm btn-danger h5text col-sm-12"
                        >
                          Delete Account
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
                    <div className="collapse" id="changeBrandEmail">
                      <div className="row pt-3">
                        <div className="form-group input-group-sm col-sm-6">
                          <label
                            htmlFor="brandEmailInput"
                            className="h5text small"
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
                            className="h5text small"
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
                      <p className="h5text text-center">
                        <b>
                          This action cannot be undone! If You delete your
                          account, you will delete the brand and all the brand
                          products!
                        </b>
                      </p>
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={this.deleteAccount}
                        >
                          Delete Account
                        </button>
                      </div>
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

  showAlert(type, message, headline) {
    this.props.showAlert(type, message, headline);
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
    //console.log(this.state.user);
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
            <Panel
              user={user}
              brand={brand}
              showAlert={this.showAlert}
              history={this.props.history}
            />
          )}
        </div>
      </div>
    );
  }
}

export default BrandProfile;
