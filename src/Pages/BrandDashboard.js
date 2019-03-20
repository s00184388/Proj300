import React, { Component } from "react";

import "./CssPages/BrandDashboard.css";
import FirebaseServices from "../firebase/services";
import { faArrowDown, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import Modal from "react-modal";
import BrandProductEditingModal from "../Components/editProductModal";

library.add(faArrowDown, faEdit);

//constant
const fs = new FirebaseServices();
Modal.setAppElement("#root");
//components

//component for rendering the "Add new product" form
class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      brandID: this.props.brand.key,
      category: "",
      description: "",
      name: "",
      picture: null,
      picURL: "",
      price: 0,
      stock: 0,
      sponsored: true,
      tresholdPercentage: 0,
      categoryOptions: ["Electronics", "Shoes", "Sports", "Others"]
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //when the component receives new props (first time rendering props received will be undefined/null)
  componentWillReceiveProps(nextProps) {
    if (nextProps.brand !== this.props.brand) {
      this.setState({ brandID: nextProps.brand.key });
    }
  }

  //method gets called when the input fields are changed
  handleChange = e => {
    let newState = {};
    newState[e.target.name] = e.target.value;
    if (e.target.name === "picture") {
      this.setState({
        picture: e.target.files[0]
      });
    } else {
      this.setState(newState);
    }
  };

  //input validation
  validate = () => {
    let errors = {};
    let formIsValid = true;

    if (!this.state.name) {
      formIsValid = false;
      errors["name"] = "*Please enter the product's name";
    }

    if (!this.state.description) {
      formIsValid = false;
      errors["description"] = "*Please enter the product's description";
    }

    if (!this.state.stock) {
      formIsValid = false;
      errors["stock"] = "*Quantity cannot be empty";
    }

    if (!this.state.price) {
      formIsValid = false;
      errors["price"] = "*Price field cannot be empty";
    }

    if (!this.state.category) {
      formIsValid = false;
      errors["category"] = "*Please choose a category!";
    }

    this.setState({
      errors: errors
    });
    //console.log(this.state.errors);

    return formIsValid;
  };

  //method called on clicking the submit button
  handleSubmit = e => {
    e.preventDefault();
    let product = {
      brandID: this.state.brandID,
      category: this.state.category.toLowerCase(),
      description: this.state.description,
      name: this.state.name,
      picture: this.state.picture,
      picURL: this.state.picURL,
      price: this.state.price,
      stock: this.state.stock,
      sponsored: true,
      tresholdPercentage: this.state.tresholdPercentage / 100
    };

    //console.log(this.validate());
    //console.log(product);
    if (this.validate()) {
      //adding the product to the database
      fs.addProduct(product);

      //calling the "show alert" method from the base component
      this.props.showAlert(
        "success",
        "Product has been added to the brand",
        "Update"
      );

      this.setState({
        newState: "",
        errors: "",
        brandID: "",
        category: "",
        picture: null,
        picURL: "",
        sponsored: true,
        tresholdPercentage: 0
      });
    }

    //console.log(product);
  };

  render() {
    const categories = ["Electronics", "Shoes", "Sports", "Others"];
    const options = categories.map(opt => <option key={opt}>{opt}</option>);
    return (
      <div className="pt-5">
        <h5 className="text-white"> Add Product</h5>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="form-group input-group-sm col-sm-6">
              <label htmlFor="formName" className="text-white">
                Product Name:
              </label>
              <input
                id="formName"
                className="form-control"
                name="name"
                type="text"
                placeholder="Enter Product Name"
                onChange={this.handleChange}
                value={this.state.name || ""}
              />
              <div className="text-white">
                <small>{this.state.errors.name}</small>
              </div>
            </div>
            <div className="form-group input-group-sm col-sm-6">
              <label htmlFor="categoryList" className="text-white">
                Product Category:
              </label>
              <select
                id="categoryList"
                name="category"
                className="form-control input-form-sm"
                defaultValue=""
                onChange={this.handleChange}
              >
                <option value="" disabled hidden>
                  Select a category
                </option>
                {options}
              </select>
              <div className="text-white">
                <small>{this.state.errors.category}</small>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="formDescription" className="text-white">
              Product Description:
            </label>
            <textarea
              rows="2"
              id="formDescription"
              className="form-control"
              name="description"
              type="text"
              placeholder="Enter Product Description"
              onChange={this.handleChange}
              value={this.state.description || ""}
            />
            <div className="text-white">
              <small>{this.state.errors.description}</small>
            </div>
          </div>

          <div className="form-group input-group-sm">
            <label htmlFor="formPicture" className="text-white">
              Product Image:
            </label>
            <input
              id="formPicture"
              className="form-control"
              name="picture"
              type="file"
              accept="image/png,image/jpeg"
              onChange={this.handleChange}
            />
            <div className="text-white">
              <small>{this.state.errors.picture}</small>
            </div>
          </div>
          <div className="row">
            <div className="form-group input-group-sm col-sm-6">
              <label htmlFor="formPrice" className="text-white">
                Product Price:
              </label>
              <input
                id="formPrice"
                className="form-control"
                name="price"
                type="number"
                placeholder="Enter Product Price"
                onChange={this.handleChange}
                value={this.state.price || ""}
              />
              <div className="text-white">
                <small>{this.state.errors.price}</small>
              </div>
            </div>

            <div className="form-group input-group-sm col-sm-6">
              <label htmlFor="formStock" className="text-white">
                Product Stock:
              </label>
              <input
                id="formStock"
                className="form-control"
                name="stock"
                type="number"
                placeholder="Enter Product Stock"
                onChange={this.handleChange}
                value={this.state.stock || ""}
              />
              <div className="text-white">
                <small>{this.state.errors.stock}</small>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-warning btn-sm text-white"
              id="formSubmit"
              type="submit"
              onClick={this.handleSubmit}
            >
              Submit Product
            </button>
          </div>
        </form>
      </div>
    );
  }
}

class TableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.deleteItem = this.deleteItem.bind(this);
  }

  showModal = e => {
    //console.log("key = " + e.key);
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  deleteItem(key) {
    fs.deleteItemFromDashboard(key);
    //console.log("deleting item : " + key);
  }

  render() {
    const row = this.props.row;
    const index = this.props.index;
    // const edit = this.props.row.edit;

    return (
      <tr>
        <td key={index}>{index}</td>
        <td key={row.name}>{row.name}</td>
        <td key={row.price}>{row.price}</td>
        <td key={row.key}>{row.stock}</td>
        <td>
          <button
            className="btn btn-warning btn-sm"
            onClick={() => {
              this.showModal(row);
            }}
          >
            <FontAwesomeIcon icon="edit" />
          </button>
          <Modal
            isOpen={this.state.show}
            onRequestClose={this.hideModal}
            shouldCloseOnOverlayClick={true}
          >
            <div>
              <BrandProductEditingModal
                product={row}
                _key={row.key}
                _show={this.hideModal}
              />
            </div>
            <a href="#" className="closeButton" onClick={this.hideModal} />
          </Modal>
        </td>
        <td>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => this.deleteItem(row.key)}
          >
            <FontAwesomeIcon icon="trash" />
          </button>
        </td>
      </tr>
    );
  }
}

class BrandInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
    this.productsSubscr = [];
  }
  componentWillReceiveProps(nextProps) {
    this.productsSubscr.push(
      fs
        .getBrandedProducts("brandID", nextProps.brand.key)
        .subscribe(prods => this.setState({ products: prods }))
    );
  }

  componentWillUnmount() {
    this.productsSubscr.forEach(obs => obs.unsubscribe());
  }

  render() {
    const products = this.state.products;
    const productsList = products.map((prod, index) => (
      <TableRow row={prod} index={++index} key={prod.key} />
    ));
    return (
      <div className="container pt-5">
        <h5 className="text-white">Product List</h5>
        <hr />
        <table className="table table-striped table-sm table-light table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{productsList}</tbody>
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
      brand: {
        adminUserID: "",
        name: "",
        picture: "",
        address: "",
        email: "",
        description: ""
      },
      isEditing: false,
      brandID: this.props.brandID
    };
    this.showAlert = this.showAlert.bind(this);
  }

  //calling the "Show alert" method defined in the App component
  showAlert(type, message, headline) {
    this.props.showAlert(type, message, headline);
  }

  componentDidMount() {
    this.subscriptions.push(
      fs.getBrand(this.state.brandID).subscribe(brand => {
        this.setState({ brand: brand });
      })
    );
  }

  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }

  render() {
    return (
      <div className="container">
        <h4 className="text-white text-center">
          <strong>{this.state.brand.name}</strong> Dashboard{" "}
        </h4>
        <div className="row">
          <div className="col-sm-6">
            <ProductForm brand={this.state.brand} showAlert={this.showAlert} />
          </div>
          <div className="col-sm-6">
            <BrandInfo brand={this.state.brand} />
          </div>
        </div>
      </div>
    );
  }
}
export default BrandDashboard;
