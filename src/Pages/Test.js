import React from "react";
import "./CssPages/Test.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import FirebaseServices from "../firebase/services";

const firebaseServices = new FirebaseServices();

class ProductProgressbar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const quantity = this.props.quantity;
    const remaining = this.props.remaining;
    const percent = (remaining * 100) / quantity;
    const label = this.props.label;
    const progressStyle = {
      width: percent + "%"
    };
    return (
      <div className="progress">
        <p>{label}</p>
        <div
          className={
            "progress-bar progress-bar-striped" +
            (percent < 60
              ? percent < 30
                ? "bg-danger"
                : "bg-warning"
              : "bg-success")
          }
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
          style={progressStyle}
        >
          {remaining + "/" + quantity}
        </div>
      </div>
    );
  }
}

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
      <img
        className="rounded imag d-block"
        width="100"
        height="100"
        src={productPicture}
        alt={productName}
      />
    );
  }
}

class DeleteButton extends React.Component {
  constructor(props) {
    super(props);
    this.deleteProduct = this.deleteProduct.bind(this);
  }
  deleteProduct() {
    firebaseServices.deleteProduct(this.props.product);
  }
  render() {
    const prod = this.props.product;
    return (
      <button className="btn btn-danger" onClick={this.deleteProduct}>
        <FontAwesomeIcon icon="trash" className="fa-lg" />
      </button>
    );
  }
}

class TrackingButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <button className="btn btn-primary btn-sm">Track</button>;
  }
}

class BrandPicture extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const productPicture = this.props.url;
    const productName = this.props.name;
    return (
      <img
        className="rounded imag d-block"
        width="35"
        height="35"
        src={productPicture}
        alt={productName}
      />
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
    const quantity = product.quantity;
    const remaining = product.remaining;
    const productDescription = product.description;
    const picURL = product.picURL;
    const brandURL = product.brand.picURL;
    const brandName = product.brand.name;
    const price = product.price;
    return (
      <div className="row py-4">
        <div className="col-md-12">
          <div className="card card-primary">
            <div className="card">
              <div className="card-header bg-primary  ">
                <div className="row d-flex align-items-center">
                  <div className="col-md-3 d-flex justify-content-start">
                    <h6>{productName}</h6>
                  </div>
                  <div className="col-md-6 h6 text-white ">{price}</div>
                  <div className="col-md-2 d-flex justify-content-end">
                    <h6>{brandName}</h6>
                  </div>
                  <div className="col-md-1 d-flex justify-content-end ">
                    <BrandPicture
                      className="brandPicture"
                      url={brandURL}
                      name={brandName}
                    />
                  </div>
                </div>
              </div>
              <div className="card-body mb-0">
                <div className="row">
                  <div className="col-md-4">
                    <div className="row ml-0 mt-1">
                      <Picture
                        className="productPicture"
                        url={picURL}
                        name={productName}
                      />
                    </div>
                    <p className="strong d-flex justify-content-left mt-2">
                      Description
                    </p>
                  </div>
                  <div className="col-md-5">
                    <p className="text-left mb-1">Remaining Stock</p>
                    <div className="pb-2">
                      <ProductProgressbar
                        quantity={quantity - 2}
                        remaining={remaining - 1}
                      />
                    </div>
                    <p className="text-left mb-1">Average of competitors</p>
                    <div className="pb-2">
                      <ProductProgressbar
                        quantity={quantity}
                        remaining={remaining}
                      />
                    </div>
                    <p className="text-left mb-1">Your progress</p>
                    <ProductProgressbar
                      quantity={quantity - 1}
                      remaining={remaining - 2}
                    />
                  </div>
                  <div className="col-md-3 text-right">
                    <DeleteButton product={product} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-10">
                    <p className="d-flex justify-content-left align-content-center">
                      {productDescription}
                    </p>
                  </div>
                  <div className="col-md-2">
                    <TrackingButton />
                  </div>
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
    this.subscriptions = [];
    this.state = {
      products: []
    };
  }
  componentDidMount() {
    this.subscriptions.push(
      firebaseServices
        .getWishListItems("LXCYHelb75dWxPRZhhB5")
        .subscribe(prod => this.setState({ products: prod }))
    );
  }

  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }

  render() {
    const listProd = this.state.products.map(product => (
      <Products product={product} key={product.key} />
    ));
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 py-4">{listProd}</div>
        </div>
      </div>
    );
  }
}

export default Test;
