import React, { Component } from "react";
import { Link } from "react-router-dom";
import { DropdownList } from 'react-widgets'
import "./CssPages/BrandDashboard.css";
import FirebaseServices from "../firebase/services";
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faArrowDown);

//constant
const fs = new FirebaseServices();
//components

class ProductForm extends Component {
  constructor() {
    super();

    this.state = {
      //brand fields will be converted into brand object on submit
      brandName: "",
      brandPic: "",
      name: "",
      description: "",
      picURL: "",
      quantity: 0,
      price: 0,
      remaining: 0,
      category: "",

      categoryOptions: ['Electronics', 'Shoes', 'Sports', 'Others']
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = e => {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  handleSubmit = (e, message) => {
    e.preventDefault();

    let product = {
      brand: {
        name: this.props.brand.name,
        picURL: this.props.brand.picURL
      },
      name: this.state.name,
      description: this.state.description,
      picURL: this.state.picURL,
      quantity: this.state.quantity,
      price: this.state.price,
      remaining: this.state.quantity,
      category: this.state.category,
      sponsored: true,
      companyName: this.props.brand.name
    };

    fs.addProduct(product);
    console.log(product);

    this.setState({
      brand: {
        name: "",
        picURL: ""
      },
      name: "",
      description: "",
      picURL: "",
      quantity: 0,
      price: 0,
      remaining: 0,
      category: ""
    });
  };

  render() {
    const categories = ['Electronics', 'Shoes', 'Sports', 'Others'];
    const options = categories.map(opt=>
      <option key={opt}>{opt}</option>)
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="categoryList">
            Product Category:
          </label>
            <select id="categoryList" name="category" className="form-control" defaultValue="">
              <option value="" disabled hidden>Select a category</option>
              {options}
            </select>
        </div>
        <div className="form-group">
          <label htmlFor="formName">
            Product Name:
          </label>
          <input
            id="formName"
            className="form-control"
            name="name"
            type="text"
            placeholder="Enter Product Name"
            onChange={this.handleChange}
            value={this.state.name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="formDescription">
            Product Description:
          </label>
          <input
            id="formDescription"
            className="form-control"
            name="description"
            type="text"
            placeholder="Enter Product Description"
            onChange={this.handleChange}
            value={this.state.description}
          />
        </div>
        <div className="form-group">
          <label htmlFor="formPicture">
            Product Image:
          </label>
          <input
            id="formPicture"
            className="form-control"
            name="picURL"
            type="text"
            placeholder="Enter Product Image URL (e.g. https://)"
            onChange={this.handleChange}
            value={this.state.picURL}
          />
        </div>
        <div className="form-group">
          <label htmlFor="formPrice">
            Product Price:
          </label>
          <input
            id="formPrice"
            className="form-control"
            name="price"
            type="number"
            placeholder="Enter Product Price"
            onChange={this.handleChange}
            value={this.state.price}
          />
        </div>
        <div className="form-group">
          <label htmlFor="formQuantity">
            Product Quantity:
          </label>
          <input
            id="formQuantity"
            className="form-control"
            name="quantity"
            type="number"
            placeholder="Enter Product Quantity"
            onChange={this.handleChange}
            value={this.state.quantity}
          />
        </div>
          <button className="btn btn-primary" id="formSubmit" type="submit" onClick={this.handleSubmit}>
            Submit Product
          </button>
      </form>
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

class TableRow extends Component{
  render(){
    const row = this.props.row;
    const index = this.props.index;
    return(
      <tr>
        <td key={index}>{index}</td>
        <td key={row.name}>{row.name}</td>
        <td key={row.price}>{row.price}</td>
        <td key={row.key}><ProductProgressbar quantity={row.quantity} remaining={row.remaining} /></td>
      </tr>
    );
  }
}

class BrandInfo extends Component {
  constructor(props){
    super(props);
    this.state={
      products: []
    }
  }

  componentDidMount(){
    this.productsSubscr = fs.
    getBrandedProducts("brand.name", this.props.brand.name).subscribe(prods=>this.setState({products: prods}));
  }
  componentWillUnmount(){
    this.productsSubscr.unsubscribe();
  }
  render() {
    const brandName = this.props.brand.name;
    const products = this.state.products;
    const productsList = products.map((prod, index) => 
      <TableRow row={prod} index={++index} key={prod.key}/>
    );
    return(
      <div className="infoContainer">
        <h2 className="text-center py-5"> <strong>{brandName}</strong> Dashboard </h2>
        <h4>Products list</h4>
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {productsList}
          </tbody>
        </table>
      </div>
    );
  }
}

export class BrandDashboard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md">
            <ProductForm brand={{name: 'FitBit', picURL: 'https://vignette.wikia.nocookie.net/logopedia/images/0/0a/Fitbit_logo_2016.svg/revision/latest?cb=20160108000300'}}/>
          </div>
          <div className="col-md">
            <BrandInfo brand={{name: 'FitBit', picURL: 'https://vignette.wikia.nocookie.net/logopedia/images/0/0a/Fitbit_logo_2016.svg/revision/latest?cb=20160108000300'}}/>
          </div>
        </div>
      </div>
    );
  }
}

export default BrandDashboard;
