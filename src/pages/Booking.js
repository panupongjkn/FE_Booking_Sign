import React from 'react'
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import { Link } from "react-router-dom";
import sweetalert from 'sweetalert2'

class Booking extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            applicant : "",
            organization : "",
            signname : "",
            firstdate : new Date(),
            lastdate : new Date(),
            signs : []
        }
    }   
    componentDidMount() {
        this.fetchSigns()
    }
    handleChange = (event, state) => {
        this.setState({[state]: event})
    }
    fetchSigns = async () => {
        await axios.get('http://127.0.0.1:3000/allsign').then(signs => {
            if(signs.data.signs != null) {
                this.setState({
                    signs : signs.data.signs,
                    signname : signs.data.signs[0].name
                })
            }
        }).catch(err => {
            window.location.href = `/error/${err.response.status}`;
        })
    }
    handleBooking = () => {
        var bodyFormData = new FormData();
        bodyFormData.set('applicant', this.state.applicant);
        bodyFormData.append('organization', this.state.organization);
        bodyFormData.append('signname', this.state.signname);
        bodyFormData.append('firstdate', moment(this.state.firstdate).format('YYYY-MM-DD'));
        bodyFormData.append('lastdate', moment(this.state.lastdate).format('YYYY-MM-DD'));
        if (this.checkForm()) {
            sweetalert.fire({
                title: `คุณ ${this.state.applicant} ยืนยันจะจองป้ายตามนี้ใช่ไหม?`,
                text: `ป้าย ${this.state.signname} วันที่ ${moment(this.state.firstdate).format('YYYY-MM-DD')} ถึง ${moment(this.state.lastdate).format('YYYY-MM-DD')}`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ใช่',
                cancelButtonText: 'ไม่ใช่'
              }).then((result) => {
                if (result.value) {
                    this.postBooking(bodyFormData)
                }
              })
        }
    }
    postBooking = (bodyFormData) => {
        axios({
            method: 'post',
            url: 'http://127.0.0.1:3000/addbooking',
            data: bodyFormData,
            headers: { 
              "Content-Type": "application/x-www-form-urlencoded",
            }
          }).then(status =>{
              let booking = status.data
              sweetalert.fire({
                type: 'success',
                title : `คุณ ${booking.applicant} ได้ทำการจองป้าย ${booking.sign.name}`,
                text: `ในวันที่ ${moment(booking.first_date).format('YYYY-MM-DD')} ถึง ${moment(booking.last_date).format('YYYY-MM-DD')}`,
                showConfirmButton: false,
                timer: 5000
              }).then((status) => {
                window.location.href = '/'
            })
          }).catch(err => {
              console.log(err)
            sweetalert.fire({
                type: 'error',
                title: `${err.response.data}`,
              })
          })
    }
    checkForm() {
        if(this.state.applicant !== "" && this.state.organization !== "" && this.state.signname !== ""){
            if(this.state.firstdate <= this.state.lastdate){
                return true
            }
                sweetalert.fire({
                type: 'error',
                title: `คุณเลือกวันที่ไม่ถูกต้อง`,
              })
                return false
        }
            sweetalert.fire({
            type: 'error',
            title: `คุณกรอกข้อมูลไม่ครบ`,
          })
            return false
        
    }
    render() {
        return (
            <div>
                <div>Booking Sign</div>
                <form>
                    <div className="form-group">
                        <label>ชื่อผู้ขอเช่า</label>
                        <input type="text" class="form-control" value={this.state.applicant} onChange={(e) => this.handleChange(e.target.value, "applicant")}/>
                        <label>ชื่อองค์กรผู้ขอเช่า</label>
                        <input type="text" class="form-control" value={this.state.organization} onChange={(e) => this.handleChange(e.target.value, "organization")}/>
                        <label>ป้ายที่ต้องการเช่า</label>
                        <select class="form-control" onChange={(e) => this.handleChange(e.target.value, "signname")}>
                            {this.state.signs.map((value => {
                                return (
                                    <option value={value.name}>{value.name} {value.location}</option>
                                )
                            }))}
                        </select>
                        <label>วันที่ต้องการเช่า  </label>
                        <DatePicker
                            selected={this.state.firstdate}
                            onChange={(e) => this.handleChange(e, "firstdate")}
                        />
                        <span> To </span>
                        <DatePicker
                            selected={this.state.lastdate}
                            onChange={(e) => this.handleChange(e, "lastdate")}
                        />
                    </div>
                    <button type="button" class="btn btn-success" onClick={this.handleBooking}>ทำการจอง</button>
                </form>
                <div>
                    <Link to="/">
                        <button type="button" class="btn btn-warning">กลับ</button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default Booking