import React from "react";
import FirebaseServices from "../firebase/services";

const fs = new FirebaseServices();

class BrandProductEditingModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      brandID: this.props.product.brandID,
      category: this.props.product.category,
      companyID: this.props.product.companyID,
      description: this.props.product.description,
      name: this.props.product.name,
      picture: this.props.product.picture,
      price: this.props.product.price,
      stock: this.props.product.stock,
      sponsored: true,
      tresholdPercentage: this.props.product.tresholdPercentage * 100,
      _key: this.props.product.key
    };
  }

  handleChange = e => {
    let newState = {};
    if (e.target.name === "picture") {
      this.setState({
        picture: e.target.files[0]
      });
      //console.log(e.target.files[0]);
    } else newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  handleSubmit = e => {
    e.preventDefault();

    let product = {
      brandID: this.state.brandID,
      category: this.state.category.toLowerCase(),
      description: this.state.description,
      name: this.state.name,
      picture: this.state.picture,
      price: this.state.price,
      stock: this.state.stock,
      sponsored: true,
      tresholdPercentage: this.state.tresholdPercentage / 100
    };
    //console.log("UPDATING : " + this.state._key);
    fs.editProduct(product, this.state._key).catch(err => console.log(err));
    this.handleCloseAfterSubmit();
  };

  handleCloseAfterSubmit = () => {
    this.props._show();
  };

  render() {
    const categories = ["Electronics", "Shoes", "Sports", "Others"];
    const options = categories.map(opt => <option key={opt}>{opt}</option>);
    const title = this.props.product.name;
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>{title}</h3>
        <div className="form-group">
          <label htmlFor="categoryList">Product Category:</label>
          <select
            id="categoryList"
            name="category"
            className="form-control"
            defaultValue={
              this.state.category.charAt(0).toUpperCase() +
              this.state.category.slice(1)
            }
            onChange={this.handleChange}
          >
            <option value="" disabled hidden>
              Select a category
            </option>
            {options}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="formName">Product Name:</label>
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
          <label htmlFor="formDescription">Product Description:</label>
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
          <label htmlFor="formPicture">Product Image:</label>
          <input
            id="formPicture"
            className="form-control"
            name="picture"
            type="file"
            accept="image/jpeg, image/png"
            onChange={this.handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="formPrice">Product Price:</label>
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
          <label htmlFor="formStock">Product Stock:</label>
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
          <label htmlFor="formTreshold">Treshold Percentage:</label>
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
        <button
          className="btn btn-primary"
          id="formSubmit"
          type="submit"
          onClick={this.handleSubmit}
        >
          Update Product
        </button>
      </form>
    );
  }
}
export default BrandProductEditingModal;
