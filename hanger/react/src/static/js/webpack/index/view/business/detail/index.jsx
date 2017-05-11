var React = require('react');
var less = require('./index.less');
var Qrcode = require('../../../../../util/qrcode');
var indexService = require('../../../../../service/index.js');
var moment = require('moment');
import {message} from 'antd';

var main = React.createClass({
  getInitialState: function(){
    var me = this;
    return {
      businessId: this.props.params.businessId,
      detail: {},
      device: [],
      processStatus: {},
      diffTime: "",
      serviceUser: [],
      serviceUserDemo: [
        {
          userId: "",
          nickName: "",
          userName: "",
          phone: "",
          
        },
        {
          userId: "",
          nickName: "",
          userName: "",
          phone: "",
          
        }
      ],
      
    }
  },
  componentWillMount: function(){
    var me = this;
    me.getDetail()
  },
  componentDidMount: function(){
  },
  getDetail: function(){
    var me = this;
    var data = {
      businessId: this.state.businessId
    }
    indexService.getBusinessDetail(data).then((res)=>{
      if(res.status == 0){
        me.setState({
          detail: res.data.list,
          device: res.data.device,
          serviceUser: res.data.serviceUser,
          processStatus: res.data.processStatus
        })
        me.getDifTime(res.data.list.startTime)
        me.creatCode(res.data.device)
      }else{
        message.info(res.msg);
      }
    })
  },
  getDifTime: function(startTime){
    var now = moment().format("YYYY-MM-DD")
    var start = moment(startTime).format("YYYY-MM-DD")

    var dif = moment(now).diff(moment(start), "days")

    var months = moment(now).diff(moment(start), "months")
    var days = moment(now).diff(moment(start), "days")

    this.setState({
      diffTime: months+"个月"+(days%30)+"天"
    })
  },
  creatCode: function(device){
    var arr = [];
    for(var i=0; i<device.length; i++){
      arr.push("https://game.yuwanchat.com/v1/index/?device_id="+device[i].deviceId+"&game_id=1#/")
      var qrcode = new Qrcode(document.getElementById("qrcode"+(i+1)), {
        text: arr[i],
        width: 100,
        height: 100,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : Qrcode.CorrectLevel.Q
      });
    }
  },
  render: function () {
    var me = this;
    var detail = me.state.detail;
    var device = me.state.device;
    var serviceUser = me.state.serviceUser;
    var processStatus = me.state.processStatus;

    return (
      <div className="businessDetail">
        <div className="body">
          <div className="status">{processStatus.processName}</div>
          <div className="title">{detail.name}</div>
          <table>
            <tbody>
            <tr>
              <th>开始运营日期</th>
              <th>已运营时长</th>
              <th>合同到期时间</th>
            </tr>
            <tr>
              <td>{moment(detail.startTime).format("YYYY-MM-DD")}</td>
              <td>{me.state.diffTime}</td>
              <td>{moment(detail.endTime).format("YYYY-MM-DD")}</td>
            </tr>
            </tbody>
          </table>
          <table>
            <tbody>
            <tr>
              <th style={{width: 400}}>详细地址</th>
            </tr>
            <tr>
              <td>{detail.address}</td>
            </tr>
            </tbody>
          </table>
          <table>
            <tbody>
            <tr>
              <th>门店电话</th>
            </tr>
            <tr>
              <td>{detail.phone}</td>
            </tr>
            </tbody>
          </table>
          <table>
            <tbody>
            <tr>
              <th>设备类型</th>
              <th>设备数量</th>
              <th>网络类型</th>
              <th>占地面积（平方米）</th>
            </tr>
            <tr>
              <td>射击</td>
              <td>{device.length}</td>
              <td>{detail.networkType}</td>
              <td>{detail.areaSize}</td>
            </tr>
            </tbody>
          </table>
          <table className="textCenter">
            <thead>
              <tr>
                <th>枪支二维码</th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
            <tr>
              <td><div className="qrcode" id="qrcode1"></div><p style={{"width":"100px","textAlign":"center"}}>1号枪</p></td>
              <td><div className="qrcode" id="qrcode2"></div><p style={{"width":"100px","textAlign":"center"}}>2号枪</p></td>
              <td><div className="qrcode" id="qrcode3"></div><p style={{"width":"100px","textAlign":"center"}}>3号枪</p></td>
              <td><div className="qrcode" id="qrcode4"></div><p style={{"width":"100px","textAlign":"center"}}>4号枪</p></td>
            </tr>
            </tbody>
          </table>
        </div>

        <div className="operator">
          <div className="ul">

            {me.state.serviceUserDemo.map((v, k)=>{
              v = serviceUser[k] || v
              return (
                <div key={k} className="list">
                  <p>现场人员: {v.userName}</p>
                  <p>手机号: {v.phone}</p>
                  <p>微信号: {v.nickName}</p>
                </div>
              )
            })}

          </div>
          <div className="ul">
            <div className="list">
              <p>负责人: {detail.incharge}</p>
              <p>手机号: {detail.inchargePhone}</p>
            </div>
            <div className="list">
              <p>运营人: {detail.operator}</p>
              <p>手机号: {detail.operatorPhone}</p>
            </div>
          </div>
        </div>

      </div>
    )
  }
});

module.exports = main;