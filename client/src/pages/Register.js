import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import API from "../utils/API";
import "./style.css";

class Register extends Component {
  state = {
    name: "",
    password: "",
    password2: "",
    email: "",
    phone: "",
    address: "",
    dl: "",
    portrait: "",
    errors: null,
    redirectTo: null
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  userRegister = () => {
    const { name, email, password, password2 } = this.state;
    const newUserObj = { name, email, password, password2 };
    API.userRegister(newUserObj)
      .then(res => {
        console.log("Response to React:", res.data);
        if (res.data[0].msg) {
          this.setState({ errors: res.data })
        };
        if (res.data === "no register error") {
          this.setState({ redirectTo: "/login" })
        }
      })
      .catch(err => console.log(err))
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />
    }
    return (
      <div className="bg-gray">
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <div className="card-body">
              <div className="text-center"><img alt="" className="truck3" src={require('./mini.gif')} /></div>
              <h1 className="text-center mb-3">Register</h1>

              {this.state.errors ? this.state.errors.map((value, index) => {
                return (
                  <div key={index} className="alert alert-warning alert-dismissible fade show" role="alert">
                    {value.msg}
                    {/* <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> */}
                  </div>
                )
              }) : <div className="text-primary mx-auto"></div>}

              {/* <form action="/register" method="POST"> */}
              <div className="form-group">
                <span>Name</span>
                <input
                  type="name"
                  id="name"
                  name="name"
                  value={this.state.name.trim()}
                  onChange={this.handleInputChange}
                  className="form-control"
                  placeholder="Enter Name"
                />
              </div>
              <div className="form-group">
                <span>Email</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={this.state.email.trim().toLowerCase()}
                  onChange={this.handleInputChange}
                  className="form-control"
                  placeholder="Enter Email"
                />
              </div>
              <div className="form-group">
                <span>Password</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleInputChange}
                  className="form-control"
                  placeholder="Create Password"
                />
              </div>
              <div className="form-group">
                <span>Confirm Password</span>
                <input
                  type="password"
                  id="password2"
                  name="password2"
                  value={this.state.password2}
                  onChange={this.handleInputChange}
                  className="form-control"
                  placeholder="Confirm Password"
                />
              </div>

              <button className="btn btn-primary btn-block" onClick={this.userRegister}>
                <i className="fas fa-user-plus"> Submit</i>
              </button>
              {/* </form> */}
              <p className="lead mt-4">Have An Account? <Link to="/login"><span className="">Login</span></Link></p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Register;
