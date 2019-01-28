import React, { Component } from "react";
import { Link } from "react-router-dom";
import { DropdownList } from 'react-widgets'
import "./CssPages/CompanyDashboard.css";
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
        name: this.state.brandName,
        picURL: this.state.brandPic
      },
      name: this.state.name,
      description: this.state.description,
      picURL: this.state.picURL,
      quantity: this.state.quantity,
      price: this.state.price,
      remaining: this.state.quantity,
      category: this.state.category,
      sponsored: false,
      companyName: this.props.company.name
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

class TableRow extends Component{
  render(){
    const row = this.props.row;
    const index = this.props.index;
    return(
      <tr>
        <td key={index}>{index}</td>
        <td key={row.name}>{row.name}</td>
        <td key={row.coins}>{row.coins}</td>
      </tr>
    );
  }
}

class CompanyInfo extends Component {
  constructor(props){
    super(props);
    this.state={
      employees: []
    }
  }

  componentDidMount(){
    this.employeesSubscr = fs.getEmployees(this.props.company.name)
    .subscribe(employees=>this.setState({employees: employees}));
  }
  componentWillUnmount(){
    this.employeesSubscr.unsubscribe();
  }
  render() {
    const companyName = this.props.company.name;
    const employees = this.state.employees;
    const employeesList = employees.map((emp, index) => 
      <TableRow row={emp} index={++index} key={emp.key}/>
    );
    return(
      <div className="infoContainer">
        <h2 className="text-center py-5"> <strong>{companyName}</strong> Dashboard </h2>
        <h4>Employee list</h4>
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Coins <FontAwesomeIcon icon="arrow-down"/></th>
            </tr>
          </thead>
          <tbody>
            {employeesList}
          </tbody>
        </table>
      </div>
    );
  }
}

export class CompanyDashboard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md">
            <ProductForm company={{name: 'Overstock'}}/>
          </div>
          <div className="col-md">
            <CompanyInfo company={{name: 'Overstock'}}/>
          </div>
        </div>
      </div>
    );
  }
}

export default CompanyDashboard;
