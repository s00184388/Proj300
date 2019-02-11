import React, { Component } from "react";
import './CssPages/UserProfile.css'


class Sidepage extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
            <div className="col-sm-3">
            <ul className="list-group-sm">
                <li className="list-group-item text-center">Profile</li>
                <li className="list-group-item text-left"><span className="pull-left h6"><strong>Joined:  </strong></span>02.01.2019</li>
                <li className="list-group-item text-left"><span class="pull-left h6"><strong>Coins: </strong></span>{this.props.coins} K</li>
                <li className="list-group-item text-left"><span class="pull-left h6"><strong>Role:   </strong></span>{this.props.role}</li>
                <li className="list-group-item text-left"><span class="pull-left h6"><strong>Active today:  </strong></span>Yes</li>
                <li className="list-group-item text-left"><span class="pull-left h6"><strong>Device Connected:   </strong></span>No</li>
            </ul>
        </div>
    )
  }
}

export class HeaderProfile extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div className='container p-2'>
        
        <hr></hr>
      </div>

    )
  }
} 

export class Panel extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div class="col-sm-8">
          <section id="tabs" className="project-tab">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <nav>
                            <div className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                <a className="nav-item nav-link active links text-grey h6" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Home</a>
                                <a className="nav-item nav-link links text-grey h6" id="nav-device-tab" data-toggle="tab" href="#nav-device" role="tab" aria-controls="nav-device" aria-selected="false">Device</a>
                                <a className="nav-item nav-link links text-grey h6" id="nav-settings-tab" data-toggle="tab" href="#nav-settings" role="tab" aria-controls="nav-settings" aria-selected="false">Settings</a>
                            </div>
                        </nav>
                        <hr></hr>
                        <div className="tab-content" id="nav-tabContent">
                            <div className="tab-pane active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                              <h3 className='p-3 text-white text-center'>User Details</h3>  
                            <div className='row'>
                                <div className='col-lg-4'>
                                  <img src={require("../Images/user.png")}
                                    height="150"
                                    weight="150"
                                      className="img-circle img-responsive" 
                                        />      
                                </div>
                                <div className="col-lg-8">
                                  <h5 className='p-3 text-white'>{this.props.name}</h5> 
                                  <p className='ml-3'><b>Email:</b> {this.props.email}</p>
                                  <p className='ml-3'>Company:</p>
                                  <p className='ml-3'>Conected Device:</p>
                                </div>
                              </div>
                            </div>
                            <div class="tab-pane " id="nav-device" role="tabpanel" aria-labelledby="nav-device-tab">
                                <h3 className='p-3 text-white text-center'>Connect your Device</h3> 
                                <h6 className='p-3 text-white text-center'>Please connect you device before starting any activity.</h6>
                                <button className='btn btn-sm btn-warning col-lg-6'>Strava</button>
                                <button className='btn btn-sm btn-warning col-lg-6'>Fitbit</button>
                            </div>
                            
                            <div class="tab-pane" id="nav-settings" role="tabpanel" aria-labelledby="nav-settings-tab">
                              <h3 className='p-3 text-white text-center'>Edit User Details</h3> 
                              <div className='row'>
                                  <div className='form-group input-group-sm col-sm-6'>
                                    <input
                                        className="form-control"
                                        name='firstName'
                                        type='text'
                                        onChange=' '
                                        value={this.props.firstName}
                                        />
                                  </div>
                                  <div className='form-group input-group-sm col-sm-6'>
                                    <input
                                        className="form-control"
                                        name='lastName'
                                        type='text'
                                        onChange=''
                                        value={this.props.lastName}
                                        />
                                  </div>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>       
      </div>
    )
  }
}

export class Profile extends Component{
  constructor(props){
    super(props);
    
    this.state={
      user:props.user
    }
  }
  render(){
    const name=this.state.user.firstName+' '+this.state.user.lastName;
    const email=this.state.user.email;
    const coins=this.state.user.coins;
    const role=this.state.user.role;
    const firstName=this.state.user.firstName;
    const lastName=this.state.user.lastName;
    console.log(this.state.user);
    return(
      <div>
        <div className='row'>
            <Sidepage coins={coins}></Sidepage>
            <Panel name={name} email={email} role={role} firstName={firstName} lastName={lastName} ></Panel>
        </div>
      </div>
    )
  }
}

export default Profile;