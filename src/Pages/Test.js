import React from "react";
import mockData from "../mockData.json";
//style
import "./Navbar.css";

export class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = { products: mockData };
  }
  render() {
    this.state.products.map((product, index) => (
      <div className="col-md-4" key={index} />
    ));
    return (
      <div className="container">
        <div className="row ">{product.index}</div>
      </div>
    );
  }
}

export default Test;
