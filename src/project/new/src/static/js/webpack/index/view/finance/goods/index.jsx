var React = require('react');
var indexService = require('../../../../../service/index.js');
var less = require("./index.less")
import { Table, Icon, Button, message, DatePicker, Select} from 'antd';
const { MonthPicker } = DatePicker;

function handleChange(value) {
  console.log(value);  // { key: "lucy", label: "Lucy (101)" }
}

function onChange(date, dateString) {
  console.log(date, dateString);
}

var main = React.createClass({
  getInitialState: function(){
    var me = this;
    return {
      columns: [{
        title: 'A',
        dataIndex: 'A',
        key: 'A'
      }, {
        title: 'B',
        dataIndex: 'B',
        key: 'B',
      }, {
        title: 'C',
        key: 'C',
        dataIndex: 'C',
      }, {
        title: 'D',
        key: 'D',
        dataIndex: 'D',
      }, {
        title: 'E',
        key: 'E',
        dataIndex: 'E',
      }, {
        title: '操作',
        key: 'action',
        render: (data, record) => {
          return (
            <span>
              <a href={"#/goods/"+record.businessId}>详情</a>
            </span>
          )
        },
      }],
      data: [{
        "A":"A",
        "B":"B",
        "C":"C",
        "D":"D",
        "E":"E",
        "key": 0
      }],
      total: 0,
      current: 1
    }
  },
  componentWillMount: function(){
    //this.getTableData(1);
  },
  componentDidMount: function(){

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
      pageSize: 2,
      pageNo: pageNo,
      startDate: "",
      endDate: ""
    }
    indexService.financeIncomeSummary(data).then(function(res){
      console.log(res.data.list)
      
      if(res.status == 0){
        var newList = me.getNewDataList(res.data.list)
        me.setState({
          data: newList,
          total: parseInt(res.data.total)
        })
        console.log(newList)
      }else{
        message.info(res.msg);
      }
    })
  },
  render: function () {
    var me = this;
    var columns = this.state.columns;
    var data = this.state.data;
    var total = this.state.total;

    var pagination = {
      defaultPageSize: 2,
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

    var RangePickerChange = function (value, dateString) {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
    }

    return (
      <div className="financeGoods">
        <div className="header">
          <div className="list">
            <MonthPicker onChange={onChange} placeholder="请选择月份" />
          </div>
          <div className="list">
            <Select labelInValue style={{ width: 120 }} onChange={handleChange} showSearch size="large" placeholder="请选择商品">
              <Option value="jack">Jack (100)</Option>
              <Option value="lucy">Lucy (101)</Option>
            </Select>
          </div>
          <div className="list">
            <Select labelInValue style={{ width: 120 }} onChange={handleChange} showSearch size="large" placeholder="请选择价格">
              <Option value="jack">Jack (100)</Option>
              <Option value="lucy">Lucy (101)</Option>
            </Select>
          </div>
          <div className="list">
            <Select labelInValue style={{ width: 120 }} onChange={handleChange} showSearch size="large" placeholder="请选择门店">
              <Option value="jack">Jack (100)</Option>
              <Option value="lucy">Lucy (101)</Option>
            </Select>
          </div>
          <div className="list"><Button size="large" type="primary">筛选</Button></div>
        </div>
        <Table
          pagination={pagination}
          columns={columns}
          dataSource={data}
          bordered
          title={() => {
            return (
              <div className="sum">
                <div className="list"><span>3400</span>元合计收入（元）</div>
                <div className="list"><span>3400</span>元合计收入（元）</div>
                <div className="list"><span>3400</span>元合计收入（元）</div>
              </div>
            )
          }}
          footer={() => {
            return (
              <Button size="large" type="primary">导出</Button>
            )
          }}
        />
      </div>
    )
  }
});

module.exports = main;