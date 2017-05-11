var React = require('react');
var less = require("./index.less");
var _ = require("lodash");
var indexService = require('../../../../../service/index.js');
var canvasAction = require('../../../../../util/canvas.js');
import { Select, message, Modal } from 'antd';
const Option = Select.Option;

var main = React.createClass({
  getInitialState: function(){
    var me = this;
    return {
      businessId: this.props.params.businessId,
      processA: [],
      processB: [],
      inchargeList: [],
      selectedProcessA: "",
      selectedProcessB: "",
      selectedInchargeA: "",
      selectedInchargeB: "",
      canvasApi: "",
    }
  },
  componentWillMount: function(){
    var me = this;
    
    me.getProcessStatus();
  },
  componentDidMount: function(){
    var me = this;
    
    me.initCanvas();
  },
  processAjax: function(){
    var me = this;
    var data = {
      id: me.state.businessId
    }
    indexService.getProcessByBusinessId(data).then((res)=>{
      if(res.status == 0){
       me.pushData(res.data)
      }else{
        message.info(res.msg);
      }
    })
  },
  initCanvas: function(){
    var me = this;
    var  canvasApi = new canvasAction("processCanvas");
    canvasApi.draw(0);
    me.setState({
      canvasApi: canvasApi
    })

    me.processAjax();
  },
  pushData: function(data){
    var me = this;
    var processA = me.state.processA;
    var processB = me.state.processB;

    for(var i=0; i<processA.length; i++){
      for(var j=0; j<processA[i].children.length; j++){
        if(processA[i].children[j].processCode == data.processCode){
          console.log("process:", i, j)
          me.processAChange(i+"", _.bind(me.processBChange, me, j+""))
        }
      }
    }
  },
  getNewProcessStatus: function(data){
    var me = this;
    var processA = [];
    var processB = [];
    var inchargeList = [];
    var A = {};

    var status = 1;

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

        //添加流程标记，可以记录当前对象是第几个流程
        data[i].status = status;
        status ++ ;

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
    var me = this;
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

    me.state.canvasApi.draw(processB[v].status)//更新流程图
  },
  update: function(){
    var me = this;

    if(me.state.selectedProcessB == ""){
      return message.info('门店状态不能为空!')
    }

    var data = {
      id: parseInt(me.state.businessId),
      processCode: me.state.processB[me.state.selectedProcessB].processCode
    }
    indexService.updateProcessByBusinessId(data).then((res)=>{
      if(res.status == 0){
        me.showModal("添加保存成功！", "back")
      }else{
        message.info(res.msg)
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
  render: function () {
    var me = this;

    var processAOption = me.state.processA.map((v, k)=>{
      return(<Option key={k} value={k+""}>{v.processName}</Option>)
    })
    var processBOption = me.state.processB.map((v, k)=>{
      return(<Option key={k} value={k+""}>{v.processName}</Option>)
    })

    return (
      <div className="processStatus">
        <div className="header">深圳中影新美国际影城</div>
        <div className="ct">
          <div className="title">当前进度：</div>
          <canvas id="processCanvas" width="900" height="300"></canvas>
        </div>
        <div className="ct">
          <div className="title">状态扭转：</div>
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
        <div className="btn" onClick={this.update}>提交修改</div>
      </div>
    )
  }
});

module.exports = main;