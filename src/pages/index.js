import React from "react";
import { BrowserRouter, Router, Route, Switch } from "react-router-dom";

//pages
import History from "./History";
import Booking from "./Booking";
import Error from "./Error";
import Signs from "./Signs";
import Addsign from "./AddSign";
import Navbar from "../components/Header/Navbar";
import Sidebar from "../components/Header/Sidebar";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      StatusSidebar: true, //open sidebar ex.
      SidebarWidth: "col-7 col-sm-3", //width of sidbar ex.
      NavWidth: "col-12", //width of navbar ex.
      NavHeight: 60, //height of navbar ex.
    };
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    if (window.innerWidth > 724) {
      this.setState({
        StatusSidebar: true
      });
    }
  };

  handleSidebar = async () => {
    let statusSidebar = false;
    if (this.state.StatusSidebar === false) {
      statusSidebar = true;
    }
    await this.setState({
      StatusSidebar: statusSidebar
    });
  };

  render() {
    return (
      <div>
        <Navbar handleSidebar={this.handleSidebar} width={this.state.NavWidth} height={this.state.NavHeight} />
        <div className="col-12" style={{paddingTop:this.state.NavHeight}}>
          <div className="row">
            <div className="col-12 col-sm-3 p-0">
              <Sidebar open={this.state.StatusSidebar} size={this.state.SidebarWidth} />
            </div>
            <div className="col-12 col-sm-9 p-0">
              <Switch>
                <Route exact path="/" component={Signs} />
                <Route exact path="/Booking" component={Booking} />
                <Route exact path="/History" component={History} />
                <Route exact path="/Addsign" component={Addsign} />
                <Route exact path="/error/:status" component={Error} />
                <Route component={Error} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
