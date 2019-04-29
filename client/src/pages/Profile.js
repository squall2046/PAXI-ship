import React, { Component } from "react";
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';

import API from "../utils/API";
import Nav from "../components/Nav";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { FormBtn } from "../components/Form";

import "./style.css";

class Profile extends Component {
  state = {
    smShow: false,
    pack: [],
    carrier: [],
    user: null,
    // msg: null
  };

  componentDidMount() {
    const userInfo = sessionStorage.getItem("user");
    const userObj = JSON.parse(userInfo);
    if (userInfo) {
      this.setState({ user: userObj },
        () => {
          console.log("profile userObj: ", this.state.user);
          this.findUserPacks();
        }
      )
    };
  };

  findUserPacks() {
    const userId = this.state.user._id;
    API.findUserPacks(userId)
      .then(res => {
        // this.setState({ pack: res.data.pack },
        this.setState({ pack: res.data.pack, carrier: res.data.carrier },
          () => console.log("profile user: \n packs: ", this.state.pack, "\n carried: ", this.state.carrier)
        )
      })
      .catch(err => console.log(err));
  };

  updateDelivered = packId => {
    // if (prompt("Did you complete the delivery?") === "yes") {
    API.updateDelivered(packId)
      .then(res => { console.log(res.data); this.componentDidMount() })
      .then(res => this.setState({ smShow: false }))
    // }
  }

  render() {
    let smClose = () => this.setState({ smShow: false });
    return (
      <div>
        {/* <Nav msg={this.state.msg}/> */}
        <Nav page="Profile" />
        <Container fluid>
          <div className="proContainer">
            <Row>
              <Col size="md-6">
                <div className="h3 h2PL">Shipping packages</div>
                <br></br>

                {this.state.pack.length ? (
                  <List>
                    <div className='ProfileL'>

                      {this.state.pack
                        .map(pack => (
                          <ListItem key={pack._id}>
                            <div id="paint">

                              <div className="status">Picked: {pack.isPicked ? <span>yes</span> : <span>no</span>}</div>
                              <div className="status2">Delivered: {pack.isDelivered ? <span>yes</span> : <span>no</span>}</div>
                              {pack.carrierId ? <div className="status3">carrier ID: {pack.carrierId} </div> : <div className="status3">Waiting for Carrier</div>}
                              <div className='LL'></div>
                            </div>
                            <h4>{pack.title}</h4>
                            <br></br>
                            <div className="left">
                              <div className="each">
                                <p id="bold">From: </p>
                                <p id="result">{pack.from}</p>
                              </div>
                              <div className="each">
                                <p id="bold">To: </p>
                                <p id="result">{pack.to}</p>
                              </div>
                            </div>
                            <div className="right">
                              <div className="each">
                                <p id="bold">Receiver: </p>
                                <p id="result">{pack.receiver}</p>
                              </div>
                              <div className="each">
                                <p id="bold">Package size: </p>
                                <p id="result">{pack.size}</p>
                              </div>
                              <div className="each">
                                <p id="bold">Package weight: </p>
                                <p id="result">{pack.weight}</p>
                              </div>
                              <div className="each">
                                <p id="bold">Shipping Cost: </p>
                                <p id="result" style={{ color: 'red', fontWeight: 'bold' }}>$ {pack.fee}</p>
                              </div>
                              <div className="each">
                                <p id="bold">Issue (UTC): </p>
                                <p id="resultID">{pack.date}</p>
                              </div>

                            </div>
                            <br></br>
                            <img className="col-12 mx-auto img" alt="" src={pack.image ? pack.image : require('./pack.png')} />
                            <div className="note">
                              <p id="bold">Additional Note: </p>
                              <p id="result">{pack.description}</p>
                            </div>
                          </ListItem>
                        ))
                      }
                    </div>
                  </List>
                ) : (
                    <h6 className="noPack"><br/><br/>  &nbsp; No shipping packages </h6>
                  )}
              </Col>
              <Col size="md-6">
                <div className="h3 h2PR">Carried packages</div>
                <br></br>

                {this.state.carrier.length ? (
                  <List>
                    <div className='ProfileR'>
                      {this.state.carrier
                        .map(pack => (

                          <ListItem key={pack._id}>

                            {/* ====================== update delivered btn ====================== */}
                            {/* ===== react bootstrap modal (click to pop-up window) ===== */}
                            <div className="">

                              <ButtonToolbar>
                                <Button id='btnGreen' onClick={() => this.setState({ smShow: true })} className={pack.isDelivered ? "btn btn-secondary text-light fadeBtn" : "btn btn-success text-light fadeBtn"} disabled={pack.isDelivered}>
                                  {pack.isDelivered ? <span> Delivered </span> : <span>Confirm Delivery</span>}
                                </Button>
                                <Modal
                                  size="sm"
                                  show={this.state.smShow}
                                  onHide={smClose}
                                  aria-labelledby="example-modal-sizes-title-sm"
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title id="example-modal-sizes-title-sm">
                                      Carrier Delivery
                                    </Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    Have you delivered this pack?
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <FormBtn
                                      onClick={() => this.updateDelivered(pack._id)}
                                      btncolor="btn btn-success"
                                    >
                                      Yes
                                  </FormBtn>
                                    <FormBtn
                                      onClick={() => this.setState({ smShow: false })}
                                      btncolor="btn btn-secondary"
                                    >
                                      No
                                  </FormBtn>
                                  </Modal.Footer>
                                </Modal>
                              </ButtonToolbar>
                            </div>
                            {/* ==========================done============================ */}
                            <div className='RR'></div>

                            <h4>{pack.title}</h4>
                            <div className="left">

                              <div className="each">
                                <p id="bold">From: </p>
                                <p id="result">{pack.from}</p>
                              </div>
                              <div className="each">
                                <p id="bold">To: </p>
                                <p id="result">{pack.to}</p>
                              </div>
                            </div>

                            <div className="right">
                              <div className="each">
                                <p id="bold">Receiver: </p>
                                <p id="result">{pack.receiver}</p>
                              </div>
                              <div className="each">
                                <p id="bold">Package size: </p>
                                <p id="result">{pack.size}</p>
                              </div>
                              <div className="each">
                                <p id="bold">Package weight: </p>
                                <p id="result">{pack.weight}</p>
                              </div>
                              <div className="each">
                                <p id="bold">Shipping Cost: </p>
                                <p id="result" style={{ color: 'red', fontWeight: 'bold' }}>$ {pack.fee}</p>
                              </div>
                              <div className="each">
                                <p id="bold">Issue (UTC): </p>
                                <p id="resultID">{pack.date}</p>
                              </div>

                            </div>
                            <img className="col-12 mx-auto img" alt="" src={pack.image ? pack.image : require('./pack.png')} />
                            <div className="note">
                              <p id="bold">Additional Note: </p>
                              <p id="result">{pack.description}</p>
                            </div>
                          </ListItem>
                        ))
                      }
                    </div>
                  </List>
                ) : (
                    <h6 className="noPack"><br/><br/> &nbsp; No carried packages </h6>
                  )}
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    );
  }
}

export default Profile;
