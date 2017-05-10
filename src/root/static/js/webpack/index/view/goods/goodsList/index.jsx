var React = require('react');
var moment = require('moment');
var indexService = require('../../../../../service/index.js');
var less = require("./index.less")
import model from '../../../../../model/index.js';
import { Table, Icon, Button, message, DatePicker, Select} from 'antd';
const { RangePicker } = DatePicker;
const Option = Select.Option;

var main = React.createClass({
  getInitialState: function(){
    var me = this;
    return {
      columns: [{
        title: '商品名',
        dataIndex: 'name',
        key: 'name',
        width: 150,
      }, {
        title: '商品型号',
        dataIndex: 'size',
        key: 'size',
      }, {
        title: '总入库数量（件）',
        key: 'count',
        dataIndex: 'count',
        /*sorter: (a, b) => a.count - b.count,*/
      }, {
        title: '总入库金额（元）',
        key: 'amount',
        render: function(data, record){
          return (<span>{(record.amount/100).toFixed(2)}</span>)
        }
      }, {
        title: '积分兑换数量',
        key: 'exCountPoint',
        dataIndex: 'exCountPoint',
      }, {
        title: '充值兑换数量',
        key: 'exCountPrice',
        dataIndex: 'exCountPrice',
      }, {
        title: 'pk兑换数量',
        key: 'exCountPK',
        dataIndex: 'exCountPk',
      }, {
        title: '兑换积分',
        key: 'point',
        dataIndex: 'point',
      }, {
        title: '充值兑换价格',
        key: 'price',
        render: function(data, record){
          return (<span>{(record.price/100).toFixed(2)}</span>)
        }
      }, {
        title: '商品结存（件）',
        key: 'balance',
        /*sorter: (a, b) => (a.count-a.exCount) - (b.count-b.exCount),*/
        render: (data, record) => {
          return (
            <span>
              {record.count-record.exCountPoint-record.exCountPrice-record.exCountPk}
            </span>
          )
        },
      }, {
        title: '操作',
        key: 'action',
        render: (data, record) => {
          return (
            <div>
              <span>
                <a href={"#/goods/goodsDetail/"+record.goodsId}>详情</a>
              </span>
              <span> &nbsp; | &nbsp; </span>
              <span>
                <a href={"#/goods/add/"+record.goodsId+"?showType=1"}>编辑</a>
              </span>
              <span> &nbsp; | &nbsp; </span>
              <span>
                <a href={"#/goods/add/"+record.goodsId+"?showType=2"}>添加</a>
              </span>
            </div>
          )
        },
      }],
      data: [],
      serialCount: 0,
      exListCount: 0,
      goods: [],
      business: [],
      goodsSelect: "0",
      businessSelect: "0",
      total: 0,
      current: 1,
      pageSize: 20,
      startDate: "",
      endDate: ""
    }
  },
  componentWillMount: function(){
    var me = this;

    this.getCountDays()
  },
  componentDidMount: function(){
    this.getTableData(1);
    this.getGoods()
    this.getBusiness()
  },
  init: function(){
    
  },
  getBusiness: function(){
    var me = this;
    indexService.getBusiness(0).then(function(res){
      if(res.status == 0){
        me.setState({business: res.data})
      }else{
        message.info(res.msg);
      }
    })
  },
  getGoods: function(){
    var me = this;
    indexService.getGoods().then(function(res){
      if(res.status == 0){
        me.setState({goods: res.data})
      }else{
        message.info(res.msg);
      }
    })
  },
  getCountDays: function(cb) {
    var date = new Date();
    var  day = new Date(date.getFullYear(), date.getMonth()+1, 0);
    var daycount = day.getDate();
    var startDate = moment().format('YYYY-MM') + "-01"
    var endDate = moment().format('YYYY-MM') + "-" + daycount

    this.setState({
      startDate: startDate,
      endDate: endDate
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
      pageSize: me.state.pageSize,
      pageNo: pageNo,
      startDate: me.state.startDate,
      endDate: me.state.endDate,
      goodsId: me.state.goodsSelect,
      businessId: me.state.businessSelect,
      isExport: false
    }
    indexService.getGoodsExSerial(data).then(function(res){
      if(res.status == 0){
        var list = me.getNewDataList(res.data.list)
        model.set("goodsExSerial-model", list)
        me.setState({
          data: list,
          total: res.data.total,
          serialCount: res.data.goodsSerialCount,
          exListCount: res.data.goodsExListCount
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
  goodsChange: function(value) {
    var id = value.key.split("&")[0]
    this.setState({goodsSelect: id})
  },
  businessChange: function(value) {
    var id = value.key.split("&")[0]
    this.setState({businessSelect: id})
  },
  search: function(){
    this.getTableData(1);
  },
  exportTable: function() {
    var me = this;
    var data = {
      startDate: me.state.startDate,
      endDate: me.state.endDate,
      goodsId: me.state.goodsSelect,
      businessId: me.state.businessSelect,
      isExport: true
    }
    window.open(`/api/goods/getGoodsExSerial?isExport=${data.isExport}&businessId=${data.businessId}&goodsId=${data.goodsId}&startDate=${data.startDate}&endDate=${data.endDate}`)
  },
  clickAddBtn: function(){
    window.location.href = "#/goods/add/0?showType=0"
  },
  render: function () {
    var me = this;
    var columns = this.state.columns;
    var data = this.state.data;
    var total = this.state.total;
    var goods = me.state.goods;
    var business = me.state.business;

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

    var goodsOption = me.state.goods.map(function(v, key){
      var arr = [];
      arr.push(<Option key={key} value={v.id+"&"+v.name}>{v.name}</Option>)
      return arr
    })

    var businessOption = me.state.business.map(function(v, key){
      var arr = [];
      arr.push(<Option key={key} value={v.id+"&"+v.name}>{v.name}</Option>)
      return arr
    })

    return (
      <div className="goodsList">
        <div className="header">
          <div className="list">
            <span>选择时间：</span>
            <RangePicker
                size="large"
                format="YYYY-MM-DD"
                placeholder={['Start Time', 'End Time']}
                disabledDate={(current)=>{return current && current.valueOf() > Date.now();}}
                onChange={this.RangePickerChange}
                defaultValue={[moment(me.state.startDate), moment(me.state.endDate)]}
              />
          </div>
          <div className="list">
            <span>商品名称：</span>
            <Select labelInValue defaultValue={{ key: '0' }} style={{ width: 120 }} onChange={this.goodsChange} showSearch size="large" placeholder="请选择商品">
              <Option key={"-1"} value={"0"}>全部</Option>
              {goodsOption}
            </Select>
          </div>
          <div className="list">
            <span>门店：</span>
            <Select labelInValue defaultValue={{ key: '0' }} style={{ width: 120 }} onChange={this.businessChange} showSearch size="large" placeholder="请选择门店">
              <Option key={"-1"} value={"0"}>全部</Option>
              {businessOption}
            </Select>
          </div>
          <div className="list"><Button size="large" type="primary" onClick={this.search}>筛选</Button></div>
          <div className="list">
            <div className="addBtn" onClick={this.clickAddBtn}><span>新增商品</span></div>
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
                <div className="list"><span>{total}</span>条符合条件的记录</div>
                <div className="list"><span>{me.state.serialCount}</span>合计商品入库数（件）</div>
                <div className="list"><span>{me.state.serialCount-me.state.exListCount}</span>合计商品结存数（件）</div>
              </div>
            )
          }}
          footer={() => {
            return (
              <Button onClick={this.exportTable} size="large" type="primary">导出</Button>
            )
          }}
        />
      </div>
    )
  }
});

module.exports = main;