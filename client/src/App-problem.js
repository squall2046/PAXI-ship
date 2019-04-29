import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Carrier from "./pages/Carrier";
import Customer from "./pages/Customer";
import Status from "./pages/Status";
import NoMatch from "./pages/NoMatch";

class App extends Component {

  state = {
    user: null
  }

  componentDidMount() {
    // componentWillMount() {
    // console.log("React App session check: ", sessionStorage.getItem("user"))
    const userInfo = sessionStorage.getItem("user");
    if (userInfo) {
      this.setState({ user: userInfo },
        // () => console.log("React APP state check: ", this.state.user)
        // () => this.render()
        () => { this.loggedInRoutes() }
      )
    }
    else { this.loggedOutRoutes() }
  }

  render() {
    if (this.state.user) {
      return (
        <div>
          {this.loggedInRoutes()}
        </div>
      )
    }
    else {
      return (
        <div>
          {this.loggedOutRoutes()}
        </div>
      )
    }
  }

  loggedInRoutes() {
    return (
      <Router>
        <Switch>
          {/* <Route exact path="/" component={Welcome} /> */}
          {/* <Route exact path="/register" component={Register} /> */}
          <Route exact path="/login" component={Login} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/customer" component={Customer} />
          <Route exact path="/carrier" component={Carrier} />
          <Route exact path="/status" component={Status} />
          <Route component={Profile} />
          {/* <Route path="/profile/:id" component={Profile} /> */}
        </Switch>
      </Router>
    )
  }

  loggedOutRoutes() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          {/* <Route exact path="/profile" component={Profile} /> */}
          {/* <Route exact path="/customer" component={Customer} /> */}
          {/* <Route exact path="/carrier" component={Carrier} /> */}
          {/* <Route exact path="/status" component={Status} /> */}
          <Route component={NoMatch} />
        </Switch>
      </Router>
    )
  }
}

export default App;
