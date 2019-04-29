import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import API from "../utils/API";
import Results from "../components/Results";
import Nav from "../components/Nav";
import { Col, Row, Container } from "../components/Grid";
import { Form, Input, FormBtn } from "../components/Form";
import "./style.css";

class Customer extends Component {
  state = {
    title: "",
    from: "",
    to: "",
    size: "",
    weight: "",
    receiver: "",
    fee: "",
    image: "",
    description: "",
    userId: null,
    redirectTo: null,
  };

  componentDidMount() {
    const userInfo = sessionStorage.getItem("user");
    const userObj = JSON.parse(userInfo);
    if (userInfo) {
      this.setState({ userId: userObj._id },
        () => {
          // console.log("customer userId: ", this.state.userId);
        }
      )
    };
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  createPackBtn() {
    API.createPackBtn(this.state)
      .then(res => console.log("response to customer: ", res.data))
      // .then(res => alert(`Your ${res.data.title} has posted!`))
      .then(res => this.setState({ redirectTo: "/carrier" }))
      // .then(res => window.location.replace("/carrier"))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <Nav page="Shipping" />
        {this.state.redirectTo ? <Redirect to={{ pathname: this.state.redirectTo }} /> : console.log("no redirect")}
        <Container fluid>
          <div className="proContainer">
            <div className="h2 h2C">Start to Send your Package</div>
            <h5 className="h3" style={{ marginTop: '130px', marginBottom: '20px', }}>Package Information</h5>

            <Input
              name="title"
              value={this.state.title}
              onChange={this.handleInputChange}
              placeholder="Enter your pack name"
            />
            <Row>
              <Col size="md-6">
                <Results>
                  <Form>
                    <span>pack Size (required)</span>
                    <Input style={{ width: '90%' }}
                      name="size"
                      value={this.state.size}
                      onChange={this.handleInputChange}
                      placeholder="inch x inch"
                    />

                    <span>pack weight (required)</span>
                    <Input style={{ width: '90%' }}
                      name="weight"
                      value={this.state.weight}
                      onChange={this.handleInputChange}
                      placeholder="lbs"
                    />

                    <span>From (required)</span>
                    <Input style={{ width: '90%' }}
                      name="from"
                      value={this.state.from}
                      onChange={this.handleInputChange}
                      placeholder="street(apt#), city, state, zip"
                    />

                    <span>To (required)</span>
                    <Input style={{ width: '90%' }}
                      name="to"
                      value={this.state.to}
                      onChange={this.handleInputChange}
                      placeholder="street(apt#), city, state, zip"
                    />
                  </Form>
                </Results>
              </Col>
              <Col size="md-6">
                <Results>
                  <Form>
                    <span>Receiver (required)</span>
                    <Input style={{ width: '90%' }}
                      name="receiver"
                      value={this.state.receiver}
                      onChange={this.handleInputChange}
                      placeholder="receiver's full name"
                    />

                    <div>Shipping Fee (required)</div>
                    <Input style={{ width: '90%' }}
                      name="fee"
                      value={this.state.fee}
                      onChange={this.handleInputChange}
                      placeholder="USD$"
                    />

                    <div>Image Link (optional)</div>
                    <Input style={{ width: '90%' }}
                      name="image"
                      value={this.state.image}
                      onChange={this.handleInputChange}
                      placeholder="image link"
                    />

                    <div>Description (optional)</div>
                    <Input style={{ width: '90%' }}
                      name="description"
                      value={this.state.description}
                      onChange={this.handleInputChange}
                      placeholder="Description"
                    />
                  </Form>
                </Results>
              </Col>
              <div className="submitC">
                <FormBtn
                  btncolor="btn btn-danger"
                  disabled={!(this.state.title && this.state.size && this.state.weight && this.state.from && this.state.to && this.state.receiver && this.state.fee)}
                  onClick={() => this.createPackBtn()}
                >
                  <i className="fas fa-shipping-fast"> Submit</i>
                </FormBtn>
                <br></br>
              </div>
            </Row>
          </div>
        </Container>
      </div>
    );
  }
}

export default Customer;
