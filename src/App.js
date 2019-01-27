//modules
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import firebase from "firebase";


//styling
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faBars,
  faGift,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import * as serviceWorker from './serviceWorker';
import FirebaseServices from './firebase/services';

//components

import { Home } from "./Pages/Home";
import { Admin } from "./Pages/Admin";
import { CompanyDashboard } from "./Pages/CompanyDashboard";
import { BrandDashboard } from "./Pages/BrandDashboard";
import { Rewards } from "./Pages/Rewards";
import { Navbar } from "./Components/Navbar";
import { Wishlist } from "./Pages/Wishlist";
import {Login } from "./Pages/Login";
import EmployeeForm from "./Pages/Registering/EmployeeForm";

const firebaseServices = new FirebaseServices();


library.add(faHome, faBars, faGift, faTrash);

class App extends Component {
  constructor(props){
    super(props);
    this.subscriptions=[];
    
    this.state = {
      authenticated: false,
      userRole:'',
      userName:'',
      user:{},
      wishlist:{}
    };
  }  
  
componentDidMount(){
        firebase.auth().onAuthStateChanged((authenticated) => {
          authenticated
            ? this.setState(() => ({
                authenticated: true,
              }))
            : this.setState(() => ({
                authenticated: false,
              }));
        });  
        
        this.subscriptions.push(firebaseServices.getUser(sessionStorage.getItem('userKey'))
        .subscribe(user => {
          this.setState({user:user,userName: user.firstName, userRole:user.role});
          console.log(this.state.user, this.state.authenticated);
          this.subscriptions.push(firebaseServices.getWishlist(user.key)
          .subscribe(items => this.setState({wishlist: items})));
      }));
  }

componentWillUnmount(){
      this.subscriptions.forEach(obs => obs.unsubscribe());
    }

render() {
    
    const MyRewards=(props)=>{      
      return(
        <Rewards user={this.state.user}></Rewards>
      )
    }

    const MyWishlist=(props)=>{
      return(
        <Wishlist user={this.state.user}></Wishlist>
      )
    }
    
    return (
      <Router>
        <div>
          <div style={{ height: "100%" }}>
            <Navbar userName={this.state.userName} authenticated={this.state.authenticated}
            />
            <div>
              <Route exact path="/" component={Home}/>
              <Route path="/admin" component={Admin} />
              <Route path="/CompanyDashboard" component={CompanyDashboard} />
              <Route path="/BrandDashboard" component={BrandDashboard} />
              <Route path="/wishlist" component={MyWishlist} />
              <Route path="/rewards" component={MyRewards} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={EmployeeForm} />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;

serviceWorker.register();
