import React, { Component } from "react";
import FirebaseServices from "../firebase/services";
import { Link } from "react-router-dom";
import "./CssPages/Brands.css";

const firebaseServices = new FirebaseServices();

class BrandCard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const brand = this.props.brand;
    const brandName = brand.name;
    const brandPicture = brand.picture;
    const brandDescription = brand.description;
    return (
      <div className="col-md-3 m-4">
        <Link to={`/brands/${brandName}`} className="custom-card">
          <div className="card" style={{ width: "18rem" }}>
            <h3 className="card-header text-center">{brandName}</h3>
            <img className="card-img-top" src={brandPicture} alt={brandName} />
            <div className="card-body">
              <p className="card-text  text-center">{brandDescription}</p>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

export class Brands extends Component {
  constructor(props) {
    super(props);
    this.state = { brands: [] };
    this.subscriptions = [];
  }
  componentDidMount() {
    this.subscriptions.push(
      firebaseServices.getBrands().subscribe(brands => {
        this.setState({ brands: brands });
      })
    );
  }
  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }
  render() {
    const brands = this.state.brands;
    const list = brands.map(br => <BrandCard brand={br} key={br.key} />);
    return (
      <div className="container">
        <div className="row ">{list}</div>
      </div>
    );
  }
}

export default Brands;
