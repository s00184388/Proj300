import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CssPages/Wishlist.css";
import mockData from "../mockData.json";

class Picture extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const productPicture = this.props.url;
    const productName = this.props.name;
    return (
      <img width="80" height="80" src={productPicture} alt={productName} />
    );
  }
}

class ProductPrice extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const price = this.props.price;
    return <p>{price} Kudos</p>;
  }
}

class Product extends React.Component {
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
      <div className="productCard container border rounded d-flex align-items-center justify-content-center">
        <div className="productCardContent">
          <div className="row">
            <div className="col-md-3 d-flex justify-content-start">
              <Picture
                className="productPicture"
                url={picURL}
                name={productName}
              />
            </div>
            <div className="col-md-6 d-flex justify-content-center">
              <h5>{productName}</h5>
            </div>
            <div className="col-md-3 d-flex justify-content-end">
              <Picture
                className="brandPicture"
                url={brandURL}
                name={brandName}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md d-flex justify-content-center">
              <p>{productDescription}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md d-flex justify-content-end">
              <ProductPrice price={price} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export class Page extends Component {
  constructor(props) {
    super(props);
    this.state = { products: mockData };
  }
  render() {
    let products = this.props.productList;

    const listProducts = this.state.products.map((product, index) => (
      <div className="col-md-4" key={index}>
        <Product product={product} />
      </div>
    ));
    return (
      <div className="container">
        <div className="row ">{listProducts}</div>
      </div>
    );
  }
}
export default Page;
