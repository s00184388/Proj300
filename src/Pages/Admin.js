import React, { Component } from "react";
import "./CssPages/Admin.css";
import FirebaseServices from "../firebase/services";
import Modal from "react-modal";
import ReactLoading from "react-loading";

Modal.setAppElement("#root");

const firebaseServices = new FirebaseServices();

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "30%",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

class TableRowProducts extends Component {
  constructor(props) {
    super(props);
    const row = this.props.row;
    this.state = {
      modalIsOpen: false,
      product: {
        name: row.name,
        price: row.price,
        sponsored: row.sponsored,
        stock: row.stock,
        tresholdPercentage: row.tresholdPercentage,
        description: row.description,
        companyID: row.companyID,
        picture: row.picture,
        category: row.category
      }
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  handleChange(e) {
    var product = {};
    product = { ...this.state.product };
    product[e.target.name] = e.target.value;
    this.setState({ product });
  }

  submitEdit(e) {
    e.preventDefault();
    this.closeModal();
    console.log(this.state.product);
    firebaseServices.productsCollection
      .doc(this.props.row.key)
      .update(this.state.product);
  }

  deleteProduct(e) {
    e.preventDefault();
    this.closeModal();
    firebaseServices.productsCollection.doc(this.props.row.key).delete();
  }

  render() {
    const row = this.props.row;
    return (
      <tr key={`${row}`}>
        <td key={`${row.key}`}>{row.key}</td>
        <td key={`${row.key}name`}>{row.name}</td>
        <td key={`${row.key}price`}>{row.price}</td>
        <td key={`${row.key}sponsored`}>{row.sponsored.toString()}</td>
        <td key={`${row.key}stock`}>{row.stock}</td>
        <td key={`${row.key}percentage`}>{row.tresholdPercentage}</td>
        <td key={`${row.key}edit`}>
          <button className="btn btn-primary" onClick={this.openModal}>
            View
          </button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            shouldCloseOnOverlayClick={true}
          >
            <h2> Edit Product </h2>
            <h4>{row.key}</h4>
            <br />
            <form>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="nameInput">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="nameInput"
                    placeholder="Edit name"
                    defaultValue={row.name}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="descriptionInput">Description</label>
                  <input
                    type="text"
                    name="description"
                    className="form-control"
                    id="descriptionInput"
                    placeholder="Edit description"
                    defaultValue={row.description}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="categoryInput">Category</label>
                  <input
                    type="text"
                    name="category"
                    className="form-control"
                    id="categoryInput"
                    placeholder="Edit category"
                    defaultValue={row.category}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="priceInput">Price</label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    id="priceInput"
                    placeholder="Edit price"
                    defaultValue={row.price}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="stockInput">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    className="form-control"
                    id="stockInput"
                    placeholder="Edit stock"
                    defaultValue={row.stock}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="tresholdPercentageInput">
                    Treshold Percentage
                  </label>
                  <input
                    type="number"
                    name="tresholdPercentage"
                    className="form-control"
                    id="tresholdPercentageInput"
                    placeholder="Edit tresholdPercentage"
                    defaultValue={row.tresholdPercentage}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="companyIDInput">CompanyID</label>
                  <input
                    type="text"
                    name="companyID"
                    className="form-control"
                    id="companyIDInput"
                    placeholder="Edit companyID"
                    defaultValue={row.companyID}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pictureInput">Picture</label>
                  <input
                    type="text"
                    name="picture"
                    className="form-control"
                    id="pictureInput"
                    placeholder="Edit picture"
                    defaultValue={row.picture}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-success"
                onClick={this.submitEdit}
              >
                Submit
              </button>
              <button className="btn btn-danger" onClick={this.deleteProduct}>
                Delete
              </button>
            </form>
          </Modal>
        </td>
      </tr>
    );
  }
}

class ProductsTable extends Component {
  render() {
    var row = this.props.data.map(row => (
      <TableRowProducts key={row.key} row={row} />
    ));

    return (
      <table className="table table-striped table-hover text-center table-dark">
        <thead className="thead-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Sponsored</th>
            <th scope="col">Stock</th>
            <th scope="col">Treshold %</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>{row}</tbody>
      </table>
    );
  }
}

class TableRowUsers extends Component {
  constructor(props) {
    super(props);
    const row = this.props.row;
    this.state = {
      modalIsOpen: false,
      user: {
        coins: row.coins,
        companyID: row.companyID,
        deviceID: row.deviceID,
        email: row.email,
        firstName: row.firstName,
        lastName: row.lastName,
        points: row.points,
        role: row.role
      }
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  handleChange(e) {
    var user = {};
    user = { ...this.state.user };
    user[e.target.name] = e.target.value;
    this.setState({ user });
  }

  submitEdit(e) {
    e.preventDefault();
    console.log(this.state.user);
    this.closeModal();
    firebaseServices.usersCollection
      .doc(this.props.row.key)
      .update(this.state.user);
  }

  deleteProduct(e) {
    e.preventDefault();
    this.closeModal();
    firebaseServices.usersCollection.doc(this.props.row.key).delete();
  }

  render() {
    const row = this.props.row;
    return (
      <tr key={`${row}`}>
        <td key={`${row.key}`}>{row.key}</td>
        <td key={`${row.key}role`}>{row.role}</td>
        <td key={`${row.key}firstName`}>{row.firstName}</td>
        <td key={`${row.key}lastName`}>{row.lastName}</td>
        <td key={`${row.key}coins`}>{row.coins}</td>
        <td key={`${row.key}points`}>{row.points}</td>
        <td key={`${row.key}email`}>{row.email}</td>
        <td key={`${row.key}edit`}>
          <button className="btn btn-primary" onClick={this.openModal}>
            View
          </button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            shouldCloseOnOverlayClick={true}
          >
            <h2> Edit User </h2>
            <h4>{row.key}</h4>
            <br />
            <form>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="roleInput">Role</label>
                  <input
                    type="text"
                    name="role"
                    className="form-control"
                    id="roleInput"
                    placeholder="Edit role"
                    defaultValue={row.role}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="firstNameInput">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    id="firstNameInput"
                    placeholder="Edit First Name"
                    defaultValue={row.firstName}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="lastNameInput">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    id="lastNameInput"
                    placeholder="Edit Last Name"
                    defaultValue={row.lastName}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="CoinsInput">Coins</label>
                  <input
                    type="number"
                    name="coins"
                    className="form-control"
                    id="coinsInput"
                    placeholder="Edit Coins"
                    defaultValue={row.coins}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="pointsInput">Points</label>
                  <input
                    type="number"
                    name="points"
                    className="form-control"
                    id="pointsInput"
                    placeholder="Edit Points"
                    defaultValue={row.points}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emailInput">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    id="emailInput"
                    placeholder="Edit Email"
                    defaultValue={row.email}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="deviceIDInput">DeviceID</label>
                  <input
                    type="text"
                    name="deviceID"
                    className="form-control"
                    id="deviceIDInput"
                    placeholder="Edit deviceID"
                    defaultValue={row.deviceID}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="companyIDInput">CompanyID</label>
                  <input
                    type="text"
                    name="companyID"
                    className="form-control"
                    id="companyIDInput"
                    placeholder="Edit CompanyID"
                    defaultValue={row.companyID}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-success"
                onClick={this.submitEdit}
              >
                Submit
              </button>
              <button className="btn btn-danger" onClick={this.deleteProduct}>
                Delete
              </button>
            </form>
          </Modal>
        </td>
      </tr>
    );
  }
}

class UsersTable extends Component {
  render() {
    var row = this.props.data.map(row => (
      <TableRowUsers key={row.key} row={row} />
    ));

    return (
      <table className="table table-striped table-hover text-center table-dark">
        <thead className="thead-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Role</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Coins</th>
            <th scope="col">Points</th>
            <th scope="col">Email</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>{row}</tbody>
      </table>
    );
  }
}

class TableRowBrands extends Component {
  constructor(props) {
    super(props);
    const row = this.props.row;
    this.state = {
      modalIsOpen: false,
      brand: {
        address: row.address,
        adminUserID: row.adminUserID,
        description: row.description,
        email: row.email,
        name: row.name,
        picture: row.picture
      }
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  handleChange(e) {
    var brand = {};
    brand = { ...this.state.brand };
    brand[e.target.name] = e.target.value;
    this.setState({ brand });
  }

  submitEdit(e) {
    e.preventDefault();
    console.log(this.state.brand);
    this.closeModal();
    firebaseServices.brandsCollection
      .doc(this.props.row.key)
      .update(this.state.brand);
  }

  deleteProduct(e) {
    e.preventDefault();
    this.closeModal();
    firebaseServices.brandsCollection.doc(this.props.row.key).delete();
  }

  render() {
    const row = this.props.row;
    return (
      <tr key={`${row}`}>
        <td key={`${row.key}`}>{row.key}</td>
        <td key={`${row.key}name`}>{row.name}</td>
        <td key={`${row.key}email`}>{row.email}</td>
        <td key={`${row.key}address`}>{row.address}</td>
        <td key={`${row.key}edit`}>
          <button className="btn btn-primary" onClick={this.openModal}>
            View
          </button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            shouldCloseOnOverlayClick={true}
          >
            <h2> Edit Brand </h2>
            <h4>{row.key}</h4>
            <br />
            <form>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="addressInput">Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    id="addressInput"
                    placeholder="Edit address"
                    defaultValue={row.address}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="adminUserIDInput">adminUserID</label>
                  <input
                    type="text"
                    name="adminUserID"
                    className="form-control"
                    id="adminUserIDInput"
                    placeholder="Edit AdminUserID"
                    defaultValue={row.adminUserID}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="descriptionInput">Description</label>
                  <input
                    type="text"
                    name="description"
                    className="form-control"
                    id="descriptionInput"
                    placeholder="Edit Description"
                    defaultValue={row.description}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emailInput">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    id="emailInput"
                    placeholder="Edit Email"
                    defaultValue={row.email}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="nameInput">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="nameInput"
                    placeholder="Edit Name"
                    defaultValue={row.name}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="pictureInput">Picture</label>
                  <input
                    type="text"
                    name="picture"
                    className="form-control"
                    id="pictureInput"
                    placeholder="Edit picture"
                    defaultValue={row.picture}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-success"
                onClick={this.submitEdit}
              >
                Submit
              </button>
              <button className="btn btn-danger" onClick={this.deleteProduct}>
                Delete
              </button>
            </form>
          </Modal>
        </td>
      </tr>
    );
  }
}

class BrandsTable extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    var row = this.props.data.map(row => (
      <TableRowBrands key={row.key} row={row} />
    ));

    return (
      <table className="table table-striped table-hover text-center table-dark">
        <thead className="thead-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Address</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>{row}</tbody>
      </table>
    );
  }
}

class CompaniesTable extends Component {
  render() {
    var row = this.props.data.map(row => (
      <TableRowCompanies key={row.key} row={row} />
    ));

    return (
      <table className="table table-striped table-hover text-center table-dark">
        <thead className="thead-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Address</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>{row}</tbody>
      </table>
    );
  }
}

class TableRowCompanies extends Component {
  constructor(props) {
    super(props);
    const row = this.props.row;
    this.state = {
      modalIsOpen: false,
      company: {
        address: row.address,
        adminUserID: row.adminUserID,
        email: row.email,
        name: row.name,
        picture: row.picture
      }
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  handleChange(e) {
    var company = {};
    company = { ...this.state.company };
    company[e.target.name] = e.target.value;
    this.setState({ company });
  }

  submitEdit(e) {
    e.preventDefault();
    console.log(this.state.company);
    this.closeModal();
    firebaseServices.companiesCollection
      .doc(this.props.row.key)
      .update(this.state.company);
  }

  deleteProduct(e) {
    e.preventDefault();
    this.closeModal();
    firebaseServices.companiesCollection.doc(this.props.row.key).delete();
  }

  render() {
    const row = this.props.row;
    return (
      <tr key={`${row}`}>
        <td key={`${row.key}`}>{row.key}</td>
        <td key={`${row.key}name`}>{row.name}</td>
        <td key={`${row.key}email`}>{row.email}</td>
        <td key={`${row.key}address`}>{row.address}</td>
        <td key={`${row.key}edit`}>
          <button className="btn btn-primary" onClick={this.openModal}>
            View
          </button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            shouldCloseOnOverlayClick={true}
          >
            <h2> Edit Company </h2>
            <h4>{row.key}</h4>
            <br />
            <form>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="addressInput">Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    id="addressInput"
                    placeholder="Edit address"
                    defaultValue={row.address}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="adminUserIDInput">adminUserID</label>
                  <input
                    type="text"
                    name="adminUserID"
                    className="form-control"
                    id="adminUserIDInput"
                    placeholder="Edit AdminUserID"
                    defaultValue={row.adminUserID}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="emailInput">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    id="emailInput"
                    placeholder="Edit Email"
                    defaultValue={row.email}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nameInput">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="nameInput"
                    placeholder="Edit Name"
                    defaultValue={row.name}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="pictureInput">Picture</label>
                  <input
                    type="text"
                    name="picture"
                    className="form-control"
                    id="pictureInput"
                    placeholder="Edit picture"
                    defaultValue={row.picture}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-success"
                onClick={this.submitEdit}
              >
                Submit
              </button>
              <button className="btn btn-danger" onClick={this.deleteProduct}>
                Delete
              </button>
            </form>
          </Modal>
        </td>
      </tr>
    );
  }
}

class DevicesTable extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    var row = this.props.data.map(row => (
      <TableRowDevices key={row.key} row={row} />
    ));

    return (
      <table className="table table-striped table-hover text-center table-dark">
        <thead className="thead-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">API</th>
            <th scope="col">Distance</th>
            <th scope="col">ClientID</th>
            <th scope="col">UserID</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>{row}</tbody>
      </table>
    );
  }
}

class TableRowDevices extends Component {
  constructor(props) {
    super(props);
    const row = this.props.row;
    this.state = {
      modalIsOpen: false,
      device: {
        accessToken: row.accessToken,
        api: row.api,
        apiClientID: row.apiClientID,
        distance: row.distance,
        refreshToken: row.refreshToken,
        userID: row.userID
      }
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  handleChange(e) {
    var device = {};
    device = { ...this.state.device };
    device[e.target.name] = e.target.value;
    this.setState({ device });
  }

  submitEdit(e) {
    e.preventDefault();
    console.log(this.state.device);
    this.closeModal();
    firebaseServices.connectedDevicesCollection
      .doc(this.props.row.key)
      .update(this.state.device);
  }

  deleteProduct(e) {
    e.preventDefault();
    this.closeModal();
    firebaseServices.connectedDevicesCollection
      .doc(this.props.row.key)
      .delete();
  }

  render() {
    const row = this.props.row;
    return (
      <tr key={`${row}`}>
        <td key={`${row.key}`}>{row.key}</td>
        <td key={`${row.key}api`}>{row.api}</td>
        <td key={`${row.key}distance`}>{row.distance}</td>
        <td key={`${row.key}clientID`}>{row.apiClientID}</td>
        <td key={`${row.key}userID`}>{row.userID}</td>
        <td key={`${row.key}edit`}>
          <button className="btn btn-primary" onClick={this.openModal}>
            View
          </button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            shouldCloseOnOverlayClick={true}
          >
            <h2> Edit Company </h2>
            <h4>{row.key}</h4>
            <br />
            <form>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="apiInput">API</label>
                  <input
                    type="text"
                    name="api"
                    className="form-control"
                    id="apiInput"
                    placeholder="Edit API"
                    defaultValue={row.api}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="apiClientIDInput">ApiClientID</label>
                  <input
                    type="text"
                    name="apiClientID"
                    className="form-control"
                    id="apiClientIDInput"
                    placeholder="Edit ApiClientID"
                    defaultValue={row.apiClientID}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="distanceInput">Distance</label>
                  <input
                    type="number"
                    name="distance"
                    className="form-control"
                    id="distanceInput"
                    placeholder="Edit Distance"
                    defaultValue={row.distance}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="userIDInput">UserID</label>
                  <input
                    type="text"
                    name="userID"
                    className="form-control"
                    id="userIDInput"
                    placeholder="Edit UserID"
                    defaultValue={row.userID}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-success"
                onClick={this.submitEdit}
              >
                Submit
              </button>
              <button className="btn btn-danger" onClick={this.deleteProduct}>
                Delete
              </button>
            </form>
          </Modal>
        </td>
      </tr>
    );
  }
}

class WishlistsTable extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    var row = this.props.data.map(row => (
      <TableRowWishlists key={row.key} row={row} />
    ));

    return (
      <table className="table table-striped table-hover text-center table-dark">
        <thead className="thead-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">UserID</th>
            <th scope="col">ProductID</th>
            <th scope="col">Gained Coins</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>{row}</tbody>
      </table>
    );
  }
}

class TableRowWishlists extends Component {
  constructor(props) {
    super(props);
    const row = this.props.row;
    this.state = {
      modalIsOpen: false,
      wishlist: {
        userID: row.userID,
        productID: row.productID,
        gainedCoins: row.gainedCoins
      }
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  handleChange(e) {
    var wishlist = {};
    wishlist = { ...this.state.wishlist };
    wishlist[e.target.name] = e.target.value;
    this.setState({ wishlist });
  }

  submitEdit(e) {
    e.preventDefault();
    console.log(this.state.wishlist);
    this.closeModal();
    firebaseServices.wishlistsCollection
      .doc(this.props.row.key)
      .update(this.state.wishlist);
  }

  deleteProduct(e) {
    e.preventDefault();
    this.closeModal();
    firebaseServices.wishlistsCollection.doc(this.props.row.key).delete();
  }

  render() {
    const row = this.props.row;
    return (
      <tr key={`${row}`}>
        <td key={`${row.key}`}>{row.key}</td>
        <td key={`${row.key}userID`}>{row.userID}</td>
        <td key={`${row.key}productID`}>{row.productID}</td>
        <td key={`${row.key}gainedCoins`}>{row.gainedCoins}</td>
        <td key={`${row.key}edit`}>
          <button className="btn btn-primary" onClick={this.openModal}>
            View
          </button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            shouldCloseOnOverlayClick={true}
          >
            <h2> Edit Wishlist </h2>
            <h4>{row.key}</h4>
            <br />
            <form>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="userIDInput">UserID</label>
                  <input
                    type="text"
                    name="userID"
                    className="form-control"
                    id="userIDInput"
                    placeholder="Edit UserID"
                    defaultValue={row.userID}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productInput">ProductID</label>
                  <input
                    type="text"
                    name="productID"
                    className="form-control"
                    id="productIDInput"
                    placeholder="Edit ProductID"
                    defaultValue={row.productID}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label htmlFor="gainedCoinsInput">Gained Coins</label>
                  <input
                    type="number"
                    name="gainedCoins"
                    className="form-control"
                    id="gainedCoinsInput"
                    placeholder="Edit Gained Coins"
                    defaultValue={row.gainedCoins}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-success"
                onClick={this.submitEdit}
              >
                Submit
              </button>
              <button className="btn btn-danger" onClick={this.deleteProduct}>
                Delete
              </button>
            </form>
          </Modal>
        </td>
      </tr>
    );
  }
}

class Tables extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    var products = this.props.products;
    var users = this.props.users;
    var brands = this.props.brands;
    var companies = this.props.companies;
    var devices = this.props.devices;
    var wishlists = this.props.wishlists;
    return (
      <div
        data-spy="scroll"
        data-target=".navbar"
        style={{ position: "relative" }}
      >
        <nav
          className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top"
          style={{ position: "relative", marginBottom: "50px" }}
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#products">
                Products
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#users">
                Users
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#brands">
                Brands
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#companies">
                Companies
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#devices">
                Devices
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#wishlists">
                Wishlists
              </a>
            </li>
          </ul>
        </nav>

        <h2 id="products">Products</h2>
        <ProductsTable data={products} />
        <br />
        <h2 id="users">Users</h2>
        <UsersTable data={users} />
        <br />
        <h2 id="brands">Brands</h2>
        <BrandsTable data={brands} />
        <br />
        <h2 id="companies">Companies</h2>
        <CompaniesTable data={companies} />
        <br />
        <h2 id="devices">Devices</h2>
        <DevicesTable data={devices} />
        <br />
        <h2 id="wishlists">Wishlists</h2>
        <WishlistsTable data={wishlists} />
      </div>
    );
  }
}

export class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      users: [],
      brands: [],
      companies: [],
      devices: [],
      wishlists: [],
      fetchInProgress: true
    };
    this.subscriptions = [];
  }
  componentDidMount() {
    this.setState({ fetchInProgress: true });
    this.subscriptions.push(
      firebaseServices.getAllProducts().subscribe(products => {
        this.setState({ products: products, fetchInProgress: false });
      })
    );
    this.subscriptions.push(
      firebaseServices.getAllUsers().subscribe(users => {
        this.setState({ users: users, fetchInProgress: false });
      })
    );
    this.subscriptions.push(
      firebaseServices.getBrands().subscribe(brands => {
        this.setState({ brands: brands, fetchInProgress: false });
      })
    );
    this.subscriptions.push(
      firebaseServices.getCompanies().subscribe(companies => {
        this.setState({ companies: companies, fetchInProgress: false });
      })
    );
    this.subscriptions.push(
      firebaseServices.getDevices().subscribe(devices => {
        this.setState({ devices: devices, fetchInProgress: false });
      })
    );
    this.subscriptions.push(
      firebaseServices.getAllWishlists().subscribe(wishlists => {
        this.setState({ wishlists: wishlists, fetchInProgress: false });
      })
    );
  }

  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }

  render() {
    const products = this.state.products;
    const users = this.state.users;
    const brands = this.state.brands;
    const companies = this.state.companies;
    const devices = this.state.devices;
    const wishlists = this.state.wishlists;
    const fetchInProgress = this.state.fetchInProgress;
    return (
      <div className="container">
        {fetchInProgress ? (
          <div className="col d-flex justify-content-center">
            <ReactLoading
              type={"spinningBubbles"}
              color={"#fff"}
              height={640}
              width={256}
            />
          </div>
        ) : (
          <Tables
            products={products}
            users={users}
            brands={brands}
            companies={companies}
            devices={devices}
            wishlists={wishlists}
          />
        )}
      </div>
    );
  }
}

export default Admin;
