import React, { Component } from "react";
import "./CssPages/CompanyDashboard.css";
import FirebaseServices from "../firebase/services";
import { faArrowDown, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Alert, AlertContainer } from "react-bs-notifier";
import Modal from "react-modal";
import BrandProductEditingModal from "../Components/editProductModal";

library.add(faArrowDown, faEdit);

//constant
const fs = new FirebaseServices();

//components
class ProductForm extends Component {
  constructor() {
    super();
    this.state = {
      fields: {},
      errors: {},
      picture: null,
      picURL: "",
      sponsored: false,
      stock: 0,
      price: 0,
      tresholdPercentage: 0,
      companyID: "",
      description: "",
      name: "",
      category: "",
      categoryOptions: ["Electronics", "Shoes", "Sports", "Others"],
      showingAlert: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = e => {
    let fields = this.state.fields;
    if ([e.target.name] == "picture") {
      this.setState({
        picture: e.target.files[0]
      });
      console.log(e.target.files[0]);
    }
    fields[e.target.name] = e.target.value;
    this.setState({ fields });
    console.log(this.state.fields);
  };

  validate = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "*Please enter the product's name";
    }

    if (!fields["description"]) {
      formIsValid = false;
      errors["description"] = "*Please enter the product's description";
    }

    if (!fields["quantity"]) {
      formIsValid = false;
      errors["quantity"] = "*Quantity cannot be empty";
    }

    if (!fields["price"]) {
      formIsValid = false;
      errors["price"] = "*Price field cannot be empty";
    }

    if (!fields["category"]) {
      formIsValid = false;
      errors["category"] = "*Please choose a category!";
    }

    if (!fields["picture"]) {
      formIsValid = false;
      errors["picture"] = "*Please use a picture";
    }

    this.setState(
      {
        errors: errors
      },
      () => {
        console.log(this.state.errors);
      }
    );

    return formIsValid;
  };

  handleSubmit = e => {
    e.preventDefault();

    let fields = {};

    fields["name"] = this.state.fields.name;
    fields["description"] = this.state.fields.description;
    fields["quantity"] = this.state.fields.quantity;
    fields["price"] = this.state.fields.price;
    fields["category"] = this.state.fields.category;

    let product = {
      name: fields["name"],
      description: fields["description"],
      picture: this.state.picture,
      picURL: this.state.picURL,
      stock: fields["quantity"],
      price: fields["price"],
      category: this.state.fields.category,
      sponsored: false,
      companyID: this.props.companyID,
      tresholdPercentage: this.state.tresholdPercentage
    };

    console.log(this.validate());
    if (this.validate()) {
      fs.addProduct(product);
      this.setState({
        fields: "",
        errors: "",
        showingAlert: true
      });
      setTimeout(() => {
        this.setState({
          showingAlert: false
        });
      }, 5000);
      console.log(product);
    }
  };

  render() {
    const categories = ["Electronics", "Shoes", "Sports", "Others"];
    const { name, description, picURL } = this.state.fields;
    const options = categories.map(opt => <option key={opt}>{opt}</option>);
    return (
      <div className="container">
        {this.state.showingAlert === true ? (
          <AlertContainer>
            <Alert type="success" headline="Success!">
              <strong>You're product has been added!</strong>
            </Alert>
          </AlertContainer>
        ) : null}
        <h6 className="text-white">Add a Product: </h6>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="form-group input-group-sm col-sm-6">
              <select
                id="categoryList"
                name="category"
                className="form-control"
                defaultValue=""
                onChange={this.handleChange}
              >
                <option value="" disabled hidden>
                  Product Category
                </option>
                {options}
              </select>
              <div className="text-white">
                <small>{this.state.errors.category}</small>
              </div>
            </div>
            <div className="form-group input-group-sm col-sm-6">
              <input
                id="formName"
                className="form-control col-sm-12"
                name="name"
                type="text"
                placeholder="Product Name"
                onChange={this.handleChange}
                value={name || ""}
              />
              <div className="text-white">
                <small>{this.state.errors.name}</small>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-group input-group-sm col-sm-12">
              <input
                id="formDescription"
                className="form-control col-sm-12"
                name="description"
                type="text"
                placeholder="Product Description"
                onChange={this.handleChange}
                value={description || ""}
              />
              <div className="text-white">
                <small>{this.state.errors.description}</small>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-group input-group-sm col-sm-12">
              <input
                id="formPicture"
                className="form-control col-sm-12"
                name="picture"
                type="file"
                accept="image/jpeg, image/png"
                onChange={this.handleChange}
              />
              <div className="text-white">
                <small>{this.state.errors.picURL}</small>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-group input-group-sm col-sm-6">
              <label htmlFor="formPrice" className="text-white">
                <small>Product Price</small>
              </label>
              <input
                id="formPrice"
                className="form-control"
                name="price"
                type="number"
                placeholder="Enter Product Price"
                onChange={this.handleChange}
                value={this.state.fields.price || ""}
              />
              <div className="text-white">
                <small>{this.state.errors.price}</small>
              </div>
            </div>
            <div className="form-group input-group-sm col-sm-6">
              <label htmlFor="formQuantity" className="text-white">
                <small>Product Quantity</small>
              </label>
              <input
                id="formQuantity"
                className="form-control"
                name="quantity"
                type="number"
                placeholder="Enter Product Quantity"
                onChange={this.handleChange}
                value={this.state.fields.quantity || ""}
              />
              <div className="text-white">
                <small>{this.state.errors.quantity}</small>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center pt-3">
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
    this.setEditProduct = this.setEditProduct.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  showModal = e => {
    console.log("key = " + e.key);
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  setEditProduct(e) {
    //const ep = this.state.editProduct

    this.state.editProduct = {
      companyID: e.companyID,
      category: e.category,
      description: e.description,
      name: e.name,
      picture: e.picture,
      price: e.price,
      stock: e.stock,
      sponsored: false,
      tresholdPercentage: e.tresholdPercentage
    };
    this.state.isEditing = this.state.isEditing;
    //this.setState(state => ({isEditing : true}));
    console.log(e.key);
    fs.updateProduct(this.state.editProduct, e.key);
  }

  deleteItem(key) {
    fs.deleteItemFromDashboard(key);
    console.log("deleting item : " + key);
  }

  render() {
    const row = this.props.row;
    const index = this.props.index;
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

class CompanyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
    this.subscriptions = [];
  }

  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.company !== nextProps.company) {
      this.subscriptions.push(
        fs
          .getProducts("companyID", nextProps.company.key)
          .subscribe(employees => this.setState({ products: employees }))
      );
    }
  }

  render() {
    const products = this.state.products;
    const productsList = products.map((prod, index) => (
      <TableRow row={prod} index={++index} key={prod.key} />
    ));
    return (
      <div className="container">
        <h6 className="text-white">Products List</h6>
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

export class CompanyDashboard extends Component {
  constructor(props) {
    super(props);
    this.subscriptions = [];
    this.state = {
      company: {}
    };
  }

  componentDidMount() {
    if (this.props.companyID) {
      this.subscriptions.push(
        fs.getCompany(this.props.companyID).subscribe(company => {
          this.setState({
            company
          });
        })
      );
    }
  }
  componentWillUnmount() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  render() {
    return (
      <div className="container">
        <h4 className="text-center text-white py-3">
          {" "}
          <strong>{this.state.company.name}</strong> Dashboard{" "}
        </h4>
        <div className="row">
          <div className="col-lg-6">
            <ProductForm
              companyName={this.state.company.name}
              companyID={this.props.companyID}
            />
          </div>
          <div className="col-lg-6">
            <CompanyInfo company={this.state.company} />
          </div>
        </div>
      </div>
    );
  }
}

export default CompanyDashboard;
