import React from "react";
import '../Pages/CssPages/Wishlist.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import FirebaseServices from "../firebase/services";
import {httpGetAsync} from '../serivces/strava';
import {httpPostAsync} from '../serivces/strava';


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
      return (
        <button className="btn btn-danger" onClick={this.deleteProduct}>
          <FontAwesomeIcon icon="trash" className="fa-lg" />
        </button>
      );
    }
  }
  
  class BrandPicture extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var productPicture = this.props.brandPicture;
      var productName = this.props.brandName;
      var sponsored = this.props.sponsored;
      if(!sponsored){
        productPicture = this.props.companyPicture;
        productName = this.props.companyName
      }
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

  class Title extends React.Component{
    render(){
      const brandName = this.props.brandName;
      const companyName = this.props.companyName;
      return(
        <div className="row">
          <div className="col-lg mr-4 p-2">
            <strong>{this.props.sponsored ? `Sponsored by ${brandName}`: `${companyName}`} </strong>
          </div>
        </div>
      )
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

      this.state = {brand : {}, company: {}};
      this.subscriptions = [];
    }

    componentWillMount(){
      this.subscriptions.push(firebaseServices.getBrand(this.props.product.brandID).subscribe(brand =>{
        this.setState({brand:brand});
      }));
      this.subscriptions.push(firebaseServices.getCompany(this.props.product.companyID).subscribe(company =>{
        this.setState({company:company});
      }));
    }

    componentWillUnmount(){
      this.subscriptions.forEach(obs => obs.unsubscribe());
    }

    render() {
      const product = this.props.product;
      const sponsored = product.sponsored;
      const brand = this.state.brand;
      const productName = product.name;
      const stock = product.stock;
      const productDescription = product.description;
      const productPicture = product.picture;
      const brandPicture = brand.picture;
      const brandName = brand.name;
      const company = this.state.company;
      const companyName = company.name;
      const companyPicture = company.picture;
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
                    <div className="col-md-3 h6 text-white ">{price} Kudos</div>
                    <div className="col-md-5 d-flex justify-content-end">
                      <Title brandName={brandName} sponsored={sponsored} companyName={companyName}/>
                    </div>
                    <div className="col-md-1 d-flex justify-content-end ">
                      <BrandPicture
                        className="brandPicture"
                        companyName={companyName} companyPicture={companyPicture}
                        brandPicture={brandPicture} brandName={brandName}
                        sponsored={sponsored}
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
                          url={productPicture}
                          name={productName}
                        />
                      </div>
                      <p className="strong d-flex justify-content-left mt-2">
                        Description
                      </p>
                    </div>
                    <div className="col-md-5">
                      <div className="pb-2">
                        Stock: {stock}
                      </div>
                      <p className="text-left mb-1">Average of competitors</p>
                      <div className="pb-2">
                        <ProductProgressbar
                          quantity={16}
                          remaining={11}
                        />
                      </div>
                      <p className="text-left mb-1">Your progress</p>
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
                      Price to unlock: x
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

export class Wishlist extends React.Component {
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
        .getWishListItems("RuXsq8vflU3rMGOku9Po")
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
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 py-4">{listProd}</div>
          <div className="col-md-2">
            <a href='https://www.strava.com/oauth/authorize?client_id=31723&response_type=code&redirect_uri=http://localhost:3001/getCode&approval_prompt=force&scope=activity:read_all' 
            className="btn btn-primary">Connect with strava</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Wishlist;
