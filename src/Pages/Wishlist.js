import React from "react";
import "../Pages/CssPages/Wishlist.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import FirebaseServices from "../firebase/services";
import ReactLoading from "react-loading";

library.add(faInfoCircle);

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
      width: percent + "%",
      color: "black"
    };
    var progressClass = "progress-bar ";
    if (label === "yourProgress") {
      if (percent <= 30) progressClass += "bg-danger";
      else if (percent > 30 && percent <= 60) progressClass += "bg-warning";
      else if (percent >= 100) progressClass += "bg-success";
      else progressClass += "bg-info";
    } else if (label === "avgOfCompetitors") {
      if (percent <= 30) progressClass += "bg-success";
      else if (percent > 30 && percent <= 60) progressClass += "bg-warning";
      else if (percent >= 100) progressClass += "bg-danger";
      else progressClass += "bg-info";
    } else progressClass += "bg-info";

    return (
      <div className="progress">
        <div
          className={progressClass}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
          style={progressStyle}
        >
          {remaining + " / " + quantity}
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

class BuyButton extends React.Component {
  constructor(props) {
    super(props);
    this.buyProduct = this.buyProduct.bind(this);
    this.state = {
      disabled: false,
      recipient: this.props.recipient,
      user: this.props.user,
      product: this.props.product
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.recipient !== this.props.recipient) {
      this.setState({
        recipient: nextProps.recipient,
        user: nextProps.user,
        product: nextProps.product
      });
    }
  }

  buyProduct() {
    var data = {
      userID: this.state.user.key,
      productID: this.state.product.key,
      recipient: this.state.recipient
    };
    console.log("userID: " + this.state.user.key);
    console.log("productID " + this.state.product.key);
    console.log("recipient:");
    console.log(this.state.recipient);
    var url = `http://stravakudos.herokuapp.com/buy`;
    fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
      .then(response => console.log(response)) // parses response to JSON
      .catch(err => console.log(err));
  }
  render() {
    var disabled = this.setState.disabled;
    var product = this.state.product;
    var unlockingPrice = product.price * product.tresholdPercentage;
    if (
      this.state.user.coins >= product.price &&
      product.gainedCoins >= unlockingPrice &&
      product.stock > 0
    ) {
      disabled = false;
    } else {
      disabled = true;
    }
    return (
      <button
        className="btn btn-success"
        onClick={this.buyProduct}
        disabled={disabled}
      >
        Buy
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
    if (!sponsored) {
      productPicture = this.props.companyPicture;
      productName = this.props.companyName;
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

class Title extends React.Component {
  render() {
    const brandName = this.props.brandName;
    const companyName = this.props.companyName;
    return (
      <div className="row">
        <div className="col-lg mr-4 p-2">
          <strong>
            {this.props.sponsored
              ? `Sponsored by ${brandName}`
              : `${companyName}`}{" "}
          </strong>
        </div>
      </div>
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

    this.state = { brand: {}, company: {}, avgOfCompetitors: 0 };
    this.subscriptions = [];
  }

  componentWillMount() {
    this.subscriptions.push(
      firebaseServices.getBrand(this.props.product.brandID).subscribe(brand => {
        this.setState({ brand: brand });
      })
    );
    this.subscriptions.push(
      firebaseServices
        .getCompany(this.props.product.companyID)
        .subscribe(company => {
          this.setState({ company: company });
        })
    );
    fetch(
      `https://stravakudos.herokuapp.com/wishlistAverage?productId=${
        this.props.product.key
      }`
    )
      .then(res => {
        if (res.status !== 200) {
          console.log("Could not fetch average of competitors");
          return;
        }
        res
          .json()
          .then(data => {
            this.setState({ avgOfCompetitors: data });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }

  render() {
    const user = this.props.user;
    const product = this.props.product;
    const gainedCoins = product.gainedCoins.toFixed(2); // only for getting products with getWishListItems method
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
    const tresholdPercentage = product.tresholdPercentage;
    const priceToUnlock = (price * tresholdPercentage).toFixed(2);
    var recipient = {
      email: "",
      name: ""
    };
    const avgOfCompetitors = this.state.avgOfCompetitors;
    if (sponsored) {
      recipient.email = brand.email;
      recipient.name = brand.name;
    } else {
      recipient.email = company.email;
      recipient.name = company.name;
    }
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
                    <Title
                      brandName={brandName}
                      sponsored={sponsored}
                      companyName={companyName}
                    />
                  </div>
                  <div className="col-md-1 d-flex justify-content-end ">
                    <BrandPicture
                      className="brandPicture"
                      companyName={companyName}
                      companyPicture={companyPicture}
                      brandPicture={brandPicture}
                      brandName={brandName}
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
                      Description:
                    </p>
                  </div>
                  <div className="col-md-5">
                    <div className="pb-2">Stock: {stock}</div>
                    <p className="text-left mb-1">Average of competitors</p>
                    <div className="pb-2">
                      <ProductProgressbar
                        quantity={priceToUnlock}
                        remaining={avgOfCompetitors}
                        label={"avgOfCompetitors"}
                      />
                    </div>
                    <p className="text-left mb-1">Your progress</p>
                    <div className="pb-2">
                      <ProductProgressbar
                        quantity={priceToUnlock}
                        remaining={gainedCoins}
                        label={"yourProgress"}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="row">
                      <div className="col-md text-right">
                        <DeleteButton product={product} />
                      </div>
                    </div>
                    <div className="row pt-5">
                      <div className="col-md text-right">
                        <BuyButton
                          recipient={recipient}
                          product={product}
                          user={user}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md">
                    <p className="d-flex justify-content-left align-content-center">
                      {productDescription}
                    </p>
                  </div>
                  <div className="col-md text-right">
                    Price to unlock: {priceToUnlock} Kudos
                    <FontAwesomeIcon
                      style={{ marginLeft: "5px" }}
                      data-tip="React-tooltip"
                      icon="info-circle"
                    />
                    <ReactTooltip place="right" type="dark" effect="solid">
                      <p>
                        To unlock a product, you must gain at least this amount
                        of Kudos from the moment you added it to the wishlist
                        and have enough Kudos to buy it
                      </p>
                    </ReactTooltip>
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
      products: [],
      user: props.user,
      fetchInProgress: true
    };
  }
  componentDidMount() {
    this.setState({ fetchInProgress: true });
    this.subscriptions.push(
      firebaseServices
        .getWishListItems(this.state.user.key)
        .subscribe(prod =>
          this.setState({ products: prod, fetchInProgress: false })
        )
    );
  }

  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }

  render() {
    const user = this.state.user;
    const userID = user.key;
    const fetchInProgress = this.state.fetchInProgress;
    console.log(fetchInProgress);
    const listProd = this.state.products.map(product => (
      <Products product={product} key={product.key} user={user} />
    ));
    return (
      <div
        className={
          fetchInProgress
            ? "container-fluid d-flex justify-content-center"
            : "container-fluid"
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
          <div className="row">
            <div className="col-md-8 py-4">{listProd}</div>
          </div>
        )}
      </div>
    );
  }
}

export default Wishlist;
