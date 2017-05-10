var React = require('react');
var indexService = require('../../../../../service/index.js');
var _ = require('lodash');
var less = require("./index.less")
import moment from 'moment';
import { Table, Icon, Button, message, DatePicker, Row, Col} from 'antd';
const {RangePicker } = DatePicker;

function disabledDate(current) {
  // can not select days before today and today
  return current && current.valueOf() > Date.now() 
}

var main = React.createClass({
  getInitialState: function(){
    var me = this;
    return {
      columns: [{
        title: '地区',
        key: 'cityName',
        render: function(data, record) {
          return (<span>{record.region2Name+"-"+record.region3Name}</span>)
        }
      }, {
        title: '门店',
        dataIndex: 'businessName',
        key: 'businessName',
      }, {
        title: '微信收入（元）',
        key: 'totalAmount',
        render: (data, record) => {
          return (
            <div>{((record.chargeAmount + record.buyAmount)/100).toFixed(2)}</div>
          )
        }
      }, {
        title: '商品出库金额（元）',
        key: 'goodsAmount',
        render: (data, record) => {
          return (
            <div>{((record.pointgoodsAmount+record.chargeExGoodsAmount+record.pkExGoodsAmount)/100).toFixed(2)}</div>
          )
        }
      }, {
        title: '商品出库数量（件）',
        key: 'goodsCount',
        render: (data, record) => {
          return (
            <div>{(record.pointgoodsCount+record.chargeExGoodsCount+record.pkExGoodsCount)}</div>
          )
        }
      }, {
        title: '出库金额占收入比',
        key: 'rate',
        render: (data, record) => {
          var totalAmount = record.chargeAmount + record.buyAmount
          var rate = totalAmount == 0?"0.00%":((record.pointgoodsAmount+record.chargeExGoodsAmount+record.pkExGoodsAmount)*100/totalAmount).toFixed(2) + "%"
          return (
            <div>
              {rate}
            </div>
          )
        }
      }],
      data: [],
      total: 0,
      current: 1,
      pageSize: 20,
      startDate: moment(new Date().getTime()-1000*60*60*24).format("YYYY-MM-DD"),
      endDate: moment(new Date().getTime()-1000*60*60*24).format("YYYY-MM-DD")
    }
  },
  componentWillMount: function(){
    this.getTableData(1)
  },
  componentDidMount: function(){

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
      isExport: "true"
    }
    window.open(`/api/finance/incomeSummary?isExport=${data.isExport}&startDate=${data.startDate}&endDate=${data.endDate}`)
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
      pageSize: me.state.pageSize,
      pageNo: pageNo,
      startDate: me.state.startDate,
      endDate: me.state.endDate,
      isExport: "false"
    }
    indexService.financeIncomeSummary(data).then(function(res){
      if(res.status == 0){
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

    return (
      <div className="financeIncomeSummary">
        <div className="header">
          <Row>
            <Col span={9}>
              <span>选择时间：</span>
              <RangePicker
                defaultValue={[moment(me.state.startDate), moment(me.state.endDate)]}
                disabledDate={disabledDate}
                size="large"
                format="YYYY-MM-DD"
                placeholder={['Start Time', 'End Time']}
                onChange={this.RangePickerChange}
              />
            </Col>
            <Col span={8}>
              <Button size="large" type="primary" onClick={this.search}>筛选</Button>
            </Col>
          </Row>
        </div>
        <Table
          pagination={pagination}
          columns={columns}
          dataSource={data}
          bordered
          title={() => {
            return (
              <div className="sum">
                    <div className="list"><span>{totalObj.totalAmount}</span>合计收入（元）</div>
                    <div className="list"><span>{totalObj.goodsTotalAmount}</span>合计商品出库金额（元）</div>
                    <div className="list"><span>{totalObj.rate}</span>合计商品出库金额占收入比</div>

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