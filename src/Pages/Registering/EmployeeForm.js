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
        //employee details
        selectedOption:'employee',
        firstName:'',
        lastName:'',
        email:'',
        coins:0,
        points:0,
        companyID:'',
        deviceID:'',
        role:'employee',
        pwd1:'',
        pwd2:'',
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
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    };

    handleChange = e => {
      let newState = {};
      newState[e.target.name] = e.target.value;
      this.setState(newState);
    };


    handleOptionChange = changeEvent => {
      this.setState({
        selectedOption: changeEvent.target.value,
        role:changeEvent.target.value
        });
      console.log(changeEvent.target.value)
    };
  
    handleSubmit=e=>{
      console.log(this.state);
      e.preventDefault(); 
      
      if(this.state.role==='employee'){
        fs.getCompanyByName(this.state.companyName)
        .then(company=>{
          let user = {
            firstName:this.state.firstName,
            lastName: this.state.lastName,
            email:this.state.email,
            coins:0,
            companyID:company.key,
            deviceID:this.state.deviceID,
            points:0,
            role:this.state.role
        }
        console.log('works');
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.pwd1)
          .then((user) => {
            sessionStorage.setItem('userKey', user.key);
            this.props.history.push('/');
            this.props.role=this.state.role;
          })
          .catch((error) => {
            this.setState({ error: error });
          }); 
        
        fs.createUser(user);

        console.log(user);
        })
        .catch(err=>console.log(err));
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
        })
        .catch(err=>console.log(err));
    }
  }
    render(){
        const companies = ['Overstock', 'Kudos Health', 'DHL', 'Continental'];
        const options = companies.map(opt =>
            <option key={opt}>{opt}</option>)
        const {firstName,lastName,email,companyAddress,companyName,companyPhoneNumber,role,brandAddress,brandPhoneNumber,brandName} = this.state;
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
                                <InputField name='firstName' type='text' placeholder='First name' value={firstName} onChange={this.handleChange}></InputField>
                                <InputField name='lastName' type='text' placeholder='Last name' value={lastName} onChange={this.handleChange}></InputField>
                              </div>
                              <div className='row'>
                                <InputField name='email' type='text' placeholder='Email' value={email} onChange={this.handleChange}></InputField>
                                <div className="col-lg-6">
                                  <div className="form-group input-group-sm">
                                    <select id="companyList" name="companyName" className="form-control input-group-sm" defaultValue="" onChange={this.handleChange}>
                                      <option value="" disabled hidden>Select a Company</option>
                                      {options}
                                    </select>
                                  </div>
                                </div>
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