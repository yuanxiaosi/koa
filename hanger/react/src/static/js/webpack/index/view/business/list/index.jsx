var React = require('react');
var moment = require('moment');
var indexService = require('../../../../../service/index.js');
var getNewRegion = require('../../../../../util/getNewRegion.js');
var less = require("./index.less")
import model from '../../../../../model/index.js';
import { Table, Icon, Button, message, DatePicker, Select, Cascader} from 'antd';
const { RangePicker } = DatePicker;
const Option = Select.Option;

var main = React.createClass({
  getInitialState: function(){
    var me = this;
    return {
      columns: [{
        title: '地区',
        key: 'region3',
        render: (data, record) => {
          return (
            <div>{record.region2Name + "-" +record.region3Name}</div>
          )
        }
      }, {
        title: '门店',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '负责人',
        key: 'incharge',
        dataIndex: 'incharge',
      }, {
        title: '面积（平方米）',
        key: 'areaSize',
        dataIndex: 'areaSize',
      }, {
        title: '门店状态',
        key: 'processCode',
        render: (data, record) => {
          var color
          if(record.processCode == "60"){
            color = "#00b59d"
          }else if(record.processCode == "61"){
            color = "#999" 
          }else{
            color = "#ffa500"
          }
          return (
            <div><a style={{color: color}} href={"#/processStatus/"+record.id}>{record.processStatus.processName}</a></div>
          )
        }
      }, {
        title: '现场人员',
        key: 'serviceUser',
        render: (data, record) => {
          var arr = []
          var serviceUser = record.serviceUser || [];
          for(var i=0; i<serviceUser.length;i++){
            arr.push(serviceUser[i].userName)
          }
          return (
            <div>{arr.join(",")}</div>
          )
        }
      }, {
        title: '操作',
        key: 'action',
        render: (data, record) => {
          return (
            <div>
              <span>
                <a href={"#/business/detail/"+record.id}>详情</a>
              </span>
              <span> &nbsp; | &nbsp; </span>
              <span>
                <a href={"#/business/add/"+record.id}>编辑</a>
              </span>
            </div>
          )
        },
      }],
      data: [],
      total: 0,
      current: 1,
      pageSize: 20,
      region: [],
      business: [],
      processStatus: [],
      selectProcessStatus: "0",
      selectRegionId: "0",
      selectBusinessId: "0"
    }
  },
  componentWillMount: function(){
    var me = this;
    me.getRegion();
    me.getProcessStatus();
  },
  componentDidMount: function(){
    this.getTableData(1);
  },
  getProcessStatus: function(){
    var me = this;
    var data = {
      all: "false"
    };
    indexService.getProcessStatus(data).then(function(res){
      if(res.status == 0){
        me.setState({processStatus: res.data})
      }else{
        message.info(res.msg);
      }
    })
  },
  getRegion: function(){
    var me = this;
    var data = {
      status: "1"
    }
    indexService.getRegion(data).then(function(res){
      if(res.status == 0){
        var newRegion = getNewRegion(res.data)
        me.setState({
          region: newRegion
        })
        me.getBusiness(0)
      }else{
        message.info(res.msg);
      }
    })
  },
  getBusiness: function(regionId){
    var me = this;
    indexService.getBusiness(regionId).then(function(res){
      if(res.status == 0){
        var newArr = [];
        for(var i=0; i<res.data.length; i++){
          var obj = {}
          obj.value = res.data[i].id
          obj.label = res.data[i].name
          obj.key = i
          newArr.push(obj)
        }
        me.setState({business: newArr})
      }else{
        message.info(res.msg);
      }
    })
  },
  getNewDataList: function(list){
    var me = this;
    var newList = [];
    for (var k in list) {
      list[k]["key"] = k;
      newList.push(list[k]);
    }
    return newList;
  },
  getTableData: function(pageNo){
    var me = this;
    var data = {
      businessId: me.state.selectBusinessId,
      processStatus: me.state.selectProcessStatus,
      pageNo: pageNo,
      pageSize: me.state.pageSize,
      isExport: "false"
    }
    indexService.getBusinessList(data).then((res)=>{
      if(res.status == 0){
        var list = me.getNewDataList(res.data.list) 
        me.setState({data: list, total: res.data.total})
      }else{
        message.info(res.msg);
      }
    })
    
  },
  regionChange: function(value){
    var me = this;
    var regionId = 0;
    if(value[0] == 0){
      regionId = 0;
      me.setState({
        selectRegionId: regionId,
        selectBusinessId: "0"
      })
    }else{
      regionId = value[2]
      me.setState({
        selectRegionId: regionId,
        selectBusinessId: ""
      })
    }
    me.getBusiness(regionId);
  },
  businessChange: function(value){
    var me = this;
    me.setState({
      selectBusinessId: value
    })
  },
  processStatusChange: function(v){
    this.setState({selectProcessStatus: v})
  },
  search: function(){
    this.getTableData(1);
  },
  tableExport: function(){
    var me = this;
    var data = {
      businessId: me.state.selectBusinessId,
      processStatus: me.state.selectProcessStatus,
      isExport: "true"
    }
    window.open(`/api/business/list?isExport=${data.isExport}&businessId=${data.businessId}&processStatus=${data.processStatus}`)
  },
  clickAddBtn: function(){
    window.location.href="#/business/add/0"
  },
  render: function () {
    var me = this;
    var columns = this.state.columns;
    var data = this.state.data;
    var total = this.state.total;

    var pagination = {
      defaultPageSize: me.state.pageSize,
      total: total,
      showSizeChanger: false,
      onShowSizeChange: (current, pageSize) => {
        me.setState({current: current})
        me.getTableData(current)
      },
      onChange: (current) => {
        me.setState({current: current})
        me.getTableData(current)
      },
    };

    var businessOption = me.state.business.map(function(v, key){
      var arr = [];
      arr.push(<Option key={key} value={v.value+""}>{v.label}</Option>)
      return arr
    })

    var processStatusOption = me.state.processStatus.map(function(v, key){
      var arr = [];
      arr.push(<Option key={key} value={v.processCode+""}>{v.processName}</Option>)
      return arr
    })

    return (
      <div className="businessList">
        <div className="header">
          <div className="list">
            <span>地区：</span>
            <Cascader style={{"marginTop":"-5px", "width":"220px"}} options={me.state.region} onChange={me.regionChange} defaultValue={["0"]} placeholder="请选择省市区" size="large" showSearch/>
          </div>
          <div className="list">
            <span>门店：</span>
            <Select value={me.state.selectBusinessId} style={{ width: 120 }} onChange={me.businessChange} showSearch>
              <Option className={me.state.selectRegionId!="0"?"hide":""} key="-1" value="0">全部</Option>
              {businessOption}
            </Select>
          </div>
          <div className="list">
            <span>状态：</span>
            <Select value={me.state.selectProcessStatus} style={{ width: 120 }} onChange={me.processStatusChange} showSearch>
              <Option key="-1" value="0">全部</Option>
              {processStatusOption}
            </Select>
          </div>
          <div className="list"><Button size="large" type="primary" onClick={this.search}>筛选</Button></div>
          <div className="list">
            <div className="addBtn" onClick={this.clickAddBtn}><span>添加门店</span></div>
          </div>
        </div>
        <Table
          pagination={pagination}
          columns={columns}
          dataSource={data}
          bordered
          title={() => {
            return (
              <div className="sum">
                <div className="list"><span>{total}</span>家门店</div>
              </div>
            )
          }}
          footer={() => {
            return (
              <Button onClick={this.tableExport} size="large" type="primary">导出</Button>
            )
          }}
        />
      </div>
    )
  }
});

module.exports = main;