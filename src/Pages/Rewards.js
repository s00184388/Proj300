import React from 'react';
import { DropdownList } from 'react-widgets'
import { Link } from 'react-router-dom';
import './CssPages/Rewards.css';
import jsonProds from '../mockData.json';
import './CssPages/Checkbox.css';
import './CssPages/closeButton.css';
import 'react-widgets/dist/css/react-widgets.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import FirebaseServices from '../firebase/services';
import Modal from 'react-modal';
import ProductModal from '../Components/ProductModal';

const firebaseServices = new FirebaseServices(); 
Modal.setAppElement('#root');
library.add(faCheck);

const modalStyle = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    padding               : '0',
    display               : 'inline-block',
    overflow              : 'hidden'
  }
};


class Picture extends React.Component{
  constructor(props){
    super(props);

  }
  render(){
    const productPicture = this.props.url;
    const productName = this.props.name;
    return(
      <img width="80" height="80" src={productPicture} alt={productName}/>
      );
    }
  }

  class ProductProgressbar extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
      const quantity = this.props.quantity;
      const remaining = this.props.remaining;
      const percent = remaining*100/quantity;
      const progressStyle = {
        width: percent+"%"
      }
      return(
        <div className="progress">
          <div className={"progress-bar progress-bar-striped "+
            (percent<60 ? percent<30 ? "bg-danger" : "bg-warning" : "bg-success")} role="progressbar" 
          aria-valuenow={percent} aria-valuemin="0" 
          aria-valuemax="100" style={progressStyle}>{remaining + "/" + quantity}</div>
        </div>
      );
    }
  }

  class ProductPrice extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
      const price = this.props.price;
      return(
        <p>{price} Kudos</p>
      )
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

class SponsoredTitle extends React.Component{
  render(){
    return(
      <div className="row">
        <div className="col-md d-flex justify-content-center">
          <strong>Sponsored by {this.props.brandName}</strong>
        </div>
      </div>
    )
  }
}

class Product extends React.Component{
  constructor(props){
    super(props);
    this.subscriptions = [];
    this.isInWishlist = this.isInWishlist.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.productKey = this.props.product.key;
    this.state = {
      isInWishlist: false,
      modalIsOpen: false
    }
    this.userKey = this.props.user.key;
    this.subscriptions.push(firebaseServices.getWishlist(this.userKey).subscribe(items =>{
      this.setState({isInWishlist: false});
      this.wishlist = items;
      this.isInWishlist();
    }));
  }

  componentWillUnmount(){
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }

  isInWishlist(){
    if(this.wishlist.includes(this.productKey)){
      this.setState({isInWishlist: true});
    }
  }

  openModal() {
    if(!this.state.modalIsOpen){
      this.setState({modalIsOpen: true});
    }
  }
  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render(){
    const product = this.props.product;
    const wishlist = this.props.wishlist;
    const user = this.props.user;
    const userKey = user.key;
    const productName = product.name;
    const productDescription = product.description;
    const picURL = product.picURL;
    const brandURL = product.brand.picURL;
    const brandName = product.brand.name;
    const price = product.price;
    const quantity = product.quantity;
    const remaining = product.remaining;
    const productKey = product.key;
    const sponsored = product.sponsored;
    const inWishlist = this.state.isInWishlist;
    return(
      <div className={"productCard container border rounded d-flex align-items-center justify-content-center "+
            (inWishlist ? " inWishlist " : ' ') + (sponsored ? " sponsored " : ' ')} onClick={this.openModal}>
        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={modalStyle} shouldCloseOnOverlayClick={true}>
          <div style={{height: '80%', position: 'relative'}}>
            <ProductModal product={product} user={user}></ProductModal>
          </div>
          <a href="#" className="closeButton" onClick={this.closeModal}/>
        </Modal>
        <div className="productCardContent">
          {sponsored ? <SponsoredTitle brandName={brandName}/> : null}
          <div className="row">
            <div className="col-md-3 d-flex justify-content-start"> 
              <Picture className="productPicture" url={picURL} name={productName}></Picture> 
            </div>
            <div className="col-md-6 d-flex justify-content-center">
              <h5>{productName}</h5>
            </div>
            <div className="col-md-3 d-flex justify-content-end">
              <Picture className="brandPicture" url={brandURL} name={brandName}></Picture>
            </div>
          </div>
          <div className="row">
            <div className="col-md d-flex justify-content-center">
            <p>{productDescription}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md d-flex justify-content-end">
              <ProductPrice price={price}></ProductPrice>
            </div>
          </div>
          <div className="row">
            <div className="col-md">
              <ProductProgressbar quantity={quantity} remaining={remaining}></ProductProgressbar>
            </div>
            <div className="col-md d-flex justify-content-end">
              <WishlistButton productKey={productKey} userKey={userKey} wishlist={wishlist}></WishlistButton>
            </div>
          </div>
        </div>
      </div>
    )};
  }

  class Dropdown extends React.Component {    
    constructor(props){
      super(props);

      this.doOrderBy=this.doOrderBy.bind(this);
      this.doOrder=this.doOrder.bind(this);
    }

    doOrderBy(e){
      const newOrderBy = e.target.getAttribute('data-value');
      this.props.doOrderBy(newOrderBy);
    }
    doOrder(e){
      const newOrder = e.target.checked;
      this.props.doOrder(newOrder);
    }

    render() {   
      const { orderBy, order, doOrderBy, doOrder } = this.props;   
      const checked = <FontAwesomeIcon icon="check" />
      return (
        <div className="dropdown">
          <button className="btn btn-info dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Sort products 
            <span className="caret"></span>
          </button>
          <ul className="dropdown-menu">
          <h6 className="dropdown-header">Order by</h6>
            <li><button className="dropdown-item" onClick={ doOrderBy } data-value="price">Price {orderBy==="price" ? checked : null}</button></li>
            <li><button className="dropdown-item" onClick={ doOrderBy } data-value="remaining">In stock {orderBy==="remaining" ? checked : null}</button></li>
          
            <div className="dropdown-divider"></div>
            <h6 className="dropdown-header">Order</h6>
            <li><button className="dropdown-item" onClick={ doOrder } data-value="asc">ascendind {order==="asc" ? checked : null}</button></li>
            <li><button className="dropdown-item" onClick={ doOrder } data-value="desc">descending {order==="desc" ? checked : null}</button></li>
          </ul>
        </div>  
     )   
    }
  }


  class Filters extends React.Component{
    constructor(props){
      super(props);
      this.handleCategoryChange = this.handleCategoryChange.bind(this);
      this.handleAffordableChange = this.handleAffordableChange.bind(this);
      this.handleWishlistChange = this.handleWishlistChange.bind(this);
      this.doOrderBy=this.doOrderBy.bind(this);
      this.doOrder=this.doOrder.bind(this);
    }

    doOrderBy(e){
      const newOrderBy = e.target.getAttribute('data-value');
      this.props.doOrderBy(newOrderBy);
    }
    doOrder(e){
      const newOrder = e.target.getAttribute('data-value');
      this.props.doOrder(newOrder);
    }

    handleCategoryChange(e) {
      this.props.onCategoryChange(e);
    }
    handleAffordableChange(e){
      this.props.onAffordableChange(e);
    }
    handleWishlistChange(e){
      this.props.onWishlistChange(e);
    }

    render(){
      const rewardsType = ['Electronics', 'Shoes', 'Sports', 'Others', 'All'];
      const { orderBy, order, doOrderBy, doOrder } = this.props;
      const DropdownListStyle = {width:'80%'}

      return(
        <div className="container">
          <div className="row">
            <div className="col-md">
            <DropdownList data={rewardsType} onChange={this.handleCategoryChange} style={DropdownListStyle}
            value={this.props.categoryFilter} placeholder="Type of reward"/>
            </div>
            <div className="col-md">
              <Dropdown 
                doOrderBy={ doOrderBy }
                doOrder={ doOrder }
                orderBy={ orderBy }
                order={ order } />
            </div>           
            <div className="col-md">
            <section className="checkboxSection">              
              <input id='affordableChk' type='checkbox' onClick={this.handleAffordableChange}/>
              <label htmlFor='affordableChk'>
                <span></span>
                Show only affordable items
              </label>          
            </section>
            </div>
            <div className="col-md">
            <section className="checkboxSection">              
              <input id='wishlistChk' type='checkbox' onClick={this.handleWishlistChange}/>
              <label htmlFor='wishlistChk'>
                <span></span>
                Hide wishlist items
              </label>          
            </section>
            </div>
          </div>
        </div>
      );
    }
  }

  class ProductContainer extends React.Component{
    constructor(props){
      super(props);  
      this.state = { wishlist: [], companyProductList: [], sponsoredProductList: [] };
      this.subscriptions = [];
      this.isInWishlist = this.isInWishlist.bind(this);
      this.filterbyWishlist = this.filterbyWishlist.bind(this);
      this.userKey="";
    }
    componentWillReceiveProps(nextProps) {
      if (nextProps.user.key !== this.userKey) {
        this.userKey = nextProps.user.key;
        this.subscriptions.push(firebaseServices.getWishlist(this.userKey).subscribe(items =>{
          this.setState({wishlist: items});
          this.subscriptions.push(firebaseServices.getProducts("companyName", nextProps.user.company)
          .subscribe(products => this.setState({companyProductList: products})));
          this.subscriptions.push(firebaseServices.getProducts("sponsored", true)
          .subscribe(sponsoredProds => {
            this.setState({sponsoredProductList: sponsoredProds});
          }));
        }));
      }
    }
    componentWillUnmount(){
      this.subscriptions.forEach(obs => obs.unsubscribe());
    }
    isInWishlist(prod){
      if(this.state.wishlist.includes(prod.key)){
        return true;
      }
      return false;
    }
    filterbyCategory(str){
      return function(product){
        if(str && str!=='All'){
          
          return product.category.toLowerCase().includes(str.toLowerCase())
        }
        return true;
      }
    }
    filterbyAffordable(coins){
      return function(product){
        return product.price>coins ? 0 : 1;
      }
    }
    filterbyWishlist(prod){
      return !this.isInWishlist(prod);
    }
    sortbyPrice(a, b){
      return (a.price > b.price) ? 1 : ((a.price < b.price) ? -1 : 0);   
    }

    sortbyRemaining(a, b){
      return (a.remaining > b.remaining) ? 1 : ((a.remaining < b.remaining) ? -1 : 0);   
    }

    render(){
      const user = this.props.user;
      this.userKey = user.key;
      const userCoins = user.coins;
      var companyProducts = this.state.companyProductList;
      var sponsoredProducts = this.state.sponsoredProductList;
      var products = companyProducts.concat(sponsoredProducts);
      const wishlist = this.props.wishlist;
      if(this.props.affordableChecked){
        products = products.filter(this.filterbyAffordable(userCoins));
      }
      if(this.props.wishlistChecked){
        products = products.filter(this.filterbyWishlist);
      }
      products = products.filter(this.filterbyCategory(this.props.categoryFilter));

      if(this.props.orderBy==="price"){
        products = products.sort(this.sortbyPrice);
        if(this.props.order==="desc"){
          products = products.reverse();
        }
      }
      else{
        products=products.sort(this.sortbyRemaining);
        if(this.props.order==="desc"){
          products = products.reverse();
        }
      }

      const listProducts = products.map((product) =>
        <div className="col-md-4" key={product.key}>
          <Product product={product} user={user} wishlist={wishlist}></Product>
        </div>
      );
      return(
        <div className="container">
          <div className="row ">
            {listProducts}
          </div>
        </div>
      );
    }
  }

  export class Rewards extends React.Component{
    constructor(props){
      super(props);
      this.subscriptions = [];
      
      this.state = {
        categoryFilter: '',
        affordableChecked:false,
        wishlistChecked: false,
        orderBy: "price",
        order: "asc",
        wishlist:[],
        user: {
          name: '',
          coins: 0,
          company: '',
          doc:'',
          key: ''
        }
      };
      this.handleCategoryChange = this.handleCategoryChange.bind(this);
      this.handleAffordableChange = this.handleAffordableChange.bind(this);
      this.handleWishlistChange = this.handleWishlistChange.bind(this);
      this.doOrderBy = this.doOrderBy.bind(this);
      this.doOrder = this.doOrder.bind(this);
    }
    
    componentDidMount(){   
      this.subscriptions.push(firebaseServices.getUser("LXCYHelb75dWxPRZhhB5")
        .subscribe(user => this.setState({user: user})));
      
      this.subscriptions.push(firebaseServices.getWishlist("LXCYHelb75dWxPRZhhB5")
        .subscribe(items => this.setState({wishlist: items})));
    }
    componentWillUnmount(){
      this.subscriptions.forEach(obs => obs.unsubscribe());
    }

    doOrderBy(e){
      const newOrderBy = e.target.getAttribute('data-value');
      this.setState({orderBy : newOrderBy});
    }
    doOrder(e){
      const newOrder = e.target.getAttribute('data-value');
      this.setState({order : newOrder});
    }

    handleCategoryChange(e){
      this.setState({categoryFilter: e});
    }
    handleAffordableChange(e){
      this.setState({affordableChecked:e.target.checked})
    }
    handleWishlistChange(e){
      this.setState({wishlistChecked:e.target.checked})
    }
    addFirebaseData(){
      jsonProds.forEach(prod => firebaseServices.addProduct(prod));
    }

    render(){
      const categoryFilter = this.state.categoryFilter;
      const affordableChecked = this.state.affordableChecked;
      const wishlistChecked = this.state.wishlistChecked;

      const orderBy = this.state.orderBy;
      const order = this.state.order;
      const wishlist = this.state.wishlist;
      const user = this.state.user;
      const userCoins = user.coins;
      const userName = user.name;
      return(
        
        <div className="container">
        {<button className="btn btn-primary" type="button" onClick={this.addFirebaseData}>Add data to Firebase</button>}
        Hello, {userName}, you have {userCoins} Coins
          <Filters user={user} wishlist={wishlist}
            categoryFilter={categoryFilter} onCategoryChange={this.handleCategoryChange}
            affordableChecked={affordableChecked} onAffordableChange={this.handleAffordableChange}
            wishlistChecked={wishlistChecked} onWishlistChange={this.handleWishlistChange}
            doOrderBy={ this.doOrderBy } orderBy={ orderBy }
            doOrder={ this.doOrder } order={ order }>
            
          </Filters>
          <ProductContainer user={user} wishlist={wishlist}
            categoryFilter={categoryFilter}
            affordableChecked={affordableChecked}
            wishlistChecked={wishlistChecked}
            orderBy={ orderBy }
            order={ order }>
          </ProductContainer>
        </div>
      )
    }
  }
export default Rewards;
