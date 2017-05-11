var React = require('react');
var indexService = require('../../../../../service/index.js');
var getNewRegion = require('../../../../../util/getNewRegion.js');
var less = require("./index.less");
var _ = require("lodash");
var debounce = require('lodash.debounce');
var moment = require('moment');
import { Input, Cascader, DatePicker, Select, Modal, message, Spin } from 'antd';
const Option = Select.Option;

var main = React.createClass({
  getInitialState: function(){
    var me = this;
    return {
      userList: [],
      fetching: false,
      lastFetchId: 0,

      businessId: this.props.params.businessId,
      processA: [],
      processB: [],
      inchargeList: [],
      selectedProcessA: "",
      selectedProcessB: "",
      selectedInchargeA: "",
      selectedInchargeB: "",
      name: "",
      address: "",
      defaultRegionValue: ["0"],
      region: [],
      region1: "",
      region2: "",
      region3: "",
      startTime: moment(),
      endTime:  moment(),
      boxOffice: "",
      areaSize: "",
      networkType: "",
      contact: "",
      contactPhone: "",
      incharge: "",
      inchargePhone: "",
      operator: "",
      operatorPhone: "",
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
      ]
    }
  },
  componentWillMount: function(){
    var me = this;
    me.getRegion();
    me.getProcessStatus();

    
  },
  componentDidMount: function(){
    var me = this;
    if(me.state.businessId != 0){ //非0：编辑页面，需要请求数据回填
      me.getDetail();
    }
  },
  getDetail: function(){
    var me = this;
    var data = {
      businessId: this.state.businessId
    }
    indexService.getBusinessDetail(data).then((res)=>{
      if(res.status == 0){
       me.pushData(res.data)
      }else{
        message.info(res.msg);
      }
    })
  },
  pushData: function(data){ //数据填充
    var me = this;
    var list = data.list;
    var processStatus = data.processStatus;
    var serviceUser = data.serviceUser.length == 0?me.state.serviceUser:data.serviceUser;

    var defaultRegionValue = [];
    defaultRegionValue.push(list.region1)
    defaultRegionValue.push(list.region2)
    defaultRegionValue.push(list.region3)

    var processA = me.state.processA;
    var processB = me.state.processB;

    for(var i=0; i<processA.length; i++){
      for(var j=0; j<processA[i].children.length; j++){
        if(processA[i].children[j].processCode == list.processCode){
          console.log("process:", i, j)
          me.processAChange(i+"", _.bind(me.processBChange, me, j+""))
        }
      }
    }

    me.setState({
      name: list.name,
      address: list.address,
      defaultRegionValue: defaultRegionValue,
      region1: list.region1,
      region2: list.region2,
      region3: list.region3,
      startTime: moment(list.startTime),
      endTime: moment(list.endTime),
      boxOffice: list.boxOffice,
      areaSize: list.areaSize,
      networkType: list.networkType,
      contact: list.contact,
      contactPhone: list.contactPhone,
      incharge: list.incharge,
      inchargePhone: list.inchargePhone,
      operator: list.operator,
      operatorPhone: list.operatorPhone,
      serviceUser: serviceUser
    })
  },
  getNewProcessStatus: function(data){
    var me = this;
    var processA = [];
    var processB = [];
    var inchargeList = [];
    var A = {};
    for(var i=0; i<data.length; i++){
      inchargeList.push({
        processCode: data[i].processCode,
        userName: data[i].userName
      })
      if(data[i].pid == 0){
        data[i].children = [];
        A[data[i].id] = data[i]
      }
    }
    for(var i=0; i<data.length; i++){
      if(data[i].pid != 0){
        A[data[i].pid].children.push(data[i])
      }
    }
    
    for(var i in A){
      processA.push(A[i]);
    }
    //processB = processA[0].children
    me.setState({
      processA: processA,
      processB: processB,
      inchargeList: inchargeList,
    })
  },
  getProcessStatus: function(){
    var me = this;
    var data = {
      all: "true"
    };
    indexService.getProcessStatus(data).then(function(res){
      if(res.status == 0){
        me.getNewProcessStatus(res.data)
        me.setState({processStatus: res.data})
      }else{
        message.info(res.msg);
      }
    })
  },
  getRegion: function(){
    var me = this;
    var data = {
      status: "0"
    }
    indexService.getRegion(data).then(function(res){
      if(res.status == 0){
        var newRegion = getNewRegion(res.data, true)
        me.setState({
          region: newRegion
        })
      }else{
        message.info(res.msg);
      }
    })
  },
  inputChange: function(name, e){
    var me = this;
    var obj = {};
    obj[name] = e.target.value
    this.setState(obj)
  },
  timeChange: function(name, v){
    var me = this;
    var obj = {};
    obj[name] = v;
    this.setState(obj);
  },
  regionChange: function(value){
    var me = this;
    if(value.length == 0){
      value = ["", "", ""]
    }
    if(value == "0"){
      value = ["", "", ""]
    }
    me.setState({
      region1: value[0]+"",
      region2: value[1]+"",
      region3: value[2]+"",
      defaultRegionValue: value
    })
  },
  processAChange: function(v, cb){
    var processA = this.state.processA;
    var processB = processA[v].children;
    this.setState({
      processB: processB,
      selectedProcessA: v,
      selectedProcessB: "",
      selectedInchargeA: "",
      selectedInchargeB: "",
    }, ()=>{
      if(cb) cb();
    });
  },
  processBChange: function(v){
    var processB = this.state.processB;
    var inchargeList = this.state.inchargeList;
    var processCode = processB[v].processCode;
    
    var pre = "";
    var next = "";

    for(var i=0; i<inchargeList.length; i++){
      if(processCode == inchargeList[i].processCode){
        pre = inchargeList[i].userName;
        next = inchargeList[i+1]?inchargeList[i+1].userName:inchargeList[i].userName;
      }
    }
    this.setState({
      selectedProcessB: v,
      selectedInchargeA: pre,
      selectedInchargeB: next,
    });
  },
  serviceUserChange: function(v, k, e){
    var serviceUser = this.state.serviceUser;
    var serviceUserDemo = this.state.serviceUserDemo;
    var obj = serviceUser[k]?serviceUser:serviceUserDemo
    obj[k][v] = e.target.value
    this.setState({serviceUser: obj})
  },
  save: function(){
    var me = this;
    var meState = me.state;

    var telReg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
    if(!telReg.test(me.state.contactPhone)){
      return message.info("请输入联系人的正确手机号码")
    }
    if(!telReg.test(me.state.inchargePhone)){
      return message.info("请输入负责人的正确手机号码")
    }
    if(!telReg.test(me.state.operatorPhone)){
      return message.info("请输入运营人的正确手机号码")
    }

    for(var i=0; i<meState.serviceUser.length; i++){
      if(meState.serviceUser[i].userId != ""){
        if(!telReg.test(meState.serviceUser[i].phone)){
          return message.info("请输入现场人员的正确手机号码")
        }
      }
    }


    var data = {
      name: meState.name,
      address: meState.address,
      region1: meState.region1?meState.region1:"",
      region2: meState.region2?meState.region2:"",
      region3: meState.region3?meState.region3:"",
      startTime: meState.startTime,
      endTime: meState.endTime,
      boxOffice: meState.boxOffice,
      areaSize: meState.areaSize,
      networkType: meState.networkType,
      contact: meState.contact,
      contactPhone: meState.contactPhone,
      incharge: meState.incharge,
      inchargePhone: meState.inchargePhone,
      operator: meState.operator,
      operatorPhone: meState.operatorPhone,
      processCode: meState.selectedProcessB==""?"":meState.processB[meState.selectedProcessB].processCode,
      serviceUser: meState.serviceUser
    }
    if(meState.businessId == 0){
      me.addSave(data)
    }else{
      data.id = parseInt(meState.businessId)
      me.updateSave(data)
    }
  },
  addSave: function(data){
    var me = this;
    indexService.businessAdd(data).then((res)=>{
      if(res.status == 0){
        me.showModal("添加保存成功！", "reload")
      }else{
        message.info(res.msg);
      }
    })
  },
  updateSave: function(data){
    var me = this;
    indexService.businessUpdate(data).then((res)=>{
      if(res.status == 0){
        me.showModal("编辑修改成功！", "back")
      }else{
        message.info(res.msg);
      }
    })
  },
  showModal: function(msg, action){
    Modal.success({
      title: 'This is a success tips',
      content: msg,
      onOk: function(){
        if(action == "back"){
          window.location.href= "#/business/list";
        }
        if(action == "reload"){
          window.location.reload()
        }
      }
    });
  },
  fetchUser: function(value){
    var me = this;

    if(value == ""){
      return
    }

    me.state.lastFetchId += 1;
    var fetchId = me.state.lastFetchId;
    this.setState({ fetching: true });
    var data = {
      nickName : encodeURIComponent(value)
    }
    indexService.userfuzzyGet(data).then((res)=>{
      if (fetchId !== me.state.lastFetchId) { // for fetch callback order
        return;
      }
      var userList = res.data
      this.setState({ userList: userList });

    })
  },
  fetchUserChange: function(k, v){

    var serviceUserDemo = this.state.serviceUserDemo;
    serviceUserDemo[k].userId = v?v.key:"";
    serviceUserDemo[k].nickName = v?v.label[0]:"";
    this.setState({
      serviceUser: serviceUserDemo,
      userList: [],
      fetching: false,
    });
  },
  render: function () {
    var me = this;
    var fetching = me.state.fetching;
    var userList = me.state.userList || [];

    var processAOption = me.state.processA.map((v, k)=>{
      return(<Option key={k} value={k+""}>{v.processName}</Option>)
    })
    var processBOption = me.state.processB.map((v, k)=>{
      return(<Option key={k} value={k+""}>{v.processName}</Option>)
    })
    
    var serviceUser = me.state.serviceUser;
    var serviceUserDiv = me.state.serviceUserDemo.map((v, k)=>{
      v = serviceUser[k] || v
      return (
        <div className="serviceUser" key={k}>
          <div className="item">
            <div className="label">现场工作人员：</div>
            <div className="ct">
              <Input value={v.userName} size="large" onChange={_.bind(me.serviceUserChange, me, "userName", k)} placeholder="输入现场工作人员姓名" />
            </div>
          </div>
          <div className="item">
            <div className="label">手机号：</div>
            <div className="ct">
              <Input value={v.phone} size="large" onChange={_.bind(me.serviceUserChange, me, "phone", k)} placeholder="输入现场工作人员手机号" />
            </div>
          </div>
          <div className="item">
            <div className="label">微信昵称：</div>
            <div className="ct">
              <Select
                allowClear={true}
                value={{key: v.userId, label: v.nickName}}
                showSearch
                mode="multiple"
                labelInValue
                placeholder="Select users"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={debounce(me.fetchUser, 800)}
                onChange={_.bind(me.fetchUserChange, me, k)}
                style={{ width: '100%' }}
              >

                {userList.map((uv, uk)=>{
                  return(
                    <Option key={uk} value={uv.userId}>
                      {decodeURIComponent(uv.nickName)}
                      <img style={{width:25, height:25, display: "inline-block", marginTop: -5, marginLeft: 5, verticalAlign: "middle"}} className="userHeadPic" src={uv.headPic} />
                    </Option>
                  )
                })}
              </Select>
              
            </div>
          </div>
        </div>
      )
    })
    
    return (
      <div className="BusinessAdd">
        <div className="header">{me.state.businessId == 0?"添加门店":"编辑门店"}</div>

        <div className="list msg">
          <div className="title">门店信息</div>
          <div className="body">
            <div className="lf">
              <div className="item">
                <div className="label">名称：</div>
                <div className="ct">
                  <Input value={me.state.name} size="large" onChange={_.bind(me.inputChange, me, "name")} placeholder="输入影院名称" />
                </div>
              </div>
              <div className="item">
                <div className="label">地址：</div>
                <div className="ct">
                  <Input value={me.state.address} size="large" onChange={_.bind(me.inputChange, me, "address")} placeholder="输入影院详细地址" />
                </div>
              </div>
              <div className="item">
                <div className="label">区域：</div>
                <div className="ct">
                  <Cascader value={me.state.defaultRegionValue} style={{"marginTop":"-5px", "width":"220px"}} options={me.state.region} onChange={me.regionChange} placeholder="请选择省市区" size="large" showSearch/>
                </div>
              </div>
              <div className="item">
                <div className="label">运营日期：</div>
                <div className="ct">
                  <DatePicker value={me.state.startTime==""?"":me.state.startTime} size="large" onChange={_.bind(me.timeChange, me, "startTime")} placeholder="请输入开始运营日期" />
                </div>
              </div>
              <div className="item">
                <div className="label">合同到期日：</div>
                <div className="ct">
                  <DatePicker value={me.state.endTime} size="large" onChange={_.bind(me.timeChange, me, "endTime")} placeholder="请输入合同到期日期" />
                </div>
              </div>
            </div>
            <div className="rg">
              <div className="item">
                <div className="label">票房/规模：</div>
                <div className="ct">
                  <Input value={me.state.boxOffice} size="large" onChange={_.bind(me.inputChange, me, "boxOffice")} placeholder="请输入影院票房/规模（万元）" />
                </div>
              </div>
              <div className="item">
                <div className="label">占地面积：</div>
                <div className="ct">
                  <Input value={me.state.areaSize} size="large" onChange={_.bind(me.inputChange, me, "areaSize")} placeholder="请输入影院占面积" />
                </div>
              </div>
              <div className="item">
                <div className="label">网络类型：</div>
                <div className="ct">
                  <Input value={me.state.networkType} size="large" onChange={_.bind(me.inputChange, me, "networkType")} placeholder="请输入影院网络类型" />
                </div>
              </div>
              <div className="item">
                <div className="label">联系人：</div>
                <div className="ct">
                  <Input value={me.state.contact} size="large" onChange={_.bind(me.inputChange, me, "contact")} placeholder="输入合作方联系人姓名" />
                </div>
              </div>
              <div className="item">
                <div className="label">联系人电话：</div>
                <div className="ct">
                  <Input value={me.state.contactPhone} size="large" onChange={_.bind(me.inputChange, me, "contactPhone")} placeholder="输入合作方联系人电话" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="list">
          <div className="title">门店状态</div>
          <div className="body">
            <div className="tb">
              <div className="thCt">状态选择</div>
              <div className="thCt">状态进度</div>
              <div className="thCt">当前负责人</div>
              <div className="thCt">扭转至负责人</div>
            </div>
            <div className="tb">
              <div className="thCt">
                <Select showSearch value={me.state.selectedProcessA} style={{ width: 150 }} placeholder="请选择门店状态" onChange={me.processAChange}>
                  {processAOption}
                </Select>
              </div>
              <div className="thCt">
                <Select showSearch value={me.state.selectedProcessB} style={{ width: 150 }} placeholder="请选择状态进度" onChange={me.processBChange}>
                  {processBOption}
                </Select>
              </div>
              <div className="thCt">
                <Select showSearch value={me.state.selectedInchargeA} disabled style={{ width: 150 }} placeholder="">
                </Select>
              </div>
              <div className="thCt">
                <Select showSearch value={me.state.selectedInchargeB} disabled style={{ width: 150 }} placeholder="">
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="list">
          <div className="title">项目负责人</div>
          <div className="body">
            <div className="lf">
              <div className="item">
                <div className="label">负责人：</div>
                <div className="ct">
                  <Input value={me.state.incharge} size="large" onChange={_.bind(me.inputChange, me, "incharge")} placeholder="请输入负责人姓名" />
                </div>
              </div>
              <div className="item">
                <div className="label">负责人手机：</div>
                <div className="ct">
                  <Input value={me.state.inchargePhone} size="large" onChange={_.bind(me.inputChange, me, "inchargePhone")} placeholder="请输入负责人手机" />
                </div>
              </div>
            </div>
            <div className="rg">
              <div className="item">
                <div className="label">运营人员：</div>
                <div className="ct">
                  <Input value={me.state.operator} size="large" onChange={_.bind(me.inputChange, me, "operator")} placeholder="输入运营人员姓名" />
                </div>
              </div>
              <div className="item">
                <div className="label">运营人员手机：</div>
                <div className="ct">
                  <Input value={me.state.operatorPhone} size="large" onChange={_.bind(me.inputChange, me, "operatorPhone")} placeholder="输入运营人员手机" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="list">
          <div className="title">现场工作人员</div>
          <div className="body">

            {serviceUserDiv}
          </div>
        </div>

        <div className="list">
          <div className="btn" onClick={me.save}>{me.state.businessId=="0"?"添加":"保存"}</div>
        </div>
        
      </div>
    )
  }
});

module.exports = main;