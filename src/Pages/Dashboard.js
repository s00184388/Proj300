import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CssPages/Dashboard.css";

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
      name: '',
      description: '',
      picURL: '',
      quantity: 0,
      price: 0,
      category: "",

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
      pName: this.state.name,
      pDescription: this.state.description,
      pPicURL: this.state.picURL,
      pQuantity: this.state.quantity,
      pPrice: this.state.price,
      pCategory: this.state.category
    }

    console.log(product);
  }

  render() {
    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <input id="formName" className="form-control" name="name" type="text"
          onChange={this.handleChange} value={this.state.name} />
        <input id="formSubmit" className="button" type="submit" placeholder="Submit product"/>
      </form>
    )
  }
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
          <ProductForm />
        </div>
      </div>
    )
  }
}

export default Dashboard;
