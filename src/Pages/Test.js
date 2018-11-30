import React from "react";
import mockData from "../mockData.json";
import "./CssPages/Test.css";

{
  /*Status component-fixed */
}
class Status extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="card card-primary status col-md-3">
        <div className="card-header">Status</div>
        <div className="card-body">
          This is the status component body for each element from the wishlist!
        </div>
      </div>
    );
  }
}

{
  /*Status component-fixed */
}

class Products extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const product = this.props.product;
    const productName = product.name;
    const productDescription = product.description;
    const picURL = product.picURL;
    const brandURL = product.brand.picURL;
    const brandName = product.brand.name;
    const price = product.price;
    return (
      <div className="row py-4">
        <div className="col-md-12">
          <div className="card card-primary">
            <div className="card-header">{productName}</div>
            <div className="card-body" />
          </div>
        </div>
      </div>
    );
  }
}

export class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = { products: mockData };
  }
  render() {
    const listProd = this.state.products.map((product, index) => (
      <Products product={product} />
    ));
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 py-4">{listProd}</div>
          <div className="col-md-4 py-5">
            <Status />
          </div>
        </div>
      </div>
    );
  }
}

export default Test;
