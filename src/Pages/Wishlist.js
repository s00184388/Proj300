import React from "react";
import "../Pages/CssPages/Wishlist.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import FirebaseServices from "../firebase/services";
import ReactLoading from "react-loading";

library.add(faInfoCircle);

const firebaseServices = new FirebaseServices();

class ProductProgressbar extends React.Component {
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

class Picture extends React.Component {
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
    //console.log("userID: " + this.state.user.key);
    //console.log("productID " + this.state.product.key);
    //console.log("recipient:");
    //console.log(this.state.recipient);
    var url = `https://stravakudos.herokuapp.com/buy`;
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
      .then(response => {
        console.log(response.status);
        switch (response.status) {
          case 460:
            this.props.showAlert(
              "warning",
              "Not enough coins",
              "Could not buy product"
            );
            break;
          case 461:
            this.props.showAlert(
              "warning",
              "Not enough gained coins to unlock the product",
              "Could not buy product"
            );
            break;
          case 462:
            this.props.showAlert(
              "warning",
              "Product out of stock",
              "Could not buy product"
            );
            break;
          case 463:
            this.props.showAlert(
              "warning",
              "You were not approved by company",
              "Could not buy product"
            );
            break;
          case 464:
            this.props.showAlert(
              "warning",
              "You have not verified your email",
              "Could not buy product"
            );
            break;
          case 200:
            this.props.showAlert(
              "success",
              "An email was sent to the product owner. You will be contacted by him.",
              "Product bought!"
            );
            break;
          default:
            this.props.showAlert(
              "warning",
              "An error occured",
              "Could not buy product"
            );
            break;
        }
      }) // parses response to JSON
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

/*Title Component*/

class Title extends React.Component {
  render() {
    const brandName = this.props.brandName;
    const companyName = this.props.companyName;
    return (
      <div className="row">
        <div className="col-sm">
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

/*Products component */

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.showAlert = this.showAlert.bind(this);
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

  showAlert(type, message, headline) {
    this.props.showAlert(type, message, headline);
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
    const productPicture = product.picURL;
    const brandPicture = brand.picURL;
    const brandName = brand.name;
    const company = this.state.company;
    const companyName = company.name;
    const companyPicture = company.picURL;
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
      <div className="col-lg-12 py-2">
        <div className="card-primary">
          <div className="card">
            <div className="card-header bg-primary h6text">
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="h6text">{productName}</h6>
                </div>
                <div className="col-sm-3 ">{price} Kudos</div>
                <div className="col-sm-5">
                  <Title
                    brandName={brandName}
                    sponsored={sponsored}
                    companyName={companyName}
                  />
                </div>
                <div className="col-sm-1 d-flex justify-content-center">
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
                <div className="col-sm-4">
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
                <div className="col-sm-5">
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
                <div className="col-sm-3">
                  <div className="row">
                    <div className="col-sm text-right">
                      <DeleteButton product={product} />
                    </div>
                  </div>
                  <div className="row pt-5">
                    <div className="col-sm text-right">
                      <BuyButton
                        recipient={recipient}
                        product={product}
                        user={user}
                        showAlert={this.showAlert}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm">
                  <p className="d-flex justify-content-left align-content-center">
                    {productDescription}
                  </p>
                </div>
                <div className="col-md text-right">
                  Unlocking value: {priceToUnlock} Kudos
                  <FontAwesomeIcon
                    style={{ marginLeft: "5px" }}
                    data-tip="React-tooltip"
                    icon="info-circle"
                  />
                  <ReactTooltip place="right" type="dark" effect="solid">
                    <p>
                      To unlock a product, you must gain at least this amount of
                      Kudos from the moment you added it to the wishlist and
                      have enough Kudos to buy it
                    </p>
                  </ReactTooltip>
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
    this.showAlert = this.showAlert.bind(this);
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

  showAlert(type, message, headline) {
    this.props.showAlert(type, message, headline);
  }

  render() {
    const user = this.state.user;
    const products = this.state.products;
    const fetchInProgress = this.state.fetchInProgress;
    const listProd = products.map(product => (
      <Products
        product={product}
        key={product.key}
        user={user}
        showAlert={this.showAlert}
      />
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
        ) : products.length > 0 ? (
          <div className="row">
            <div className="col-md-8 py-4">{listProd}</div>
          </div>
        ) : (
          <h4 style={{ color: "white" }}>No products in wishlist</h4>
        )}
      </div>
    );
  }
}

export default Wishlist;
