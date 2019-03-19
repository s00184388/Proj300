import React, { Component } from "react";
import FirebaseServices from "../firebase/services";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
import "./CssPages/Brands.css";

const firebaseServices = new FirebaseServices();

// component that renders a brand card
// brand cards can be clicked and the employee will be redirrected to the brand's shop
class BrandCard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const brand = this.props.brand;
    const brandName = brand.name;
    const brandPicture = brand.picURL;
    const brandDescription = brand.description;
    //style for the image
    const style = {
      width: 128,
      height: 128
    };
    return (
      <div className="col-md-3 m-4">
        <Link to={`/brands/${brandName}`} className="custom-card">
          <div className="card " style={{ width: "18rem" }}>
            <h4 className="card-header text-center bg-primary text-white">
              {brandName}
            </h4>
            <img
              style={style}
              className="card-img-top rounded mx-auto d-block"
              src={brandPicture}
              alt={brandName}
            />
            <div className="card-body">
              <p className="card-text  text-center">{brandDescription}</p>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

//component that renders all the brand cards
//this page has a list of brands in form of cards
export class Brands extends Component {
  constructor(props) {
    super(props);
    this.state = { brands: [], fetchInProgress: true };
    this.subscriptions = [];
  }

  //getting all the brands
  componentDidMount() {
    this.setState({ fetchInProgress: true });
    this.subscriptions.push(
      firebaseServices.getBrands().subscribe(brands => {
        this.setState({ brands: brands, fetchInProgress: false });
      })
    );
  }
  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }
  render() {
    const brands = this.state.brands;
    //forach brand, render the brand card
    const list = brands.map(br => <BrandCard brand={br} key={br.key} />);
    var fetchInProgress = this.state.fetchInProgress;
    return (
      <div
        className={
          fetchInProgress
            ? "container d-flex justify-content-center"
            : "container"
        }
      >
        {fetchInProgress ? (
          <ReactLoading
            type={"spinningBubbles"}
            color={"#fff"}
            height={640}
            width={256}
          />
        ) : (
          <div className="row ">{list}</div>
        )}
      </div>
    );
  }
}

export default Brands;
