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
      brandID : '',
      category : '',
      companyID : '',
      description : '',
      name : '',
      picture : '',
      price : 0,
      stock : 0,
      sponsored : false,
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
      brandID : this.state.brandID,
      category : this.state.category,
      companyID : this.state.companyID,
      description : this.state.description,
      name : this.state.name,
      picture : this.state.picture,
      price : this.state.price,
      stock : this.state.stock,
      sponsored : false,
      tresholdPercentage: this.state.tresholdPercentage
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
    this.employeesSubscr = fs.getCompanyEmployees(this.props.company.name)
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
