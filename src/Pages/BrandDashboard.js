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
      brandID : '',
      category : '',
      companyID : '',
      description : '',
      name : '',
      picture : '',
      price : 0,
      stock : 0,
      sponsored : true,
      tresholdPercentage: 0,

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
      brandID : this.props.brand.key,
      category : this.state.category.toLowerCase(),
      description : this.state.description,
      name : this.state.name,
      picture : this.state.picture,
      price : this.state.price,
      stock : this.state.stock,
      sponsored : true,
      tresholdPercentage: this.state.tresholdPercentage/100
    };

    fs.addProduct(product);
    console.log(product);

    this.setState({
      brandID : '',
      category : '',
      companyID : '',
      description : '',
      name : '',
      picture : '',
      price : 0,
      stock : 0,
      sponsored : true,
      tresholdPercentage: 0
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
            <select id="categoryList" name="category" className="form-control" defaultValue="" onChange={this.handleChange}>
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
            name="picture"
            type="text"
            placeholder="Enter Product Image URL (e.g. https://)"
            onChange={this.handleChange}
            value={this.state.picture}
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
          <label htmlFor="formStock">
            Product Stock:
          </label>
          <input
            id="formStock"
            className="form-control"
            name="stock"
            type="number"
            placeholder="Enter Product Stock"
            onChange={this.handleChange}
            value={this.state.stock}
          />
        </div>
        <div className="form-group">
          <label htmlFor="formTreshold">
            Treshold Percentage:
          </label>
          <input
            id="formTreshold"
            className="form-control"
            name="tresholdPercentage"
            type="number"
            placeholder="Enter Treshold Percentage in %"
            onChange={this.handleChange}
            value={this.state.tresholdPercentage}
          />
        </div>
          <button className="btn btn-primary" id="formSubmit" type="submit" onClick={this.handleSubmit}>
            Submit Product
          </button>
      </form>
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
        <td key={row.key}>{row.stock}</td>
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
    this.productsSubscr = [];
  }

  componentWillReceiveProps(nextProps){
    this.productsSubscr = fs
    .getBrandedProducts("brandID", nextProps.brand.key)
    .subscribe(prods=>this.setState({products: prods}));
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
    this.subscriptions = [];
    this.state = {
      brand : {
        adminUserID : '',
        name : '',
        picture : '',
        address : '',
        phoneNumber : '',
        email : '',
        description : ''
    }};
  }

  componentDidMount(){
    this.subscriptions.push(fs.getBrand("E5IOEBDEWqT9NFyhDZ5n")
    .subscribe(brand=>{
      this.setState({brand: brand});
    }));
  }

  componentWillUnmount(){
    this.subscriptions.forEach(obs=>obs.unsubscribe());
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md">
            <ProductForm brand={this.state.brand}/>
          </div>
          <div className="col-md">
            <BrandInfo brand={this.state.brand}/>
          </div>
        </div>
      </div>
    );
  }
}

export default BrandDashboard;
