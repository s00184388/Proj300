//modules
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

//styling
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHome, faBars, faGift } from "@fortawesome/free-solid-svg-icons";

//components
import { Home } from "./Pages/Home";
import { Admin } from "./Pages/Admin";
import { Dashboard } from "./Pages/Dashboard";
import { Wishlist } from "./Pages/Wishlist";
import { Rewards } from "./Pages/Rewards";
import { Navbar } from "./Components/Navbar";
import { Sidebar } from "./Components/Sidebar";

library.add(faHome, faBars, faGift);

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <div style={{ height: "100%" }}>
            <Navbar />
            <Sidebar />
            <div id="page-wrap">
              <Route exact path="/" component={Home} />
              <Route path="/admin" component={Admin} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/wishlist" component={Wishlist} />
              <Route path="/rewards" component={Rewards} />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
