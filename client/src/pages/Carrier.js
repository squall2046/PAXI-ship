import React, { Component } from "react";
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';
import PopUp from "./PopUp";
import API from "../utils/API";
import Nav from "../components/Nav";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { FormBtn } from "../components/Form";
import "./style.css";
import ReactGoogleMaps from "./ReactGoogleMaps";

class Carrier extends Component {
  state = {
    modalShow: false,
    smShow: false,
    pack: [],
    carry: [],
    userId: null,
    mapBtnA: null,
    mapBtnB: null,
    currentpackid: null,
    currentpacktitle: null,

    lat: null,
    lng: null
  };

  // ======== html5 built-in getGeoLocation() to get current location ========
  componentWillUpdate() {
    this.getGeoLocation()
  };
  getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        }
      )
      // console.log("current location: \n", this.state.lat, this.state.lng)
    }
  };
  // =========================================================================

  componentDidMount() {
    const userInfo = sessionStorage.getItem("user");
    const userObj = JSON.parse(userInfo);
    if (userInfo) {
      this.setState({ userId: userObj._id },
        // () => {
        //   console.log("carrier userId: ", this.state.userId);
        // }
      )
    };

    this.findUnpicked();
  };


  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  findUnpicked() {
    API.findUnpicked()
      .then(res => {
        this.setState({ pack: res.data });
        // console.log("Carrier find unpicked: ", this.state.pack)
      })
      .catch(err => console.log(err));
  };

  pickBtnSubmit = packId => {
    // if (prompt("Do you want to carry this pack? Input 'yes' or 'no'") === "yes") {
    // console.log("carrier req userId:", this.state.userId, "\n carrier req packId:", this.state.currentpackid)
    API.updateCarrier(this.state.userId, this.state.currentpackid)
      .then(res => { console.log(res.data); this.componentDidMount() })
      .then(res => this.setState({ smShow: false }))
    // .catch(err => console.log(err));
    // 刷新 mount 中全部内容!!!
    // }
  }


  render() {
    let modalClose = () => this.setState({ modalShow: false });
    let smClose = () => this.setState({ smShow: false });
    return (
      <div>
        <Nav page="Carrier" />
        <Container fluid>
          <div className="proContainer">
            <Row>
              <Col size="md-7">
                <div className="h2">Waiting List</div>
                <div className="packList">
                  {this.state.pack.length ? (
                    <List>
                      {this.state.pack
                        .map((pack, index) => (
                          <ListItem key={index} children={pack}>
                            {/* <ListItem key={pack._id} children={pack}> */}
                            <h4 data-id={pack._id}>{pack.title}</h4>


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
                                <p id="bold">Sender ID: </p>
                                <p id="resultID">{pack.userId}</p>
                              </div>
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
                            </div>
                            <img className="col-12 mx-auto img" alt="" src={pack.image ? pack.image : require('./pack.png')} />
                            <div className="note">
                              <p id="bold">Additional Note: </p>
                              <p id="result">{pack.description}</p>
                            </div>

                            {/* ====================== pick it btn ====================== */}
                            {/* ===== react bootstrap modal (click to pop-up window) ===== */}
                            <div className="pick-btn">
                              <ButtonToolbar>
                                <Button id='btnGreen'
                                  variant="success"
                                  onClick={() =>
                                    this.setState({
                                      smShow: true,
                                      currentpackid: pack._id,
                                    })
                                  }
                                  disabled={(this.state.userId === pack.userId)}
                                >
                                  <span> Pick it </span>
                                </Button>
                                <Modal
                                  size="sm"
                                  show={this.state.smShow}
                                  onHide={smClose}
                                  aria-labelledby="example-modal-sizes-title-sm"
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title id="example-modal-sizes-title-sm">
                                      Carrier Confirm
                                  </Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    Would you like to pick this pack?
                                </Modal.Body>
                                  <Modal.Footer>
                                    <FormBtn
                                      onClick={() => this.pickBtnSubmit()}
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

                            {/* ====================== send msg btn ====================== */}
                            {/* ===== react bootstrap modal (click to pop-up window) ===== */}
                            <div className="msg-btn">
                              <ButtonToolbar>
                                <Button id='btnRed'
                                  variant="info"
                                  onClick={() =>
                                    this.setState({
                                      modalShow: true,
                                      currentpackid: pack._id,
                                      currentpacktitle: pack.title,
                                      currentpackuserid:pack.userId
                                    })
                                  }
                                  disabled={(this.state.userId === pack.userId)}
                                >
                                  <span> Send Msg </span>
                                </Button>
                                <PopUp
                                  show={this.state.modalShow}
                                  onHide={modalClose}
                                  packid={this.state.currentpackid}
                                  packtitle={this.state.currentpacktitle}
                                  userid={this.state.currentpackuserid}
                                  carrierId={this.state.userId}
                                />
                              </ButtonToolbar>
                            </div>
                            {/* ==========================done============================ */}
                          </ListItem>
                        ))
                      }
                    </List>
                  ) : (
                      <h6> &nbsp; No shipping packages </h6>
                    )}
                </div>
              </Col>
              <Col size="md-5">
                <div className="mapContainer">
                  <div className="h3 h3M">Map Search</div>
                  {/* // // // // // // // //  */}
                  <ReactGoogleMaps
                    // key={}
                    lat={this.state.lat}
                    lng={this.state.lng}
                  />
                  {/* // // // // // // // //  */}
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    );
  }
}

export default Carrier;
