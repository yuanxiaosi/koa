var React = require('react');
var indexService = require('../../../../../service/index.js');
var getNewRegion = require('../../../../../util/getNewRegion.js');
var _ = require('lodash');
var less = require("./index.less")
import moment from 'moment';
import { Table, Icon, Button, message, DatePicker, Cascader, Select} from 'antd';
const {RangePicker } = DatePicker;
const Option = Select.Option;

var GoodsCountEcharts = require('./goodsCountEcharts.jsx')
var GoodsPointEcharts = require('./goodsPointEcharts.jsx')


function disabledDate(current) {
  // can not select days before today and today
  return current && current.valueOf() > Date.now();
}

var main = React.createClass({
  getInitialState: function(){
    var me = this;
    return {
      columns: [],
      data: [],
      tableHeader: {},
      total: 0,
      current: 1,
      pageSize: 20,
      startDate: moment(new Date().getTime()-1000*60*60*24).format("YYYY-MM-DD"),
      endDate: moment(new Date().getTime()-1000*60*60*24).format("YYYY-MM-DD"),
      surplusCoin: "",
      region: [],
      business: [],
      echartsBusiness: [],
      selectRegionId: "0",
      selectBusinessId: "0"
    }
  },
  componentWillMount: function(){ 
    this.getSurplusCoin()
    this.getRegion()
    this.getEchartsBusiness(0)
  },
  componentDidMount: function(){
    //this.getTableData(1);
  },
  search: function(){
    this.setState({current: 1})
    this.getTableData(1)
    this.getTableHeader()
  },
  tableExport: function(){
    var me = this;
    var data = {
      startDate: me.state.startDate,
      endDate: me.state.endDate,
      businessId: me.state.selectBusinessId.split('&')[0]
    }
    window.open(`/api/data/getPointExcel?startDate=${data.startDate}&endDate=${data.endDate}&businessId=${data.businessId}`)
  },
  getNewDataList: function(list){
    var me = this;
    for (var i=0; i<list.length; i++) {
      list[i]["key"] = i;
    }
    return list;
  },
  getColumns: function(arr){
    var me = this;
    var columns = [{
      title: '地区',
      key: 'cityName',
      width: 140,
      render: function(data, record) {
        return (<span>{record.region2Name+"-"+record.region3Name}</span>)
      }
    }, {
      title: '门店名称',
      dataIndex: 'businessName',
      key: 'businessName',
      width: 250,
    }, {
      title: '积分核销总数',
      dataIndex: 'point',
      key: 'point',
      width: 100,
    }, {
      title: '积分核销人数',
      dataIndex: 'pointUserCount',
      key: 'pointUserCount',
      width: 100,
    }, {
      title: '积分兑换商品数',
      key: 'pointgoodsCount',
      width: 80,
      render: function(data, record){
        return (<span>{record.pointgoodsCount}</span>)
      }
    }, {
      title: '充值核销总金额（元）',
      key: 'chargeExChargeAmount',
      width: 100,
      render: function(data, record) {
        return (<span>{(record.chargeExChargeAmount/100).toFixed(2)}</span>)
      }
    }, {
      title: '充值核销人数',
      dataIndex: 'chargeExUserCount',
      key: 'chargeExUserCount',
      width: 100,
    }, {
      title: '充值兑换商品数',
      key: 'chargeExGoodsCount',
      width: 80,
      render: function(data, record){
        return (<span>{record.chargeExGoodsCount}</span>)
      }
    }, {
      title: 'pk次数',
      key: 'pkTimes',
      width: 80,
      render: function(data, record){
        return (<span>{record.pkTimes}</span>)
      }
    }, {
      title: 'pk兑换商品数',
      key: 'pkExGoodsCount',
      width: 80,
      render: function(data, record){
        return (<span>{record.pkExGoodsCount}</span>)
      }
    }, {
      title: '总商品出库金额（元）',
      key: 'goodsAmount',
      width: 100,
      render: function(data, record) {
        return (<span>{((record.pointgoodsAmount+record.chargeExGoodsAmount+record.pkExGoodsAmount)/100).toFixed(2)}</span>)
      }
    }]
    me.setState({columns: columns})
    return columns
    
  },
  getSurplusCoin: function(){
    var me = this;
    indexService.getSurplusCoin().then(function(res){
      if(res.status == 0){
        me.setState({surplusCoin: res.data})
      }else{
        message.info(res.msg);
      }
    })


    /*var test = {
      body: [
        [
          ["1头1","1头2","1头3"],
          ["1内容1","1内容2","1内容3",]
        ],
        [
          ["2头1","2头2","2头3"],
          ["2内容1","2内容2","2内容3",]
        ],
        [
          ["3头1","3头2","3头3"],
          ["3内容1","3内容2","内容3",]
        ]
      ]
    }
    indexService.getExcel(test).then(function(res){
      if(res.status == 0){
        console.log(res.data)
        window.open(res.data)
      }else{
        message.info(res.msg);
      }
    })*/
  },
  getTableData: function(pageNo){
    var me = this;
    var data = {
      pageSize: me.state.pageSize,
      pageNo: pageNo,
      startDate: me.state.startDate,
      endDate: me.state.endDate,
      isExport: "false",
      businessId: me.state.selectBusinessId.split('&')[0]
    }
    indexService.financeIncomeDetail(data).then(function(res){
      if(res.status == 0){
        var columns = me.getColumns(res.data)
        var newList = me.getNewDataList(res.data.list)
        me.setState({
          data: newList,
          totalObj: res.data.total
        })
      }else{
        message.info(res.msg);
      }
    })
  },
  getTableHeader: function(){
    var me = this;
    var data = {
      startDate: me.state.startDate,
      endDate: me.state.endDate
    }
    indexService.getPointPlayRecordDetail(data).then(function(res){
      if(res.status == 0){
        me.setState({tableHeader: res.data})
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
        me.setState({business: res.data})
      }else{
        message.info(res.msg);
      }
    })
  },
  getEchartsBusiness: function(regionId){
    var me = this;
    indexService.getBusiness(regionId).then(function(res){
      if(res.status == 0){
        me.setState({echartsBusiness: res.data})
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
    this.setState({selectBusinessId: value})
  },
  RangePickerChange: function(value, dateString){
    //console.log('Selected Time: ', value);
    //console.log('Formatted Selected Time: ', dateString);
    this.setState({
      startDate: dateString[0],
      endDate: dateString[1]
    })
  },
  render: function () {
    var me = this;
    var columns = this.state.columns;
    var data = this.state.data;
    var totalObj = this.state.totalObj || {};
    var total = totalObj.totalCount || 0;
    var tableHeader = this.state.tableHeader;
    var pagination = {
      current: me.state.current,
      defaultPageSize: me.state.pageSize,
      total: parseInt(total),
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
      arr.push(<Option key={key} value={v.id+"&"+v.name}>{v.name}</Option>)
      return arr
    })

    return (
      <div className="dataIncomeDetail">
        <div className="total">
          <span>{me.state.surplusCoin}</span> 总剩余游戏币
        </div>
        <div className="header">
          <div className="list" style={{width: 400}}>
            <span>选择时间：</span>
            <RangePicker
                defaultValue={[moment(me.state.startDate), moment(me.state.endDate)]}
                disabledDate={disabledDate}
                size="large"
                format="YYYY-MM-DD"
                placeholder={['Start Time', 'End Time']}
                onChange={this.RangePickerChange}
              />
          </div>
          <div className="list" style={{width: 300}}>
            <span>地区：</span>
            <Cascader style={{"marginTop":"-5px", "width":"220px"}} options={me.state.region} onChange={me.regionChange} defaultValue={["0"]} placeholder="请选择省市区" size="large" showSearch/>
          </div>
          <div className="list" style={{width: 200}}>
            <span>门店：</span>
            <Select value={me.state.selectBusinessId} style={{ width: 120 }} onChange={me.businessChange} showSearch>
              <Option className={me.state.selectRegionId!="0"?"hide":""} key="-1" value="0">全部</Option>
              {businessOption}
            </Select>
          </div>
          <div className="list">
            <Button size="large" type="primary" onClick={this.search}>筛选</Button>
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
                <div className="list"><span>{tableHeader.surplus}</span>剩余游戏币</div>
                <div className="list"><span>{tableHeader.pointAvg}</span>每局平均积分</div>
                <div className="list"><span>{tableHeader.time}</span>每局平均时长</div>
              </div>
            )
          }}
          footer={() => {
            return (
              <Button onClick={this.tableExport} size="large" type="primary">导出</Button>
            )
          }}
        />

        {
          me.state.echartsBusiness.length > 0 && me.state.region.length > 0 ? <GoodsCountEcharts region={me.state.region} business={me.state.echartsBusiness} /> : ""
        }

        {
          me.state.echartsBusiness.length > 0 && me.state.region.length > 0 ? <GoodsPointEcharts region={me.state.region} business={me.state.echartsBusiness} /> : ""
        }

      </div>
    )
  }
});

module.exports = main;