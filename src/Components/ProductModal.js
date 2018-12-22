import React from "react";
import '../Pages/CssPages/Test.css';
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
  
  class WishlistButton extends React.Component{
    productKey="";
    userKey="";
    wishlist=[];
    constructor(props){
      super(props);
      this.subscriptions = [];
      this.addToWishlist = this.addToWishlist.bind(this);
      this.isInWishlist = this.isInWishlist.bind(this);
      this.state = {
        isInWishlist: false
      }
    }
    componentDidMount(){
      this.productKey = this.props.productKey;
      this.userKey = this.props.userKey;
      this.subscriptions.push(firebaseServices.getWishlist(this.userKey).subscribe(items =>{
        this.setState({isInWishlist: false});
        this.wishlist = items;
        this.isInWishlist();
      }));
    }

    componentWillUnmount(){
      this.subscriptions.forEach(obs => obs.unsubscribe());
    }

    addToWishlist(event){
      firebaseServices.addToWishlist(this.productKey, this.userKey);
      event.stopPropagation();
    }
    isInWishlist(){
      if(this.wishlist.includes(this.productKey)){
        this.setState({isInWishlist: true});
      }
    }
    render(){
      const inWishlist = this.state.isInWishlist;
      return(
        <button className="wishlistButton btn btn-primary" 
          role="button" onClick={this.addToWishlist} disabled={inWishlist}> 
          {inWishlist ? "Item in Wishlist" : "Add to Wishlist"}
        </button>
      )
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
  
  class ProductModal extends React.Component {
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
      const user = this.props.user;
      const userKey = user.key;
      return (
        <div className="row">
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
                  </div>
                  <div className="row">
                    <div className="col-md-8">
                      <p className="d-flex justify-content-left align-content-center">
                        {productDescription}
                      </p>
                    </div>
                    <div className="col-md-4">
                      <WishlistButton productKey={product.key} userKey={userKey} />
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

export default ProductModal;