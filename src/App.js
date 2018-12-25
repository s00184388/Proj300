//modules
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

//styling
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faBars,
  faGift,
  faTrash
} from "@fortawesome/free-solid-svg-icons";

//components
import { Home } from "./Pages/Home";
import { Admin } from "./Pages/Admin";
import { CompanyDashboard } from "./Pages/CompanyDashboard";
import { BrandDashboard } from "./Pages/BrandDashboard";
import { Rewards } from "./Pages/Rewards";
import { Navbar } from "./Components/Navbar";
import { Sidebar } from "./Components/Sidebar";
import { Test } from "./Pages/Test";

library.add(faHome, faBars, faGift, faTrash);

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <div style={{ height: "100%" }}>
            <Navbar />
            <Sidebar />
            <div>
              <Route exact path="/" component={Home} />
              <Route path="/admin" component={Admin} />
              <Route path="/CompanyDashboard" component={CompanyDashboard} />
              <Route path="/BrandDashboard" component={BrandDashboard} />
              <Route path="/wishlist" component={Test} />
              <Route path="/rewards" component={Rewards} />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
