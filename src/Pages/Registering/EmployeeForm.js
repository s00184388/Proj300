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

      if (typeof fields["email"] !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(fields["email"])) {
          formIsValid = false;
          errors["email"] = "*Please enter valid email-ID.";
        }
      }

      //for company email
      if (!fields["companyEmail"]) {
        formIsValid = false;
        errors["companyEmail"] = "*Please enter company's email.";
      }

      if (typeof fields["companyEmail"] !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(fields["companyEmail"])) {
          formIsValid = false;
          errors["companyEmail"] = "*Please enter valid email";
        }
      }

      if (!fields["companyName"]) {
        formIsValid = false;
        errors["companyName"] = "*Please enter Company's name.";
      }

      if (!fields["companyAddress"]) {
        formIsValid = false;
        errors["companyAddress"] = "*Please enter Company's adress.";
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
    };

    createAuthUser=()=>{
      var err='';
      console.log(this.state.fields);
      firebase.auth().createUserWithEmailAndPassword(this.state.fields.email, this.state.fields.pwd1)
          .then((user) => {
            this.props.history.push('/');
            //this.props.role=this.state.role;
          }).catch((error) => {
            this.err=error;
            console.log(this.err);
            //this.setState({ authError: error });
          });          
      
      if(err!=='' || undefined){
        return false;
      }
      else return true;
    }


    handleOptionChange = changeEvent => {
      this.setState({
        //fields:'',errors:'',
        selectedOption: changeEvent.target.value,
        role:changeEvent.target.value
        });
      console.log(changeEvent.target.value)
    };
  
    handleSubmit=e=>{
      e.preventDefault();   
     if(this.validate())
      {
        let fields = {};
          /*fields["firstName"] =this.state.fields.firstName;
          fields["lastName"] = this.state.fields.lastName;
          fields["email"] = this.state.fields.email;
          fields["pwd1"] =this.state.fields.pwd1;
          fields["pwd2"] =this.state.fields.pwd2;*/
              fields["firstName"] =this.state.fields.firstName;
              fields["lastName"] = this.state.fields.lastName;
              fields["email"] = this.state.fields.email;
              fields["pwd1"] =this.state.fields.pwd1;
              fields["pwd2"] =this.state.fields.pwd2;
              fields["companyName"]=this.state.fields.companyName;
              fields["companyEmail"]=this.state.fields.companyEmail;
              fields["companyAdress"]=this.state.fields.companyAddress;
              fields["companyPhoneNumber"]=this.state.fields.companyPhoneNumber;
                 
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
            console.log(this.createAuthUser());
            if(this.createAuthUser()!==false)
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
        if(this.state.role==='companyAdmin')
        {
          let user = {
              firstName:fields["firstName"],
              lastName: fields["lastName"],
              email:fields["email"],
              role:this.state.role
          }          
          console.log('Step1.User data for company inserted in db');
          
          fs.createUser(user).then(adminUserID=>{
              let company={
                name:fields["companyName"],
                address:fields["companyAdress"],
                //phoneNumber:fields["companyPhoneNumber"],
                email:fields["companyEmail"],
                adminUserID:adminUserID
              }
              fs.createCompany(company);
              this.createAuthUser();
              console.log('Step2.Company created');
            })
            .catch((err)=>{
              this.setState({error:err}); 
              alert(this.state.error);
            });
        }
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
    render(){
        const companies = ['Overstock', 'Kudos Health', 'DHL', 'Continental'];
        const options = companies.map(opt =>
            <option key={opt}>{opt}</option>)
        const{firstName,lastName,email,pwd1,pwd2}=this.state.fields;
        const{role}=this.state;
        const {companyEmail,brandPhoneNumber,companyAddress,companyName,brandAddress,brandName} = this.state.fields;
        //employee selection
     return( 
          <div className="container pt-5">
              <div className='form-register py-3'>
                <div className='text-white text-center pt-2'>
                    <h4 className='text-white'>Sign Up as</h4>
                    <p className='pt-2'>You can sign up now on KudosHealth. It's what all fitness lovers are doing nowadays!</p>
                </div>        
                <div className='row pt-4 text-white font-weight-bold'>
                    <div className='col-sm-4 '>
                      <div className='d-flex justify-content-start'>
                          <Radio name='employee' value='employee' label='Employee' checked={this.state.selectedOption === "employee"} onChange={this.handleOptionChange}></Radio>
                      </div>
                    </div>
                    <div className='col-sm-4'>
                    <div className='d-flex justify-content-center mr-5'>
                       <Radio name='company' value='companyAdmin' label='Company' checked={this.state.selectedOption === "companyAdmin"} onChange={this.handleOptionChange}></Radio>
                     </div> 
                    </div>
                    <div className='col-sm-3'>
                        <div className='d-flex justify-content-end'>
                          <Radio name='brand' value='brandAdmin' label='Brand' checked={this.state.selectedOption === "brandAdmin"} onChange={this.handleOptionChange}></Radio>
                        </div>
                    </div>             
                </div>
                <hr></hr>                     
                <div className='card-body p-0'>
                  {role==="employee" ? 
                      <div className='container'>
                          <h6 className='text-white'>Employee User Data</h6>
                            <form className='pt-2' onSubmit={this.handleSubmit}>
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
                                  
                                </div>
                                <div className='col-lg-4'>
                                  <Link to='/login' className='btn btn-warning btn-sm text-white col-lg-12'>Back to Login</Link>
                                </div>
                              </div>
                            </form>
                          </div> :
                          (role==="brandAdmin" ?
                          <div className='container'>
                       <form onSubmit={this.handleSubmit}>
                         <div className="row">
                                <InputField name='firstName' type='text' placeholder='First name' value={firstName || ''} onChange={this.handleChange}></InputField>
                                <InputField name='lastName' type='text' placeholder='Last name' value={lastName || ''} onChange={this.handleChange}></InputField>
                         </div>
                         <div className='row'>
                           <InputField name='email' type='text' placeholder='Personal Email' value={email || ''} onChange={this.handleChange}></InputField>
                           <InputField name='brandName' type='text' placeholder='Brand Name' value={brandName} onChange={this.handleChange}></InputField>
                         </div>
                         <div className='row'>
                           <InputField name='brandPhoneNumber' type='text' placeholder='Phone Number' value={brandPhoneNumber} onChange={this.handleChange}></InputField>
                           <InputField name='brandAddress'type='text' placeholder='Brand Adress' value={brandAddress} onChange={this.handleChange}></InputField>
                         </div>
                         <div className='row'>
                           <InputField name='pwd1' type='password' placeholder='Password' value={pwd1} onChange={this.handleChange}></InputField>
                           <InputField name='pwd2' type='password' placeholder='Confirm Password' value={pwd2} onChange={this.handleChange}></InputField>
                         </div>
                         <div className='row mx-auto pt-2'>
                           <div className='col-lg-4'>
                             <button className="btn btn-warning btn-sm col-lg-12  text-white btn-sm" id="formSubmit" type="submit" onClick={this.handleSubmit}>
                               Submit
                            </button>
                           </div>
                           <div className='col-lg-4'>
                            
                           </div>
                           <div className='col-lg-4'>
                             <Link to='/login' className='btn btn-warning btn-sm text-white col-lg-12'>Back to Login</Link>
                           </div>
                         </div>
                       </form>
                     </div> : <div className='container'>
                              <h6 className='text-white'>User Data</h6>
                              <form onSubmit={this.handleSubmit}>
                                <div className="row">
                                <InputField name='firstName' type='text' placeholder='First name' value={firstName || ''} onChange={this.handleChange} error={this.state.errors.firstName}></InputField>
                                <InputField name='lastName' type='text' placeholder='Last name' value={lastName || ''} onChange={this.handleChange} error={this.state.errors.lastName}></InputField>
                                </div>
                                <div className='row'>
                                  <InputField name='email' type='text' placeholder='User Email' value={email || ''} onChange={this.handleChange} error={this.state.errors.email}></InputField>
                                  <InputField name='companyName' type='text' placeholder='Company Name' value={companyName || ''} onChange={this.handleChange} error={this.state.errors.companyName}></InputField>
                                </div>
                                <hr></hr>
                                <h6 className='text-white'>Company Details</h6>
                                <div className='row'>
                                  <InputField name='companyEmail' type='text' placeholder='Company email' value={companyEmail || ''} onChange={this.handleChange} error={this.state.errors.companyEmail}></InputField>
                                  <InputField name='companyAddress' type='text' placeholder='Company Adress' value={companyAddress || ''} onChange={this.handleChange} error={this.state.errors.companyAddress}></InputField>
                                </div>
                                <div className='row'>
                                  <InputField name='pwd1'  type='password' placeholder='Password' value={pwd1 || ''} onChange={this.handleChange} error={this.state.errors.pwd1}></InputField>
                                  <InputField name='pwd2' type='password' placeholder='Confirm Password' value={pwd2 || ''} onChange={this.handleChange} error={this.state.errors.pwd2}></InputField>
                                </div>
                                <div className='row mx-auto pt-2'>
                                  <div className='col-lg-4'>
                                    <button className="btn btn-warning btn-sm col-lg-12  text-white btn-sm" id="formSubmit" type="submit" onClick={this.handleSubmit}>
                                      Submit
                                  </button>
                                  </div>
                                  <div className='col-lg-4'>
                                    
                                  </div>
                                  <div className='col-lg-4'>
                                    <Link to='/login' className='btn btn-warning btn-sm text-white col-lg-12'>Back to Login</Link>
                                  </div>
                                </div>
                              </form>
                            </div>)} 
                          </div>
                        </div>
                      </div>
        )
    }
}

export default EmployeeForm;