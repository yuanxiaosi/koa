var React = require('react');
var indexService = require('../../../../../service/index.js');
var getNewRegion = require('../../../../../util/getNewRegion.js');
var _ = require('lodash');
var less = require("./index.less")
import moment from 'moment';
import { Table, Icon, Button, message, DatePicker, Cascader, Select} from 'antd';
const {RangePicker } = DatePicker;
const Option = Select.Option;

var UserLogEcharts = require('./userLogEcharts.jsx')


function disabledDate(current) {
  return current && current.valueOf() > Date.now();
}

var main = React.createClass({
  getInitialState: function(){
    var me = this;
    return {
      columns: [],
      data: [],
      follow: {},
      total: 0,
      current: 1,
      pageSize: 20,
      startDate: moment(new Date().getTime()-1000*60*60*24).format("YYYY-MM-DD"),
      endDate: moment(new Date().getTime()-1000*60*60*24).format("YYYY-MM-DD")
    }
  },
  componentWillMount: function(){ 
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
      pageSize: me.state.pageSize,
      pageNo: 1,
      startDate: me.state.startDate,
      endDate: me.state.endDate,
      isExport: "true",
      dateType: "3"
    }
    window.open(`/api/data/getUserLog?isExport=${data.isExport}&pageSize=${data.pageSize}&pageNo=${data.pageNo}&startDate=${data.startDate}&endDate=${data.endDate}&dateType=${data.dateType}`)
  },  
  getColumns: function(arr){
    var me = this;
    var columns = [{
      title: '时间',
      key: 'time',
      dataIndex: 'time',
    }, {
      title: '新关注人数',
      key: 'addCount',
      dataIndex: 'addCount',
    }, {
      title: '取消关注人数',
      key: 'delCount',
      dataIndex: 'delCount',
    }, {
      title: '净增关注人数',
      key: 'growth',
      render: function(data, record){
        return(<span>{record.addCount - record.delCount}</span>)
      }
    }]
    me.setState({columns: columns})
    return columns
    
  },
  getNewDataList: function(list){
    var me = this;
    for (var i=0; i<list.length; i++) {
      list[i].key = i
    }
    return list;
  },
  getTableData: function(pageNo){
    var me = this;
    var data = {
      pageSize: me.state.pageSize,
      pageNo: pageNo,
      startDate: me.state.startDate,
      endDate: me.state.endDate,
      isExport: "false",
      dateType: "3"
    }
    indexService.getUserLog(data).then(function(res){
      console.log(res)
      if(res.status == 0){
        var columns = me.getColumns(res.data)
        var newList = me.getNewDataList(res.data.list)
        me.setState({
          data: newList,
          total: res.data.total,
          follow: res.data.follow
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
    var total = this.state.total;
    var follow = this.state.follow;
    var followAdd = follow["1"] || 0
    var followDel = follow["2"] || 0

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
      <div className="dataUserDetail">
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
                <div className="list"><span>{followAdd - followDel}</span>总关注人数</div>
              </div>
            )
          }}
          footer={() => {
            return (
              <Button onClick={this.tableExport} size="large" type="primary">导出</Button>
            )
          }}
        />

        <UserLogEcharts />

      </div>
    )
  }
});

module.exports = main;