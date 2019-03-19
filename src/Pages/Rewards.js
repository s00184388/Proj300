import React from "react";
import { DropdownList } from "react-widgets";
import "./CssPages/Rewards.css";
import jsonProds from "../mockData.json";
import "./CssPages/Checkbox.css";
import "./CssPages/closeButton.css";
import "react-widgets/dist/css/react-widgets.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import FirebaseServices from "../firebase/services";
import Modal from "react-modal";
import ProductModal from "../Components/ProductModal";
import ReactLoading from "react-loading";

const firebaseServices = new FirebaseServices();
Modal.setAppElement("#root");
library.add(faCheck);

const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0",
    display: "inline-block",
    overflow: "hidden",
    width: "50%"
  }
};

class Picture extends React.Component {
  render() {
    const productPicture = this.props.url;
    const productName = this.props.name;
    return (
      <img
        className="rounded imag"
        width="100"
        height="95"
        src={productPicture}
        alt={productName}
      />
    );
  }
}

class ProductPrice extends React.Component {
  render() {
    const price = this.props.price;
    return <h6>{price} Kudos</h6>;
  }
}

class WishlistButton extends React.Component {
  productKey = "";
  userKey = "";
  wishlist = [];
  constructor(props) {
    super(props);
    this.subscriptions = [];
    this.addToWishlist = this.addToWishlist.bind(this);
    this.isInWishlist = this.isInWishlist.bind(this);
    this.state = {
      isInWishlist: false
    };
  }
  componentDidMount() {
    this.productKey = this.props.productKey;
    this.userKey = this.props.userKey;
    this.subscriptions.push(
      firebaseServices.getWishlist(this.userKey).subscribe(items => {
        this.setState({ isInWishlist: false });
        this.wishlist = items;
        this.isInWishlist();
      })
    );
  }

  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }

  addToWishlist(event) {
    firebaseServices.addToWishlist(this.productKey, this.userKey);
    event.stopPropagation();
  }
  isInWishlist() {
    this.wishlist.forEach(item => {
      if (item.productID === this.productKey) {
        this.setState({ isInWishlist: true });
      }
    });
  }
  render() {
    const inWishlist = this.state.isInWishlist;
    return (
      <button
        className="wishlistButton btn btn-primary btn-sm"
        onClick={this.addToWishlist}
        disabled={inWishlist}
      >
        {inWishlist ? "Item in Wishlist" : "Add to Wishlist"}
      </button>
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
        className="rounded image d-block"
        width="40"
        height="41"
        src={productPicture}
        alt={productName}
      />
    );
  }
}

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.subscriptions = [];
    this.isInWishlist = this.isInWishlist.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.productKey = this.props.product.key;
    this.state = {
      isInWishlist: false,
      modalIsOpen: false,
      brand: {},
      company: {}
    };
    this.userKey = this.props.user.key;
  }

  componentDidMount() {
    this.subscriptions.push(
      firebaseServices.getWishlist(this.userKey).subscribe(items => {
        this.setState({ isInWishlist: false });
        this.wishlist = items;
        this.isInWishlist();
      })
    );
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
  }

  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }

  isInWishlist() {
    this.wishlist.forEach(item => {
      if (item.productID === this.productKey) {
        this.setState({ isInWishlist: true });
      }
    });
  }

  openModal() {
    if (!this.state.modalIsOpen) {
      this.setState({ modalIsOpen: true });
    }
  }
  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const product = this.props.product;
    const brand = this.state.brand;
    const wishlist = this.props.wishlist;
    const user = this.props.user;
    const userKey = user.key;
    const productName = product.name;
    const productDescription = product.description;
    const productPicture = product.picURL;
    const brandPicture = brand.picURL;
    const brandName = brand.name;
    const price = product.price;
    const productKey = product.key;
    const sponsored = product.sponsored;
    const inWishlist = this.state.isInWishlist;
    const company = this.state.company;
    const companyName = company.name;
    const companyPicture = company.picURL;
    return (
      <div className="card card-primary">
        <div
          className={
            (inWishlist ? " inWishlist " : " ") +
            (sponsored ? " sponsored " : " ")
          }
          onClick={this.openModal}
        >
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={modalStyle}
            shouldCloseOnOverlayClick={true}
          >
            <div style={{ height: "60%", position: "relative" }}>
              <ProductModal product={product} user={user} />
            </div>
            <a href="#" className="closeButton" onClick={this.closeModal} />
          </Modal>

          <div className="card-header bg-primary">
            <div className="row">
              <div className="col-sm-10" style={{ color: "white" }}>
                <Title
                  brandName={brandName}
                  sponsored={sponsored}
                  companyName={companyName}
                />
              </div>
              <div className="col-sm-2">
                <BrandPicture
                  className="brandPicture"
                  companyName={companyName}
                  companyPicture={companyPicture}
                  sponsored={sponsored}
                  brandPicture={brandPicture}
                  brandName={brandName}
                />
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-9">
                <h5 style={{ fontWeight: "bold", color: "dimgrey" }}>
                  {productName}
                </h5>
                <hr />
                <h6 style={{ fontWeight: "bold", color: "dimgrey" }}>
                  <ProductPrice price={price} />
                </h6>
              </div>
              <div className="col-sm-3">
                <div className="d-flex justify-content-end">
                  <Picture
                    className="productPicture"
                    url={productPicture}
                    name={productName}
                  />
                </div>
              </div>
            </div>
            <div className="row ml-1 pt-2">
              <p style={{ fontWeight: "bold", color: "dimgrey" }}>
                {productDescription}
              </p>
            </div>
            <div className="row">
              <div className="col-sm-6 text-left" />
              <div className="col-sm-6 d-flex justify-content-end">
                <WishlistButton
                  productKey={productKey}
                  userKey={userKey}
                  wishlist={wishlist}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Dropdown extends React.Component {
  constructor(props) {
    super(props);

    this.doOrderBy = this.doOrderBy.bind(this);
    this.doOrder = this.doOrder.bind(this);
  }

  doOrderBy(e) {
    const newOrderBy = e.target.getAttribute("data-value");
    this.props.doOrderBy(newOrderBy);
  }
  doOrder(e) {
    const newOrder = e.target.checked;
    this.props.doOrder(newOrder);
  }

  render() {
    const { orderBy, order, doOrderBy, doOrder } = this.props;
    const checked = <FontAwesomeIcon icon="check" />;

    return (
      <div className="dropdown">
        <button
          className="btn btn-default sortbutton"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span>Sort By</span>
          <span className="caret" />
        </button>
        <ul className="dropdown-menu col-lg-12">
          <h6 className="dropdown-header">Order by</h6>
          <li>
            <button
              className="dropdown-item"
              onClick={doOrderBy}
              data-value="price"
            >
              Price {orderBy === "price" ? checked : null}
            </button>
          </li>
          <li>
            <button
              className="dropdown-item"
              onClick={doOrderBy}
              data-value="remaining"
            >
              In stock {orderBy === "remaining" ? checked : null}
            </button>
          </li>
          <div className="dropdown-divider" />
          <h6 className="dropdown-header">Order</h6>
          <li>
            <button
              className="dropdown-item"
              onClick={doOrder}
              data-value="asc"
            >
              ascendind {order === "asc" ? checked : null}
            </button>
          </li>
          <li>
            <button
              className="dropdown-item"
              onClick={doOrder}
              data-value="desc"
            >
              descending {order === "desc" ? checked : null}
            </button>
          </li>
        </ul>
      </div>
    );
  }
}
class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleAffordableChange = this.handleAffordableChange.bind(this);
    this.handleWishlistChange = this.handleWishlistChange.bind(this);
    this.handleSponsoredChange = this.handleSponsoredChange.bind(this);
    this.doOrderBy = this.doOrderBy.bind(this);
    this.doOrder = this.doOrder.bind(this);
  }

  doOrderBy(e) {
    const newOrderBy = e.target.getAttribute("data-value");
    this.props.doOrderBy(newOrderBy);
  }
  doOrder(e) {
    const newOrder = e.target.getAttribute("data-value");
    this.props.doOrder(newOrder);
  }

  handleCategoryChange(e) {
    this.props.onCategoryChange(e);
  }
  handleAffordableChange(e) {
    this.props.onAffordableChange(e);
  }
  handleWishlistChange(e) {
    this.props.onWishlistChange(e);
  }
  handleSponsoredChange(e) {
    this.props.onSponsoredChange(e);
  }

  render() {
    const rewardsType = ["Electronics", "Shoes", "Sports", "Others", "All"];
    const { orderBy, order, doOrderBy, doOrder } = this.props;

    return (
      <div className="pb-5">
        <h6 className="h5text1 py-3">Filter By</h6>
        <div className="py-2">
          <DropdownList
            data={rewardsType}
            onChange={this.handleCategoryChange}
            value={this.props.categoryFilter}
            placeholder="Categories"
            style={{ padding: "0%" }}
          />
        </div>

        <hr />
        <Dropdown
          doOrderBy={doOrderBy}
          doOrder={doOrder}
          orderBy={orderBy}
          order={order}
        />
        <hr />
        <section className="checkboxSection p-0">
          <input
            id="affordableChk"
            type="checkbox"
            onClick={this.handleAffordableChange}
          />
          <label htmlFor="affordableChk">
            <span />
            <div className="color">Only Affordable Items</div>
          </label>
        </section>
        <section className="checkboxSection">
          <input
            id="sponsoredChk"
            type="checkbox"
            onClick={this.handleSponsoredChange}
          />
          <label htmlFor="sponsoredChk">
            <span />
            <div className="color">Only Sponsored Items</div>
          </label>
        </section>
      </div>
    );
  }
}

class ProductContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wishlist: [],
      companyProductList: [],
      sponsoredProductList: [],
      company: {},
      fetchInProgress: true
    };
    this.subscriptions = [];
    this.isInWishlist = this.isInWishlist.bind(this);
    this.filterbyWishlist = this.filterbyWishlist.bind(this);
    this.filterbySponsored = this.filterbySponsored.bind(this);
    this.userKey = "";
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ fetchInProgress: true });
    this.userKey = nextProps.user.key;
    this.subscriptions.push(
      firebaseServices.getWishlist(this.userKey).subscribe(items => {
        this.setState({ wishlist: items });
        this.subscriptions.push(
          firebaseServices
            .getCompany(nextProps.user.companyID)
            .subscribe(comp => {
              this.setState({ company: comp });
              this.subscriptions.push(
                firebaseServices
                  .getProducts("companyID", this.state.company.key)
                  .subscribe(products =>
                    this.setState({
                      companyProductList: products,
                      fetchInProgress: false
                    })
                  )
              );
              this.subscriptions.push(
                firebaseServices
                  .getSponsoredProducts()
                  .subscribe(sponsoredProds => {
                    this.setState({
                      sponsoredProductList: sponsoredProds,
                      fetchInProgress: false
                    });
                  })
              );
            })
        );
      })
    );
  }
  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }
  isInWishlist(prod) {
    this.state.wishlist.forEach(item => {
      if (item.productID === prod.key) {
        return true;
      }
    });
    return false;
  }
  filterbyCategory(str) {
    return function(product) {
      if (str && str !== "All") {
        return product.category.toLowerCase().includes(str.toLowerCase());
      }
      return true;
    };
  }
  filterbyAffordable(coins) {
    return function(product) {
      return product.price > coins ? 0 : 1;
    };
  }
  filterbyWishlist(prod) {
    return !this.isInWishlist(prod);
  }
  filterbySponsored(prod) {
    return prod.sponsored;
  }
  sortbyPrice(a, b) {
    return a.price > b.price ? 1 : a.price < b.price ? -1 : 0;
  }

  sortbyRemaining(a, b) {
    return a.stock > b.stock ? 1 : a.stock < b.stock ? -1 : 0;
  }

  render() {
    const user = this.props.user;
    this.userKey = user.key;
    const userCoins = user.coins;
    var companyProducts = this.state.companyProductList;
    var sponsoredProducts = this.state.sponsoredProductList;
    var products = companyProducts.concat(sponsoredProducts);
    const wishlist = this.props.wishlist;
    const fetchInProgress = this.state.fetchInProgress;
    if (this.props.affordableChecked) {
      products = products.filter(this.filterbyAffordable(userCoins));
    }
    if (this.props.wishlistChecked) {
      products = products.filter(this.filterbyWishlist);
    }
    if (this.props.sponsoredChecked) {
      products = products.filter(this.filterbySponsored);
    }
    products = products.filter(
      this.filterbyCategory(this.props.categoryFilter)
    );

    if (this.props.orderBy === "price") {
      products = products.sort(this.sortbyPrice);
      if (this.props.order === "desc") {
        products = products.reverse();
      }
    } else {
      products = products.sort(this.sortbyRemaining);
      if (this.props.order === "desc") {
        products = products.reverse();
      }
    }

    const listProducts = products.map(product => (
      <div className="col-sm-6 pb-5" key={product.key}>
        <Product product={product} user={user} wishlist={wishlist} />
      </div>
    ));
    return (
      <div>
        {fetchInProgress ? (
          <div className="col d-flex justify-content-center">
            <ReactLoading
              type={"spinningBubbles"}
              color={"#fff"}
              height={640}
              width={256}
            />
          </div>
        ) : (
          <div className="row">{listProducts}</div>
        )}
      </div>
    );
  }
}

export class Rewards extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.user);
    this.subscriptions = [];

    this.state = {
      categoryFilter: "",
      affordableChecked: false,
      wishlistChecked: false,
      sponsoredChecked: false,
      orderBy: "price",
      order: "asc",
      wishlist: [],
      user: props.user
    };
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleAffordableChange = this.handleAffordableChange.bind(this);
    this.handleWishlistChange = this.handleWishlistChange.bind(this);
    this.handleSponsoredChange = this.handleSponsoredChange.bind(this);
    this.doOrderBy = this.doOrderBy.bind(this);
    this.doOrder = this.doOrder.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ user: nextProps.user });
    console.log(nextProps.user);
  }

  componentDidMount() {
    this.subscriptions.push(
      firebaseServices
        .getWishlist(this.state.user.key)
        .subscribe(items => this.setState({ wishlist: items }))
    );
  }

  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }

  doOrderBy(e) {
    const newOrderBy = e.target.getAttribute("data-value");
    this.setState({ orderBy: newOrderBy });
  }
  doOrder(e) {
    const newOrder = e.target.getAttribute("data-value");
    this.setState({ order: newOrder });
  }

  handleCategoryChange(e) {
    this.setState({ categoryFilter: e });
  }
  handleAffordableChange(e) {
    this.setState({ affordableChecked: e.target.checked });
  }
  handleWishlistChange(e) {
    this.setState({ wishlistChecked: e.target.checked });
  }
  handleSponsoredChange(e) {
    this.setState({ sponsoredChecked: e.target.checked });
  }
  addFirebaseData() {
    jsonProds.forEach(prod => firebaseServices.addProduct(prod));
  }

  render() {
    const categoryFilter = this.state.categoryFilter;
    const affordableChecked = this.state.affordableChecked;
    const wishlistChecked = this.state.wishlistChecked;
    const sponsoredChecked = this.state.sponsoredChecked;

    const orderBy = this.state.orderBy;
    const order = this.state.order;
    const wishlist = this.state.wishlist;
    const user = this.state.user;
    return (
      <div className="row py-5">
        <div className="col-sm-3">
          <div className="card-header myCard">
            <Filters
              user={user}
              wishlist={wishlist}
              categoryFilter={categoryFilter}
              onCategoryChange={this.handleCategoryChange}
              affordableChecked={affordableChecked}
              onAffordableChange={this.handleAffordableChange}
              sponsoredChecked={sponsoredChecked}
              onSponsoredChange={this.handleSponsoredChange}
              wishlistChecked={wishlistChecked}
              onWishlistChange={this.handleWishlistChange}
              doOrderBy={this.doOrderBy}
              orderBy={orderBy}
              doOrder={this.doOrder}
              order={order}
            />
          </div>
        </div>

        <div className="col-sm-9">
          <ProductContainer
            user={user}
            wishlist={wishlist}
            categoryFilter={categoryFilter}
            affordableChecked={affordableChecked}
            wishlistChecked={wishlistChecked}
            sponsoredChecked={sponsoredChecked}
            orderBy={orderBy}
            order={order}
            style={{ position: "fixed" }}
          />
        </div>
      </div>
    );
  }
}
export default Rewards;
