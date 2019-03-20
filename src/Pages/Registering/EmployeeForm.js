import React, { Component } from "react";
import "../Registering/EmployeeForm.css";
import FirebaseServices from "../../firebase/services";
import firebase from "../../firebase/firebase";
import InputField from "../Registering/InputFields";
import Radio from "../Registering/Checkboxes";
import { Link } from "react-router-dom";
import { firestore } from "firebase";
import ReactLoading from "react-loading";
import ReCAPTCHA from "react-google-recaptcha";

const fs = new FirebaseServices();

export class EmployeeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      created: false,
      emailSent: false,
      captcha: "",
      //employee details
      selectedOption: "employee",
      coins: 0,
      points: 0,
      companyID: "",
      deviceID: "",
      role: "employee",
      //company
      authError: "",
      companyError: "",
      companies: [],
      brands: [],
      fetchInProgress: false,
      showingAlert: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nameFree = this.nameFree.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.captchaCallback = this.captchaCallback.bind(this);
    this.subscriptions = [];
  }

  showAlert(type, message, headline) {
    this.props.showAlert(type, message, headline);
  }

  captchaCallback(value) {
    this.setState({ captcha: value });
  }

  //validation function. Returns if the form is valid or not,
  //stores the errors for each field in the state
  validate = () => {
    //each field from the form is stored in the  state
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    let captcha = this.state.captcha;

    if (!captcha) {
      formIsValid = false;
      errors["captcha"] = "*Please solve the CAPTCHA first.";
    }

    if (!fields["firstName"]) {
      formIsValid = false;
      errors["firstName"] = "*Please enter your first name.";
    }

    if (typeof fields["firstName"] !== "undefined") {
      if (!fields["firstName"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["firstName"] = "*Please enter alphabet characters only.";
      }
    }

    if (!fields["lastName"]) {
      formIsValid = false;
      errors["lastName"] = "*Please enter your last name.";
    }

    if (typeof fields["lastName"] !== "undefined") {
      if (!fields["lastName"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["lastName"] = "*Please enter alphabet characters only.";
      }
    }

    //regular expression for email validation
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );

    //general user mail
    if (!fields["email"] || !pattern.test(fields["email"])) {
      formIsValid = false;
      errors["email"] = "*Please enter a valid email.";
    }

    //for company email
    if (this.state.role === "companyAdmin") {
      if (!fields["companyEmail"] || !pattern.test(fields["companyEmail"])) {
        formIsValid = false;
        errors["companyEmail"] = "*Please enter a valid Company's email";
      }

      if (!fields["companyName"]) {
        formIsValid = false;
        errors["companyName"] = "*Please enter Company's name.";
      }

      if (!fields["companyAddress"]) {
        formIsValid = false;
        errors["companyAddress"] = "*Please enter Company's adress.";
      }
    } else if (this.state.role === "brandAdmin") {
      if (!fields["brandName"]) {
        formIsValid = false;
        errors["brandName"] = "*Please enter Brand's name.";
      }

      if (!fields["brandAddress"]) {
        formIsValid = false;
        errors["brandAddress"] = "*Please enter Brand's adress.";
      }

      if (!fields["brandEmail"] || !pattern.test(fields["brandEmail"])) {
        formIsValid = false;
        errors["brandEmail"] = "*Please enter a valid brand's email.";
      }
    }
    if (!fields["pwd1"]) {
      formIsValid = false;
      errors["pwd1"] = "*Please enter your password.";
    }

    if (!fields["pwd2"]) {
      formIsValid = false;
      errors["pwd2"] = "*Please enter your password.";
    }

    if (fields["pwd1"] !== fields["pwd2"]) {
      formIsValid = false;
      errors["pwd1"] = "*Passwords don't match.";
      errors["pwd2"] = "*Passwords don't match.";
    }

    this.setState({
      errors: errors
    });

    return formIsValid;
  };

  handleChange = e => {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState(fields);
  };

  getCompanyAndSendConfirmationEmail(employee) {
    this.setState({ fetchInProgress: true });
    this.subscriptions.push(
      fs.getCompany(employee.companyID).subscribe(comp => {
        if (comp.email) {
          var data = {
            company: {
              email: comp.email,
              name: comp.name,
              key: comp.key
            },
            employee: {
              firstName: employee.firstName,
              lastName: employee.lastName,
              key: employee.key,
              email: employee.email
            }
          };
          var url = `https://stravakudos.herokuapp.com/mail/sendConfirmationEmail`;
          fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
              "Content-Type": "application/json"
              // "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(data) // body data type must match "Content-Type" header
          })
            .then(() => {
              this.setState({ fetchInProgress: false });
            })
            .catch(err => {
              console.log(err);
              this.setState({ fetchInProgress: false });
            });
        }
      })
    );
  }

  createAuthUser = (user, company, brand) => {
    this.setState({ fetchInProgress: true });
    //console.log(this.state.fields);
    firebase
      .auth()
      .createUserWithEmailAndPassword(
        this.state.fields.email,
        this.state.fields.pwd1
      )
      .then(() => {
        //console.log("role for creating: " + this.state.role);
        if (this.state.role === "employee") {
          //console.log("creating employee");
          fs.createUser(user)
            .then(userKey => {
              var currentUser = firebase.auth().currentUser;
              user.key = userKey;
              this.getCompanyAndSendConfirmationEmail(user);
              currentUser
                .updateProfile({ displayName: user.firstName })
                .then(() => {
                  currentUser
                    .sendEmailVerification()
                    .then(() => {
                      user.key = userKey;
                      //this.getCompanyAndSendConfirmationEmail(user);
                      this.setState({ fetchInProgress: false });
                      this.showAlert(
                        "success",
                        "Your email verification has been sent. Please check your email as soon as possible!",
                        "Email Sent"
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
            });
        } else if (this.state.role === "companyAdmin") {
          //console.log("creating companyAdmin");
          var userID;
          fs.createUser(user)
            .then(adminUserID => {
              var currentUser = firebase.auth().currentUser;
              currentUser
                .updateProfile({ displayName: user.firstName })
                .then(() => {
                  currentUser
                    .sendEmailVerification()
                    .then(() => {
                      this.showAlert(
                        "success",
                        "Your email verification has been sent. Please verify your email as soon as possible!",
                        "Email Sent"
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
              userID = adminUserID;
              let comp = {
                name: company.name,
                address: company.address,
                email: company.email,
                adminUserID: adminUserID
              };
              fs.createCompany(comp)
                .then(compID => {
                  fs.usersCollection
                    .doc(userID)
                    .update({ companyID: compID })
                    .then(() => {})
                    .catch(err => console.log(err));
                  this.setState({ fetchInProgress: false });
                })
                .catch(err => {
                  console.log(err);
                  this.setState({ fetchInProgress: false });
                });
            })
            .catch(err => {
              this.setState({ err: err.message });
            });
        } else if (this.state.role === "brandAdmin") {
          //console.log("creating brandAdmin");
          let userID;
          fs.createUser(user)
            .then(adminUserID => {
              userID = adminUserID;
              let br = {
                name: brand.name,
                address: brand.address,
                email: brand.email,
                adminUserID: adminUserID
              };
              fs.createBrand(br).then(brID => {
                fs.usersCollection
                  .doc(userID)
                  .update({ brandID: brID })
                  .then(() => {
                    this.setState({ fetchInProgress: false });
                  })
                  .catch(err => {
                    console.log(err);
                    this.setState({ fetchInProgress: false });
                  });
              });
            })
            .catch(err => {
              this.setState({
                authError: err.message,
                showingAlert: true
              });
            });
        }
      })
      .catch(err => {
        this.setState({
          authError: err.message,
          fetchInProgress: false
        });
        this.showAlert(
          "warning",
          this.state.authError,
          "Something went wrong!"
        );
      });
  };

  handleOptionChange = changeEvent => {
    this.setState({
      //fields:'',errors:'',
      selectedOption: changeEvent.target.value,
      role: changeEvent.target.value
    });
    //console.log(changeEvent.target.value);
  };

  nameFree(name, role) {
    let found = false;
    //console.log("Comparing:" + name);
    if (role === "company") {
      this.state.companies.forEach(comp => {
        if (comp.name === name) {
          //console.log("found " + comp.name);
          found = true;
        }
      });
    } else if (role === "brand") {
      this.state.brands.forEach(br => {
        if (br.name === name) {
          found = true;
        }
      });
    }
    if (!found) return true;
    else return false;
  }

  handleSubmit = e => {
    e.preventDefault();
    let fields = {};
    fields["firstName"] = this.state.fields.firstName;
    fields["lastName"] = this.state.fields.lastName;
    fields["email"] = this.state.fields.email;
    fields["pwd1"] = this.state.fields.pwd1;
    fields["pwd2"] = this.state.fields.pwd2;
    //company fields
    fields["companyName"] = this.state.fields.companyName;
    fields["companyEmail"] = this.state.fields.companyEmail;
    fields["companyAdress"] = this.state.fields.companyAddress;
    //brand fields;
    fields["brandName"] = this.state.fields.brandName;
    fields["brandAddress"] = this.state.fields.brandAddress;
    fields["brandEmail"] = this.state.fields.brandEmail;
    //console.log(this.validate());

    if (this.validate()) {
      if (this.state.role === "employee") {
        fs.getCompanyByName(this.state.companyName)
          .then(company => {
            let user = {
              firstName: fields["firstName"],
              lastName: fields["lastName"],
              email: fields["email"],
              coins: 0,
              companyID: company.key,
              deviceID: this.state.deviceID,
              points: 0,
              role: this.state.role,
              created: firestore.Timestamp.fromDate(new Date()),
              approved: false
            };
            this.createAuthUser(user, null, null);
            setTimeout(() => {
              this.props.history.push("/");
            }, 3000);
          })
          .catch(err => {
            this.setState({ companyError: err.message }, () => {
              //console.log(this.state.companyError);
            });
          });
      } else if (this.state.role === "companyAdmin") {
        let user = {
          firstName: fields["firstName"],
          lastName: fields["lastName"],
          email: fields["email"],
          role: this.state.role,
          companyID: "",
          created: firestore.Timestamp.fromDate(new Date())
        };
        let company = {
          name: fields["companyName"],
          address: fields["companyAdress"],
          email: fields["companyEmail"]
        };
        if (this.nameFree(fields["companyName"], "company")) {
          this.createAuthUser(user, company, null);
          setTimeout(() => {
            this.props.history.push("/");
          }, 2000);
        } else {
          this.setState({
            companyError: "There is already a company with the same name!"
          });
        }

        //console.log(this.state.role);
      } else if (this.state.role === "brandAdmin") {
        let user = {
          firstName: fields["firstName"],
          lastName: fields["lastName"],
          email: fields["email"],
          role: this.state.role,
          brandID: "",
          created: firestore.Timestamp.fromDate(new Date())
        };
        let brand = {
          name: fields["brandName"],
          address: fields["brandAddress"],
          email: fields["brandEmail"]
        };

        if (this.nameFree(fields["brandName"], "brand")) {
          //console.log("Step1.User data for brand inserted in db");
          this.createAuthUser(user, null, brand);
          setTimeout(() => {
            this.props.history.push("/brandProfile");
          }, 3000);
        } else {
          this.setState({
            companyError: "There is already a brand with the same name!"
          });
        }
      }
    }
  };

  componentDidMount() {
    this.setState({ fetchInProgress: true });
    this.subscriptions.push(
      fs
        .getCompanies()
        .subscribe(companies =>
          this.setState({ companies: companies, fetchInProgress: false })
        )
    );
    this.subscriptions.push(
      fs
        .getBrands()
        .subscribe(brands =>
          this.setState({ brands: brands, fetchInProgress: false })
        )
    );
  }

  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }
  render() {
    const companyList = this.state.companies;
    const companies = [];
    companyList.forEach(comp => companies.push(comp.name));
    const options = companies.map(opt => <option key={opt}>{opt}</option>);
    const { firstName, lastName, email, pwd1, pwd2 } = this.state.fields;
    const { role } = this.state;
    const fetchInProgress = this.state.fetchInProgress;
    const {
      companyEmail,
      brandEmail,
      companyAddress,
      companyName,
      brandAddress,
      brandName
    } = this.state.fields;
    //employee selection
    return (
      <div
        className={
          fetchInProgress
            ? "container d-flex justify-content-center"
            : "container"
        }
      >
        {fetchInProgress ? (
          <ReactLoading
            type={"spinningBubbles"}
            color={"#fff"}
            height={400}
            width={200}
          />
        ) : (
          <div className="container pt-5">
            <div className="form-register py-3">
              <div className="text-white text-center pt-2">
                <h4 className="text-white">Sign Up as</h4>
                <p className="pt-2">
                  You can sign up now on KudosHealth. It's what all fitness
                  lovers are doing nowadays!
                </p>
              </div>
              <div className="row pt-4 text-white font-weight-bold">
                <div className="col-sm-4 ">
                  <div className="d-flex justify-content-start">
                    <Radio
                      name="employee"
                      value="employee"
                      label="Employee"
                      checked={this.state.selectedOption === "employee"}
                      onChange={this.handleOptionChange}
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="d-flex justify-content-center mr-5">
                    <Radio
                      name="company"
                      value="companyAdmin"
                      label="Company"
                      checked={this.state.selectedOption === "companyAdmin"}
                      onChange={this.handleOptionChange}
                    />
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="d-flex justify-content-end">
                    <Radio
                      name="brand"
                      value="brandAdmin"
                      label="Brand"
                      checked={this.state.selectedOption === "brandAdmin"}
                      onChange={this.handleOptionChange}
                    />
                  </div>
                </div>
              </div>
              <hr />
              <div className="card-body p-0">
                {role === "employee" ? (
                  <div className="container">
                    <h6 className="text-white">Employee User Data</h6>
                    <form className="pt-2" onSubmit={this.handleSubmit}>
                      <div className="row">
                        <InputField
                          name="firstName"
                          type="text"
                          placeholder="First name"
                          value={firstName || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.firstName}
                        />
                        <InputField
                          name="lastName"
                          type="text"
                          placeholder="Last name"
                          value={lastName || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.lastName}
                        />
                      </div>
                      <div className="row">
                        <InputField
                          name="email"
                          type="text"
                          placeholder="Email"
                          value={email || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.email}
                        />
                        <div className="col-sm-6">
                          <div className="form-group input-group-sm">
                            <select
                              id="companyList"
                              name="companyName"
                              className="form-control input-group-sm"
                              defaultValue=""
                              onChange={this.handleChange}
                            >
                              <option value="" disabled hidden>
                                Select a Company
                              </option>
                              {options}
                            </select>
                            <div className="small">
                              {this.state.companyError}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <InputField
                          name="pwd1"
                          type="password"
                          placeholder="Password"
                          value={pwd1 || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.pwd1}
                        />
                        <InputField
                          name="pwd2"
                          type="password"
                          placeholder="Confirm Password"
                          value={pwd2 || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.pwd2}
                        />
                      </div>
                      <div className="row mx-auto pt-2">
                        <ReCAPTCHA
                          sitekey="6Lexc5YUAAAAAMBCUmoQAu7bflxKLSxUr1D50Owg"
                          onChange={this.captchaCallback}
                        />
                        <div className="small">{this.state.errors.captcha}</div>
                      </div>
                      <div className="row mx-auto pt-2">
                        <div className="col-lg-4">
                          <button
                            className="btn btn-warning btn-sm col-lg-12  text-white btn-sm"
                            id="formSubmit"
                            type="submit"
                          >
                            Submit
                          </button>
                        </div>
                        <div className="col-lg-4" />
                        <div className="col-lg-4">
                          <Link
                            to="/login"
                            className="btn btn-warning btn-sm text-white col-lg-12"
                          >
                            Back to Login
                          </Link>
                        </div>
                      </div>
                    </form>
                  </div>
                ) : role === "brandAdmin" ? (
                  <div className="container">
                    <h6 className="text-white">User Data</h6>
                    <form onSubmit={this.handleSubmit}>
                      <div className="row">
                        <InputField
                          name="firstName"
                          type="text"
                          placeholder="First name"
                          value={firstName || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.firstName}
                        />
                        <InputField
                          name="lastName"
                          type="text"
                          placeholder="Last name"
                          value={lastName || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.lastName}
                        />
                      </div>
                      <div className="row">
                        <InputField
                          name="email"
                          type="text"
                          placeholder="Personal Email"
                          value={email || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.email}
                        />
                        <InputField
                          name="brandName"
                          type="text"
                          placeholder="Brand Name"
                          value={brandName || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.brandName}
                        />
                      </div>
                      <h6 className="text-white">Brand Details</h6>
                      <div className="row">
                        <InputField
                          name="brandEmail"
                          type="text"
                          placeholder="Brand Email"
                          value={brandEmail || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.brandEmail}
                        />
                        <InputField
                          name="brandAddress"
                          type="text"
                          placeholder="Brand Address"
                          value={brandAddress || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.brandAddress}
                        />
                      </div>
                      <div className="row">
                        <InputField
                          name="pwd1"
                          type="password"
                          placeholder="Password"
                          value={pwd1 || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.pwd1}
                        />
                        <InputField
                          name="pwd2"
                          type="password"
                          placeholder="Confirm Password"
                          value={pwd2 || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.pwd2}
                        />
                      </div>
                      <hr />
                      <div className="row mx-auto pt-2">
                        <ReCAPTCHA
                          sitekey="6Lexc5YUAAAAAMBCUmoQAu7bflxKLSxUr1D50Owg"
                          onChange={this.captchaCallback}
                        />
                        <div className="small">{this.state.errors.captcha}</div>
                      </div>
                      <div className="row mx-auto pt-2">
                        <div className="col-lg-4">
                          <button
                            className="btn btn-warning btn-sm col-lg-12  text-white btn-sm"
                            id="formSubmit"
                            type="submit"
                            onClick={this.handleSubmit}
                          >
                            Submit
                          </button>
                        </div>
                        <div className="col-lg-4" />
                        <div className="col-lg-4">
                          <Link
                            to="/login"
                            className="btn btn-warning btn-sm text-white col-lg-12"
                          >
                            Back to Login
                          </Link>
                        </div>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="container">
                    <h6 className="text-white">User Data</h6>
                    <form onSubmit={this.handleSubmit}>
                      <div className="row">
                        <InputField
                          name="firstName"
                          type="text"
                          placeholder="First name"
                          value={firstName || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.firstName}
                        />
                        <InputField
                          name="lastName"
                          type="text"
                          placeholder="Last name"
                          value={lastName || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.lastName}
                        />
                      </div>
                      <div className="row">
                        <InputField
                          name="email"
                          type="text"
                          placeholder="User Email"
                          value={email || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.email}
                        />
                        <InputField
                          name="companyName"
                          type="text"
                          placeholder="Company Name"
                          value={companyName || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.companyName}
                        />
                      </div>
                      <h6 className="text-white">Company Details</h6>
                      <div className="row">
                        <InputField
                          name="companyEmail"
                          type="text"
                          placeholder="Company email"
                          value={companyEmail || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.companyEmail}
                        />
                        <InputField
                          name="companyAddress"
                          type="text"
                          placeholder="Company Adress"
                          value={companyAddress || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.companyAddress}
                        />
                      </div>
                      <div className="row">
                        <InputField
                          name="pwd1"
                          type="password"
                          placeholder="Password"
                          value={pwd1 || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.pwd1}
                        />
                        <InputField
                          name="pwd2"
                          type="password"
                          placeholder="Confirm Password"
                          value={pwd2 || ""}
                          onChange={this.handleChange}
                          error={this.state.errors.pwd2}
                        />
                      </div>
                      <hr />
                      <div className="row mx-auto pt-2">
                        <ReCAPTCHA
                          sitekey="6Lexc5YUAAAAAMBCUmoQAu7bflxKLSxUr1D50Owg"
                          onChange={this.captchaCallback}
                        />
                        <div className="small">{this.state.errors.captcha}</div>
                      </div>
                      <div className="row mx-auto pt-2">
                        <div className="col-lg-4">
                          <button
                            className="btn btn-warning btn-sm col-lg-12  text-white btn-sm"
                            id="formSubmit"
                            type="submit"
                            onClick={this.handleSubmit}
                          >
                            Submit
                          </button>
                        </div>
                        <div className="col-lg-4" />
                        <div className="col-lg-4">
                          <Link
                            to="/login"
                            className="btn btn-warning btn-sm text-white col-lg-12"
                          >
                            Back to Login
                          </Link>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default EmployeeForm;
