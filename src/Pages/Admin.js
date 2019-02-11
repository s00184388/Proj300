import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CssPages/Admin.css";
import FirebaseServices from "../firebase/services";
import Modal from "react-modal";

Modal.setAppElement("#root");

const firebaseServices = new FirebaseServices();

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

class TableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
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
            Edit
          </button>{" "}
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
              <div className="form-group">
                <label htmlFor="nameInput">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="nameInput"
                  placeholder="Edit name"
                  defaultValue={row.name}
                />
              </div>
            </form>
          </Modal>
        </td>
      </tr>
    );
  }
}

class Table extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    var row = this.props.data.map(row => <TableRow key={row.key} row={row} />);

    return (
      <table className="table table-striped table-hover text-center">
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

export class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
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
  }

  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }

  render() {
    const products = this.state.products;
    const fetchInProgress = this.state.fetchInProgress;
    return (
      <div className="container">
        {fetchInProgress ? "loading" : <Table data={products} />}
      </div>
    );
  }
}

export default Admin;
