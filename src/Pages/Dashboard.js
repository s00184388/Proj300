import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CssPages/Dashboard.css";

const Select = (props) => {
  return (
    <div className="form-group">
      <label htmlFor={props.name}> {props.title} </label>
      <select
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
      >
        <option value="" disabled>{props.placeholder}</option>
        {props.options.map(option => {
          return (
            <option
              key={option}
              value={option}
              label={option}>{option}
            </option>
          );
        })}
      </select>
    </div>)
}

const Input = (props) => {
  return (
    <div className="form-group">
      <label htmlFor={props.name} className="form-label">{props.title}</label>
      <input
        className="form-input"
        id={props.name}
        name={props.name}
        type={props.type}
        value={props.value}
        onChange={props.handleChange}
        placeholder={props.placeholder}
      />
    </div>
  )
}

const Button = (props) => {
  console.log(props.style);
  return (
    <button
      style={props.style}
      onClick={props.action}>
      {props.title}
    </button>)
}

export class BrandInfo extends Component {
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
    );
  }
}

export class CreateProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newProduct: {

        "name": "",
        "description": "",
        "picURL": "",
        "brand": {
          "name": "",
          "picURL": ""
        },
        "quantity": 0,
        "remaining": 0,
        "price": 0,
        "category": ""

      },
      categoryArray: ['Clothing', 'Electronics', 'Other']
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(prevState => {
      return {
        newProduct: {
          ...prevState.newProduct, [name]: value
        }
      }, () => console.log(this.state.newProduct)
    })
  }

  onSubmit(e) {
    let p = this.state.newProduct;

    console.log(p);
  }
  render() {
    return (
      <form className="container" onSubmit={this.onSubmit}>
        <label for="name" className="row">
          Name
          <Input className="formRow"
            name={'name'}
            value={this.state.newProduct.name}
            placeholder={'Enter Product Name'}
            handleChange={this.handleInput} />
        </label>
        <label for="description" className="row">
          Description
          <Input className="formRow" 
            name={'description'}
            value={this.state.newProduct.description}
            placeholder={'Enter Product Description'}
            handleChange={this.handleInput} />
        </label>
        <label for="picURL" className="row">
          Image
          <Input className="formRow" 
            name={'picURL'}
            value={this.state.newProduct.picURL}
            placeholder={'Enter Product Image URL'}
            handleChange={this.handleInput} />
        </label>
        <label for="quantity" className="row">
          Quantity
          <Input className="formRow"
            name={'name'}
            value={this.state.newProduct.name}
            placeholder={'Enter Product Name'}
            handleChange={this.handleInput} />
        </label>
        <label for="price" className="row">
          Price
          <Input className="formRow"
            name={'name'}
            value={this.state.newProduct.name}
            placeholder={'Enter Product Name'}
            handleChange={this.handleInput} />
        </label>
        <label for="category" className="row">
          Category
          <Select className="formRow"
            name={'category'}
            options={this.state.categoryArray}
            value={this.state.newProduct.category}
            placeholder={'Select Category'}
            handleChange={this.handleInput}
          />
        </label>
        <Button onClick={this.onSubmit()}
          title={'Create Product'} />
      </form>
    )
  }
}

export class Dashboard extends Component {
  constructor(props) {
    super(props);


  }
  render() {
    return (
      <div>
        <BrandInfo />
        <div>
          <CreateProduct />
        </div>
      </div>
    )
  }
}

export default Dashboard;
