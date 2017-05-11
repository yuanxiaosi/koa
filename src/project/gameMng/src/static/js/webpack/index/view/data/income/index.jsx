var React = require('react');
var indexService = require('../../../../../service/index.js');
var getNewRegion = require('../../../../../util/getNewRegion.js');
var _ = require('lodash');
var less = require("./index.less")
import moment from 'moment';
import { Table, Icon, Button, message, DatePicker, Cascader, Select} from 'antd';
const {RangePicker } = DatePicker;
const Option = Select.Option;

var IncomeEcharts = require('./incomeEcharts.jsx')
var StallBuy = require('./stallBuy.jsx')
var StallCharge = require('./stallCharge.jsx')


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
      total: 0,
      current: 1,
      pageSize: 20,
      startDate: moment(new Date().getTime()-1000*60*60*24).format("YYYY-MM-DD"),
      endDate: moment(new Date().getTime()-1000*60*60*24).format("YYYY-MM-DD"),
      region: [],
      business: [],
      echartsBusiness: [],
      selectRegionId: "0",
      selectBusinessId: "0"
    }
  },
  componentWillMount: function(){ 
  },
  componentDidMount: function(){
    //this.getTableData(1);
    this.getRegion();
    this.getEchartsBusiness(0);
  },
  search: function(){
    this.setState({current: 1})
    this.getTableData(1)
  },
  tableExport: function(){
    var me = this;
    var data = {
      startDate: me.state.startDate,
      endDate: me.state.endDate,
      isExport: "true",
      businessId: me.state.selectBusinessId.split("&")[0]
    }
    window.open(`/api/finance/incomeDetail?isExport=${data.isExport}&businessId=${data.businessId}&startDate=${data.startDate}&endDate=${data.endDate}`)
  },
  getNewDataList: function(data, columns){
    var me = this;
    var list = data.list;
    var itemsList = data.itemsList;
    var obj = {};
    for (var i=0; i<list.length; i++) {
      list[i]["key"] = i;
      obj[list[i].businessId] = list[i]
      for(var j=0; j<columns.length; j++){
        obj[list[i].businessId][columns[j].options] = 0;
      }
    }
    for (var i=0; i<itemsList.length; i++) {
      if(!obj[itemsList[i].businessId]) continue; //日报表里面没有新加影院--- 做异常处理
      obj[itemsList[i].businessId][itemsList[i].options] += parseInt(itemsList[i].val)
    }
    return list;
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
  getColumns: function(arr){
    var me = this;
    var columns = [{
      title: '地区',
      key: 'cityName',
      width: 120,
      render: function(data, record) {
        return (<span>{record.region2Name+"-"+record.region3Name}</span>)
      }
    }, {
      title: '门店名称',
      dataIndex: 'businessName',
      key: 'businessName',
      width: 250,
    }, {
      title: '购买人数',
      dataIndex: 'buyuserCount',
      key: 'buyuserCount',
      width: 80,
    }, {
      title: '购买次数',
      dataIndex: 'buyTimes',
      key: 'buyTimes',
      width: 80,
    }, {
      title: '购买金额（元）',
      key: 'buyAmount',
      width: 100,
      render: function(data, record) {
        return (<span>{(record.buyAmount/100).toFixed(2)}</span>)
      }
    }, {
      title: '充值人数',
      dataIndex: 'chargeuserCount',
      key: 'chargeuserCount',
      width: 80,
    }, {
      title: '充值次数',
      dataIndex: 'chargeTimes',
      key: 'chargeTimes',
      width: 100,
    }, {
      title: '充值金额（元）',
      key: 'chargeAmount',
      width: 100,
      render: function(data, record) {
        return (<span>{(record.chargeAmount/100).toFixed(2)}</span>)
      }
    }, {
      title: '合计（元）',
      key: 'sum',
      width: 100,
      render: function(data, record) {
        return (<span>{((record.chargeAmount+record.buyAmount)/100).toFixed(2)}</span>)
      }
    }, {
      title: '核销积分',
      dataIndex: 'point',
      key: 'point',
      width: 100,
    }, {
      title: '积分商品出库数',
      key: 'pointgoodsCount',
      width: 80,
      render: function(data, record){
        return (<span>{record.pointgoodsCount}</span>)
      }
    }, {
      title: '积分商品出库金额（元）',
      key: 'pointgoodsAmount',
      width: 80,
      render: function(data, record){
        return (<span>{(record.pointgoodsAmount/100).toFixed(2)}</span>)
      }
    }, {
      title: '核销金额（元）',
      key: 'chargeExChargeAmount',
      width: 100,
      render: function(data, record){
        return (<span>{(record.chargeExChargeAmount/100).toFixed(2)}</span>)
      }
    }, {
      title: '充值商品出库数',
      key: 'chargeExGoodsCount',
      width: 80,
      render: function(data, record){
        return (<span>{record.chargeExGoodsCount}</span>)
      }
    }, {
      title: '充值商品出库金额（元）',
      key: 'chargeExGoodsAmount',
      width: 80,
      render: function(data, record){
        return (<span>{(record.chargeExGoodsAmount/100).toFixed(2)}</span>)
      }
    }, {
      title: 'pk次数',
      key: 'pkTimes',
      width: 100,
      render: function(data, record){
        return (<span>{record.pkTimes}</span>)
      }
    }, {
      title: 'pk商品出库数',
      key: 'pkExGoodsCount',
      width: 80,
      render: function(data, record){
        return (<span>{record.pkExGoodsCount}</span>)
      }
    }, {
      title: 'pk商品出库金额（元）',
      key: 'pkExGoodsAmount',
      width: 80,
      render: function(data, record){
        return (<span>{(record.pkExGoodsAmount/100).toFixed(2)}</span>)
      }
    }, {
      title: '总商品出库金额（元）',
      key: 'goodsAmount',
      width: 100,
      render: function(data, record) {
        return (<span>{((record.pointgoodsAmount+record.chargeExGoodsAmount+record.pkExGoodsAmount)/100).toFixed(2)}</span>)
      }
    }]
    for(var i=0; i<arr.length; i++){
      columns.push({
        title: arr[i].options,
        dataIndex: arr[i].options,
        key: arr[i].options,
        width: 50,
      })
    }
    this.setState({columns: columns})
    return columns
    
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
        var columns = me.getColumns(res.data.itemsType)
        var newList = me.getNewDataList(res.data, res.data.itemsType)
        me.setState({
          data: res.data.list,
          totalObj: res.data.total
        })
      }else{
        message.info(res.msg);
      }
    })
  },
  RangePickerChange: function(value, dateString){
    //console.log('Selected Time: ', value);
    //console.log('Formatted Selected Time: ', dateString);
    this.setState({
      startDate: dateString[0],
      endDate: dateString[1]
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
  render: function () {
    var me = this;
    var columns = this.state.columns;
    var data = this.state.data;
    var totalObj = this.state.totalObj || {};
    var total = totalObj.totalCount || 0;
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
        <div className="header">
          <div className="list">
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
            <Button size="large" type="primary" onClick={this.search}>筛选</Button>
          </div>
        </div>
        <Table
          pagination={pagination}
          columns={columns}
          dataSource={data}
          scroll={{ x: 1800 }}
          bordered
          title={() => {
            return (
              <div className="sum">
                <div className="list"><span>{totalObj.totalAmount}</span>合计收入（元）</div>
                <div className="list"><span>{totalObj.chargeAmount?(totalObj.chargeAmount/100).toFixed(2):"0"}</span>合计充值（元）</div>
                <div className="list"><span>{totalObj.buyAmount?(totalObj.buyAmount/100).toFixed(2):"0"}</span>合计购买（元）</div>
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
          me.state.echartsBusiness.length > 0 && me.state.region.length>0 ? <IncomeEcharts region={me.state.region} business={me.state.echartsBusiness} /> : ""
        }

        {
          me.state.echartsBusiness.length > 0 && me.state.region.length>0 ? <StallBuy region={me.state.region} business={me.state.echartsBusiness} /> : ""
        }

        {
          me.state.echartsBusiness.length > 0 && me.state.region.length>0 ? <StallCharge region={me.state.region} business={me.state.echartsBusiness} /> : ""
        }


      </div>
    )
  }
});

module.exports = main;