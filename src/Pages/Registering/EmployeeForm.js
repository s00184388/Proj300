import React, { Component } from "react";
import "../Registering/EmployeeForm.css";
import FirebaseServices from "../../firebase/services";
import firebase from "../../firebase/firebase";
import  InputField from  '../Registering/InputFields'
import Radio from "../Registering/Checkboxes";
import { Link } from "react-router-dom";

const fs = new FirebaseServices();

export class EmployeeForm extends Component {
    constructor(props){
      super(props);   
      this.state = {
        fields: {},
        errors:{},
        //employee details
        selectedOption:'employee',
        coins:0,
        points:0,
        companyID:'',
        deviceID:'',
        role:'employee',
        //company
        companyName:'',
        companyAddress:'',
        companyPhoneNumber:'',
        companyEmail:'companyAdmin@gmail.com',
        companyPicture:'http://imgur.com',
        //
        brandName:'',
        brandAddress:'',
        brandPhoneNumber:'',
        brandEmail:'brandAdmin@gmail.com',
        brandPicture:'http://imgur.com',
        brandDescription:'Product Description',
        //validation errors
        authError:'',
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    };

    //validation function. Returns if the form is valid or not, 
    //stores the errors for each field in the state
    validate=()=>{
      //each field from the form is stored in the  state
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;

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

      if (!fields["email"]) {
        formIsValid = false;
        errors["email"] = "*Please enter your email-ID.";
      }

      if (!fields["pwd1"]) {
        formIsValid = false;
        errors["pwd1"] = "*Please enter your password.";
      }

      if (!fields["pwd2"]) {
        formIsValid = false;
        errors["pwd2"] = "*Please enter your password.";
      }

      if(fields["pwd1"]!==fields["pwd2"]){
        formIsValid = false;
          errors["pwd1"] = "*Passwords don't match.";
          errors["pwd2"] = "*Passwords don't match.";
      }
      
      this.setState({
        errors: errors
      });
      return formIsValid===true;
    }

    handleChange = e => {
      let fields = this.state.fields;
     // let newState = {};
      fields[e.target.name] = e.target.value;
      this.setState(fields);
      console.log(this.state.fields);
    };

    createAuthUser=()=>{
      firebase.auth().createUserWithEmailAndPassword(this.state.fields.email, this.state.fields.pwd1)
          .then((user) => {
            this.props.history.push('/');
            this.props.role=this.state.role;
          })
          .catch((err) => {
            this.setState({ authError: err.message });
            return false;
          });
    }


    handleOptionChange = changeEvent => {
      this.setState({
        selectedOption: changeEvent.target.value,
        role:changeEvent.target.value
        });
      console.log(changeEvent.target.value)
    };
  
    handleSubmit=e=>{
      e.preventDefault();
     console.log(this.state.fields);
      
     if(this.validate())
      {
        let fields = {};
          fields["firstName"] =this.state.fields.firstName;
          fields["lastName"] = this.state.fields.lastName;
          fields["email"] = this.state.fields.email;
          fields["pwd1"] =this.state.fields.pwd1;
          fields["pwd2"] =this.state.fields.pwd2;
          //this.setState({fields}, () => console.log(this.state.fields))
          alert("Form submitted");
          console.log('working');
         
          if(this.state.role==='employee'){
            fs.getCompanyByName(this.state.companyName)
            .then(company=>{
              let user = {
                firstName:fields["firstName"],
                lastName: fields["lastName"],
                email: fields["email"],
                coins:0,
                companyID:company.key,
                deviceID:this.state.deviceID,
                points:0,
                role:this.state.role
            }
            if(this.createAuthUser()===true)
            {
              fs.createUser(user);
            }
            })
            .catch((err)=>{
              this.setState({error:err}); 
              alert(this.state.error);
            });
        }
        else
        if(this.state.role==='companyAdmin'){
          let user = {
            firstName:this.state.firstName,
            lastName: this.state.lastName,
            email:this.state.email,
            role:this.state.role
          }
          fs.createUser(user).then(adminUserID=>{
            let company={
            name:this.state.companyName,
            address:this.state.companyAddress,
            phoneNumber:this.state.companyPhoneNumber,
            email:this.state.companyEmail,
            picture:this.state.companyPicture,
            adminUserID:adminUserID
            }
            fs.createCompany(company);
            this.createAuthUser();
          })
          .catch(err=>console.log(err));
        }
        else   
        if(this.state.role==='brandAdmin'){ 
          let user = {
            firstName:this.state.firstName,
            lastName: this.state.lastName,
            email:this.state.email,
            role:this.state.role
          }
          //
          fs.createUser(user).then(adminUserID=>{
              let brand={
                name:this.state.brandName,
                address:this.state.brandAddress,
                phoneNumber:this.state.brandPhoneNumber,
                email:this.state.brandEmail,
                picture:this.state.brandPicture,
                description:this.state.brandDescription,
                adminUserID:adminUserID
              }
            fs.createBrand(brand);
            this.createAuthUser();
            })
            .catch(err=>console.log(err));
        }
      }
  }
    render(){
        const companies = ['Overstock', 'Kudos Health', 'DHL', 'Continental'];
        const options = companies.map(opt =>
            <option key={opt}>{opt}</option>)
        const{firstName,lastName,email,pwd1,pwd2}=this.state.fields;
        const {companyAddress,companyName,companyPhoneNumber,role,brandAddress,brandPhoneNumber,brandName} = this.state;
        //employee selection
     return( 
          <div className="container">
            <div className="card col-lg-6 centered registerCard">
                <div className="card-block">
                  <div className="card-title text-center text-white pt-2">
                      <h4>Register</h4>
                      <hr></hr>
                          <div className="container">
                            <div className='row'>
                                <Radio name='employee' value='employee' label='Employee' checked={this.state.selectedOption === "employee"} onChange={this.handleOptionChange}></Radio>
                                <Radio name='company' value='companyAdmin' label='Company' checked={this.state.selectedOption === "companyAdmin"} onChange={this.handleOptionChange}></Radio>
                                <Radio name='brand' value='brandAdmin' label='Brand' checked={this.state.selectedOption === "brandAdmin"} onChange={this.handleOptionChange}></Radio>
                            </div>
                            <hr></hr>
                            <p className='text-white'>User Data</p>
                          </div>
                          <div className='card-body p-0'>
                            {role==="employee" ? 
                            <div className='container'>
                            <form onSubmit={this.handleSubmit}>
                                <div className='row'>
                                  <InputField name='firstName' type='text' placeholder='First name' value={firstName || ''} onChange={this.handleChange} error={this.state.errors.firstName}></InputField>
                                  <InputField name='lastName' type='text' placeholder='Last name' value={lastName || ''} onChange={this.handleChange} error={this.state.errors.lastName}></InputField>
                              </div>
                              <div className='row'>
                                <InputField name='email' type='text' placeholder='Email' value={email || ''} onChange={this.handleChange} error={this.state.errors.email}></InputField>
                                <div className="col-sm-6">
                                  <div className="form-group input-group-sm">
                                    <select id="companyList" name="companyName" className="form-control input-group-sm" defaultValue="" onChange={this.handleChange}>
                                      <option value="" disabled hidden>Select a Company</option>
                                      {options}
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className='row'>
                                <InputField name='pwd1' type='password' placeholder='Password' value={pwd1 || ''} onChange={this.handleChange} error={this.state.errors.pwd1}></InputField>
                                <InputField name='pwd2' type='password' placeholder='Confirm Password' value={pwd2 || ''} onChange={this.handleChange} error={this.state.errors.pwd2}></InputField>
                              </div>
                              <div className='row mx-auto pt-2'>
                                <div className='col-lg-4'>
                                  <button className="btn btn-warning btn-sm col-lg-12  text-white btn-sm" id="formSubmit" type="submit">
                                    Submit
                                  </button>
                                </div>
                                <div className='col-lg-4'>
                                  <p className='text-center col-lg-12'>OR</p>
                                </div>
                                <div className='col-lg-4'>
                                  <Link to='/login' className='btn btn-warning btn-sm text-white col-lg-12'>Login</Link>
                                </div>
                              </div>
                            </form>
                          </div> :
                          (role==="brandAdmin" ?
                          <div className='container'>
                       <form onSubmit={this.handleSubmit}>
                         <div className="row">
                                <InputField name='firstName' type='text' placeholder='First name' value={firstName} onChange={this.handleChange}></InputField>
                                <InputField name='lastName' type='text' placeholder='Last name' value={lastName} onChange={this.handleChange}></InputField>
                         </div>
                         <div className='row'>
                           <InputField name='email' type='text' placeholder='Personal Email' value={email} onChange={this.handleChange}></InputField>
                           <InputField name='brandName' type='text' placeholder='Brand Name' value={brandName} onChange={this.handleChange}></InputField>
                         </div>
                         <div className='row'>
                           <InputField name='brandPhoneNumber' type='text' placeholder='Phone Number' value={brandPhoneNumber} onChange={this.handleChange}></InputField>
                           <InputField name='brandAddress'type='text' placeholder='Brand Adress' value={brandAddress} onChange={this.handleChange}></InputField>
                         </div>
                         <div className='row'>
                           <InputField name='pwd1' type='password' placeholder='Password' value={this.state.pwd1} onChange={this.handleChange}></InputField>
                           <InputField name='pwd2' type='password' placeholder='Confirm Password' value={this.state.pwd2} onChange={this.handleChange}></InputField>
                         </div>
                         <div className='row mx-auto pt-2'>
                           <div className='col-lg-4'>
                             <button className="btn btn-warning btn-sm col-lg-12  text-white btn-sm" id="formSubmit" type="submit" onClick={this.handleSubmit}>
                               Submit
                            </button>
                           </div>
                           <div className='col-lg-4'>
                             <p className='text-center col-lg-12'>OR</p>
                           </div>
                           <div className='col-lg-4'>
                             <Link to='/login' className='btn btn-warning btn-sm text-white col-lg-12'>Login</Link>
                           </div>
                         </div>
                       </form>
                     </div> : <div className='container'>
                              <form onSubmit={this.handleSubmit}>
                                <div className="row">
                                <InputField name='firstName' type='text' placeholder='First name' value={firstName} onChange={this.handleChange}></InputField>
                                <InputField name='lastName' type='text' placeholder='Last name' value={lastName} onChange={this.handleChange}></InputField>
                                </div>
                                <div className='row'>
                                  <InputField name='email' type='text' placeholder='User Email' value={email} onChange={this.handleChange}></InputField>
                                  <InputField name='companyName' type='text' placeholder='Company Name' value={companyName} onChange={this.handleChange}></InputField>
                                </div>
                                <div className='row'>
                                  <InputField name='companyPhoneNumber' type='text' placeholder='Company phone number' value={companyPhoneNumber} onChange={this.handleChange}></InputField>
                                  <InputField name='companyAddress' type='text' placeholder='Company Adress' value={companyAddress} onChange={this.handleChange}></InputField>
                                </div>
                                <div className='row'>
                                  <InputField name='pwd1'  type='password' placeholder='Password' value={this.state.pwd1} onChange={this.handleChange}></InputField>
                                  <InputField name='pwd2' type='password' placeholder='Confirm Password' value={this.state.pwd2} onChange={this.handleChange}></InputField>
                                </div>
                                <div className='row mx-auto pt-2'>
                                  <div className='col-lg-4'>
                                    <button className="btn btn-warning btn-sm col-lg-12  text-white btn-sm" id="formSubmit" type="submit" onClick={this.handleSubmit}>
                                      Submit
                                  </button>
                                  </div>
                                  <div className='col-lg-4'>
                                    <p className='text-center col-lg-12'>OR</p>
                                  </div>
                                  <div className='col-lg-4'>
                                    <Link to='/login' className='btn btn-warning btn-sm text-white col-lg-12'>Login</Link>
                                  </div>
                                </div>
                              </form>
                            </div>)} 
                          </div>
                      </div>
                  </div>
                </div>
              </div>
        )
    }
}

export default EmployeeForm;