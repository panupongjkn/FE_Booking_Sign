import React from "react";
import axios from "axios";
import moment from "moment";
import cookie from "react-cookies";
import { Link } from "react-router-dom";
import withAuth from "../hocs/withAuth";
import sweetalert from "sweetalert2";
import "../assets/admin.css";

import { Month, Year, Organization } from "../data";

import { Row, Col, Card, CardBody, CardTitle, Table } from "reactstrap";

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      organization: null,
      sign: null,
      month: null,
      year: null,
      bookings: [],
      signs: [],
      numofpage: 1,
      totalpage: 0
    };
  }
  componentWillMount() {
    this.props.page("Summary");
    this.fetchBookings();
    this.fetchSign();
  }
  async pluspage() {
    if (this.state.totalpage > this.state.numofpage) {
      await this.setState({ numofpage: this.state.numofpage + 1 });
    }
    this.fetchBookings();
  }

  async minuspage() {
    if (this.state.numofpage > 1) {
      await this.setState({ numofpage: this.state.numofpage - 1 });
    }
    this.fetchBookings();
  }
  fetchBookings = async () => {
    const AuthStr = "Bearer ".concat(cookie.load("jwt"));
    const headers = {
      headers: {
        Authorization: AuthStr
      }
    };
    await axios
      .get(
        process.env.REACT_APP_BE_PATH +
          `/admin/booking/${this.state.month}/${this.state.year}/${
            this.state.sign
          }/${this.state.organization}/${this.state.numofpage}`,
        headers
      )
      .then(async booking => {
        await this.setState({
          bookings: booking.data.bookings,
          totalpage: booking.data.allpage
        });
        console.log(booking)
      });
  };

  fetchSign = async () => {
    await axios
      .get(process.env.REACT_APP_BE_PATH + "/allsign")
      .then(async data => {
        await this.setState({
          signs: data.data.signs
        });
      });
  };
  SetOrder = async (state, value) => {
    await this.setState({
      [state]: value
    });
    console.log(
      this.state.month,
      this.state.year,
      this.state.sign,
      this.state.organization
    );
    this.fetchBookings()

  };
  render() {
    return (
      <div className="page-content container-fluid">
        <Row>
          <Col lg="12">
            <Card>
              <CardBody className="shadow">
                <div
                // className={
                //   this.state.bookings.length == 0 ? "d-none" : "d-block"
                // }
                >
                  <div className="d-md-flex align-items-center justify-content-between">
                    <div>
                      <CardTitle>Summary</CardTitle>
                    </div>
                    <div className="d-flex">
                      <select
                        class="custom-select mr-sm-2 font-s"
                        onChange={e => this.SetOrder("month", e.target.value)}
                      >
                        <option value={"null"} selected>
                          Month
                        </option>
                        {Month.map(month => {
                          return (
                            <option value={month.number}>{month.name}</option>
                          );
                        })}
                      </select>
                      <select
                        class="custom-select mr-sm-2 font-s"
                        onChange={e => this.SetOrder("year", e.target.value)}
                      >
                        <option value={"null"} selected>
                          Year
                        </option>
                        {Year.map(year => {
                          return <option value={year}>{year}</option>;
                        })}
                      </select>
                      <select
                        class="custom-select mr-sm-2 font-s"
                        onChange={e => this.SetOrder("sign", e.target.value)}
                      >
                        <option value={"null"} selected>
                          Sign
                        </option>
                        {this.state.signs.map(sign => {
                          return <option value={sign.id}>{sign.name}</option>;
                        })}
                      </select>
                      <select
                        class="custom-select mr-sm-2 font-s"
                        onChange={e =>
                          this.SetOrder("organization", e.target.value)
                        }
                      >
                        <option value={"null"} selected>
                          Organization
                        </option>
                        {Organization.map(organization => {
                          return (
                            <option value={organization}>{organization}</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Table className="no-wrap v-middle" responsive>
                      <thead>
                        <tr className="border-0">
                          <th className="border-0 d-none d-md-table-cell">
                            Name
                          </th>
                          <th className="border-0 d-none d-md-table-cell">
                            Organization Name
                          </th>
                          <th className="border-0">Place</th>
                          <th className="border-0">Booking date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.bookings.map(booking => {
                          return (
                            <tr>
                              <td className="d-none d-md-table-cell">
                                {booking.applicant.fname +
                                  " " +
                                  booking.applicant.lname}
                              </td>
                              <td className="d-none d-md-table-cell">
                                {booking.applicant.organization}
                              </td>
                              <td>{booking.sign.location}</td>
                              <td>
                                {moment(booking.first_date).format("DD/MM/YY")}-
                                {moment(booking.last_date).format("DD/MM/YY")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    <div className="row ml-auto">
                      <div className="col-12 p-0 d-flex">
                        <div className="ml-auto">
                          <button
                            type="button"
                            className="mx-4 btn btn-success font-s"
                            onClick={() => this.minuspage()}
                          >
                            Back
                          </button>
                          <span>
                            {this.state.numofpage}/{this.state.totalpage}
                          </span>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="mx-4 btn btn-success font-s"
                            onClick={() => this.pluspage()}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div
                  className={
                    this.state.bookings.length == 0 ? "d-block" : "d-none"
                  }
                >
                  <div className="text-center">
                    <span>Not have booking request</span>
                  </div>
                </div> */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withAuth(Admin, true);
