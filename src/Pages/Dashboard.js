import React, { Component } from "react";
import { Link } from "react-router-dom";
import { DropdownList } from 'react-widgets'
import "./CssPages/Dashboard.css";
import FirebaseServices from "../firebase/services";

//constant
const fs = new FirebaseServices();
//components
class FormLabel extends Component {
  constructor() {
    super();
  }

  render() {
    return <label htmlFor={this.props.htmlFor}>{this.props.title}</label>;
  }
}

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
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="formBrandName">
            Brand Name:
          </label>
          <input
            id="formBrandName"
            className="form-control"
            name="brandName"
            type="text"
            placeholder="Enter Brand Name"
            onChange={this.handleChange}
            value={this.state.brandName}
          />
        </div>
        <div className="form-group">
          <label htmlFor="formBrandPic">
            Brand Image:
          </label>
          <input
            id="formBrandPic"
            className="form-control"
            name="brandPic"
            type="text"
            placeholder="Enter Brand Image URL (e.g. https://)"
            onChange={this.handleChange}
            value={this.state.brandPic}
          />
        </div>
        <div className="form-group">
          <label htmlFor="categoryList">
            Product Category:
          </label>
          <DropdownList id="categoryList" data={categories} onChange={this.handleChange}
            value={this.state.category} placeholder="Select a category"/>
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
        <Link to="/rewards">
          <button className="btn btn-primary" id="formSubmit" type="submit">
            Submit Product
          </button>
        </Link>
      </form>
    );
  }
}

export class CompanyInfo extends Component {
  render() {
    return <h4 className="text-center py-5"> Company Dashboard </h4>;
  }
}

export class Dashboard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md">
            <ProductForm/>
          </div>
          <div className="col-md">
            <CompanyInfo/>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
