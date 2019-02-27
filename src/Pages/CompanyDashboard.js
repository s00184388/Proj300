import React, { Component } from "react";
import "./CssPages/CompanyDashboard.css";
import FirebaseServices from "../firebase/services";
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Alert, AlertContainer } from "react-bs-notifier";

library.add(faArrowDown);

//constant
const fs = new FirebaseServices();

//components
class ProductForm extends Component {
  constructor() {
    super();
    this.state = {
      fields: {},
      errors: {},
      quantity: 0,
      price: 0,
      remaining: 0,
      category:"",
      categoryOptions: ['Electronics', 'Shoes', 'Sports', 'Others'],
      showingAlert:false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = e => {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({fields});
    //console.log(this.state.fields);
  };

  validate=()=>{
    let fields=this.state.fields;
    let errors = {};
    let formIsValid=true;

    if (!fields["brandName"]) {
      formIsValid = false;
      errors["brandName"] = "*Please enter the brand's name";
    }

    if (!fields["brandPic"]) {
      formIsValid = false;
      errors["brandPic"] = "*Please enter the brand's picture URL";
    }
    
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


    this.setState({
      errors: errors
    },()=>{
      console.log(this.state.errors);
    });
    
    return formIsValid;
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let fields={};

    fields["brandName"] = this.state.fields.brandName;
    fields["brandPic"] = this.state.fields.brandPic;
    fields["name"] = this.state.fields.name;
    fields["description"] = this.state.fields.description;
    fields["picURL"] = this.state.fields.picURL;
    fields["quantity"]=this.state.fields.quantity;
    fields["price"]=this.state.fields.price;
    fields["category"]=this.state.fields.category;
      
    let product = {
      brand: {
        name: fields["brandName"],
        picURL: fields["brandPic"],
      },
      name: fields["name"],
      description: fields["description"],
      picURL:fields["picURL"],
      quantity: fields["quantity"],
      price: fields["price"],
      remaining:this.state.remaining,
      category: this.state.fields.category,
      sponsored: false,
      companyID: this.props.companyID
    };

    console.log(this.validate());
    if(this.validate()){
      fs.addProduct(product)
      this.setState({
          fields:"",
          errors:"",
          showingAlert:true
        });
        setTimeout(() => {
          this.setState({
            showingAlert: false
          });
        }, 5000);
    console.log(product)  
    }
  };

  render() {
    const categories = ['Electronics', 'Shoes', 'Sports', 'Others'];
    const {brandName,brandPic,name,description,picURL} = this.state.fields;
    const options = categories.map(opt=>
      <option key={opt}>{opt}</option>)
    return (
      <div className='container'>

          {this.state.showingAlert===true ? (  
            <AlertContainer>
               <Alert type="success" headline="Success!">
                 <strong>You're product has been added!</strong> 
               </Alert>
          </AlertContainer>    
          ) : null}
       <h6 className="text-white">Add  a Product:  </h6>
       <hr></hr>
        <form onSubmit={this.handleSubmit}>
        <div className='row'>
            <div className="form-group input-group-sm col-sm">
              <input
                id="formBrandName"
                className="form-control"
                name="brandName"
                type="text"
                placeholder="Product's brand name"
                onChange={this.handleChange}
                value={brandName || ""}
              />
              <div className="text-white"><small>{this.state.errors.brandName}</small></div>
            </div>
            <div className="form-group input-group-sm col-sm">
            <select id="categoryList" name="category" className="form-control" defaultValue="" onChange={this.handleChange}>
              <option value="" disabled hidden>Product Category</option>
              {options}
            </select>
            <div className="text-white"><small>{this.state.errors.category}</small></div>
          </div>
        </div>
        <div className="form-group input-group-sm ">
              <input
                id="formBrandPic"
                className="form-control col-sm-12"
                name="brandPic"
                type="text"
                placeholder="Enter Brand Image URL (e.g. https://)"
                onChange={this.handleChange}
                value={brandPic || ""}  
              />
              <div className="text-white"><small>{this.state.errors.brandPic}</small></div>
        </div>    
          <div className="form-group input-group-sm">
            <input
              id="formName"
              className="form-control col-sm-12"
              name="name"
              type="text"
              placeholder="Product Name"
              onChange={this.handleChange}
              value={name || ""}
            />
            <div className="text-white"><small>{this.state.errors.name}</small></div>
          </div> 
        <div className="form-group input-group-sm">
          <input
            id="formDescription"
            className="form-control col-sm-12"
            name="description"
            type="text"
            placeholder="Product Description"
            onChange={this.handleChange}
            value={description || ""}
          />
          <div className="text-white"><small>{this.state.errors.description}</small></div>
        </div>
        <div className="form-group input-group-sm">
          <input
            id="formPicture"
            className="form-control col-sm-12"
            name="picURL"
            type="text"
            placeholder="Enter Product Image URL (e.g. https://)"
            onChange={this.handleChange}
            value={picURL || ""}
          />
          <div className="text-white"><small>{this.state.errors.picURL}</small></div>
          
        </div>
        <div className='row'>
            <div className="form-group input-group-sm col-sm">
              <label htmlFor='formPrice' className='text-white'>
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
              <div className="text-white"><small>{this.state.errors.price}</small></div>
            </div>
            <div className="form-group input-group-sm col-sm-6">
              <label htmlFor='formQuantity' className='text-white'>
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
              <div className="text-white"><small>{this.state.errors.quantity}</small></div>
            </div>
          </div>
          <div className='d-flex justify-content-center pt-3'>
              <button className="btn btn-warning btn-sm text-white" id="formSubmit" type="submit" onClick={this.handleSubmit}>
                Submit Product
              </button>
          </div>
      </form> 
    </div>     
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

 /* componentDidMount(){
    this.employeesSubscr = fs.getEmployees(this.props.company.name)
    .subscribe(employees=>this.setState({employees: employees}));
  }
  componentWillUnmount(){
    this.employeesSubscr.unsubscribe();
  }*/
  
  render() {
    const employees = this.state.employees;
    const employeesList = employees.map((emp, index) => 
      <TableRow row={emp} index={++index} key={emp.key}/>
    );
    return(
      <div className="container">
        <h6 className="text-white">Employee List</h6>
       <hr></hr> 
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
    this.subscriptions = [];
    this.state={
      company:{},
      companyName:'',
      companyID:''
    }
  }
    
  componentDidMount(){
      if(this.props.companyID){
        this.subscriptions.push(
          fs.getCompanies(this.props.companyID).subscribe(company=>{
            this.setState({
              company,
              companyName:company[0].name,
              companyID:company[0].key
            },()=>{
              console.log(this.state.companyID);
              console.log(this.state.companyName)
            })
          })
        )}
      }
  componentWillUnmount() {
        this.subscriptions.forEach(subs => subs.unsubscribe());
      }
  
  render() {
    return (
      <div className="container">
        <h4 className="text-center text-white py-3"> <strong>{this.state.companyName}</strong> Dashboard </h4>
        <div className="row">
          <div className="col-lg-6">
            <ProductForm companyName={this.state.companyName} companyID={this.props.companyID}/>
          </div>
          <div className="col-lg-6">
            <CompanyInfo companyName={this.state.companyName}/>
          </div>
        </div>
      </div>
    );
  }
}

export default CompanyDashboard;
