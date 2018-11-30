import React from "react";
import mockData from "../mockData.json";
import "./CssPages/Test.css";

{
  /*Picture component-fixed */
}

class Picture extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const productPicture = this.props.url;
    const productName = this.props.name;
    return (
      <img width="100" height="100" src={productPicture} alt={productName} />
    );
  }
}
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
  /*Products component */
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
            <div class="card">
              <div class="card-body">
                <div className="col-md-4">
                  <h6 class="card-title mb-2 text-muted d-flex justify-content-left">
                    {productName}
                  </h6>
                  <hr />
                  <div className="row d-flex justify-content-left py-3">
                    <Picture
                      className="productPicture"
                      url={picURL}
                      name={productName}
                    />
                    <div className="">{price}</div>
                  </div>
                  <p class="card-text d-flex justify-content-left py-2 ">
                    {productDescription}
                  </p>
                </div>
              </div>
            </div>
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
