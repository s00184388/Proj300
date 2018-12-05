import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CssPages/Dashboard.css";
import FirebaseServices from '../firebase/services';

//constant
const fs = new FirebaseServices();
//components
class FormLabel extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <label htmlFor={this.props.htmlFor}>
        {this.props.title}
      </label>
    )
  }
}

class ProductForm extends Component {
  constructor() {
    super()

    this.state = {
      //brand fields will be converted into brand object on submit
      brandName: '',
      brandPic: '',
      name: '',
      description: '',
      picURL: '',
      quantity: 0,
      price: 0,
      remaining: 0,
      category: '',

      categoryOptions: ['Clothing', 'Electronics', 'Other']
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange = e => {
    let newState = {}
    newState[e.target.name] = e.target.value
    this.setState(newState)
  }

  handleSubmit = (e, message) => {
    e.preventDefault()

    let product = {
      brand: {
        name: this.state.brandName,
        picURL: this.state.brandPic
      },
      name: this.state.name,
      description: this.state.description,
      picURL: this.state.picURL,
      quantity: this.state.quantity,
      price: this.state.price,
      remaining: this.state.quantity,
      category: this.state.category
    }

    fs.addProduct(product);
    console.log(product);

    this.state = {
      brand: {
        name: '',
        picURL: ''
      },
      name: '',
      description: '',
      picURL: '',
      quantity: 0,
      price: 0,
      remaining: 0,
      category: ''
    }
  }

  render() {
    return (

      <form className="formRowContainer" onSubmit={this.handleSubmit}>
      <div className="form-group-row">
        <label  className="col-form-label row" >Brand Name: 
          <input id="formBrandName" className="form-control" name="brandName" type="text" placeholder="Enter Brand Name"
            onChange={this.handleChange} value={this.state.brandName} />
        </label>
        <label className="col-form-label row">Brand Image:
          <input id="formBrandPic" className="form-control" name="brandPic" type="text" placeholder="Enter Brand Image URL (e.g. https://)"
            onChange={this.handleChange} value={this.state.brandPic} />
        </label>
        <label className="col-form-label row">Product Name:
          <input id="formName" className="form-control" name="name" type="text" placeholder="Enter Product Name"
            onChange={this.handleChange} value={this.state.name} />
        </label>
        <label className="col-form-label row">Product Description:
          <input id="formDescription" className="form-control" name="description" type="text" placeholder="Enter Product Description"
            onChange={this.handleChange} value={this.state.description} />
        </label>
        <label className="col-form-label row">Product Image:
          <input id="formPicture" className="form-control" name="picURL" type="text" placeholder="Enter Product Image URL (e.g. https://)"
            onChange={this.handleChange} value={this.state.picURL} />
        </label>
        <label className="col-form-label row">Product Price:
          <input id="formPrice" className="form-control" name="price" type="number" placeholder="Enter Product Price"
            onChange={this.handleChange} value={this.state.price} />
        </label>
        <label className="col-form-label row">Product Quantity:
          <input id="formQuantity" className="form-control" name="quantity" type="number" placeholder="Enter Product Quantity"
            onChange={this.handleChange} value={this.state.quantity} />
        </label>
        <label className="col-form-label row">Product Category:
          <select id="formCategory" className="form-control" name="category" placeholder="Please Select a Category"
            onChange={this.handleChange} value={this.state.category}>
            <option value="" disabled selected >Select a Category</option>
            <option value="sports">Clothing</option>
            <option value="electronics">Electronics</option>
            <option value="shoes">Shoes</option>
            <option value="other">Other</option>
          </select>
        </label>
        <input id="formSubmit" className="button" type="submit" placeholder="Submit product" />
        </div>
      </form>

    )
  }
}


export class CompanyInfo extends Component {
  render() {
    return (
      <div className="jumbotron">
        <h6 className="text-center">This is the Dashboard Component! </h6>
        <p className="text-center">
          This is how you build a website with React and React-Router
        </p>
        <p className="text-center">This page is for Ryan!</p>
        <Link to="/">
          <button className="btn btn-sm btn-primary">Go Home</button>
        </Link>
      </div>
    )
  }
}



export class Dashboard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="">
        <div className="">
          <CompanyInfo />
          <div className="container panel">
            <div className="row d-flex justify-content-center">
              <div className="">
                <ProductForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Dashboard;
