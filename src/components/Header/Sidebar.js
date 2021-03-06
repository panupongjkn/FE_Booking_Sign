import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import jwt from "jwt-simple";
import cookie from "react-cookies";

const Bar = styled.div`
  z-index: 99;
  position: fixed;
  margin-left: ${props => props.position}vw;
  height: 100%;
  overflow-y: auto;
  font-weight: 1000;
  background-color: #435687;
  a {
    text-decoration: none !important;
  }
`;

const Test = styled.div`
  position: relative;
  cursor: pointer;
  font-size: 1em;
  padding: 15px 30px;
  color: white;
  text-decoration: none;
  border-left: 7px solid #435687;
  &:hover {
    background-color: #384872;
    border-left: 7px solid #384872;
  }
`;

const Pages = [
  { page: "Dashboard", path: "/dashboard", Admin: false },
  { page: "Booking", path: "/booking", Admin: false },
  { page: "Dashboard", path: "/admin", Admin: true },
  { page: "Addsign", path: "/addsign", Admin: true },
  { page: "Summary", path: "/admin/summary", Admin: true },
];

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  CheckAdmin = admin => {
    if (cookie.load("jwt") === undefined) return false;
    let token = jwt.decode(cookie.load("jwt"), "bookingsign");
    let adminStatus = false
    if (token.Role === "admin") adminStatus = true;
    if (admin === adminStatus) return true;
    return false;
  };
  render() {
    return (
      <Bar
        className={"shadow " + this.props.size}
        position={this.props.open === true ? 0 : -100}
      >
        <div>
          {Pages.map(page => {
            return (
              <Link to={page.path}>
                <Test
                  className={
                    "media active " + (this.CheckAdmin(page.Admin)
                      ? "d-block"
                      : "d-none")
                  }
                  style={
                    this.props.active === page.page
                      ? {
                          backgroundColor: "#4c629b",
                          borderLeft: "7px solid #ffb22d"
                        }
                      : {}
                  }
                >
                  {page.page}
                </Test>
              </Link>
            );
          })}
        </div>
      </Bar>
    );
  }
}

export default Sidebar;
