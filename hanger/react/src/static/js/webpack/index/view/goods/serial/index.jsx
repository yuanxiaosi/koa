var React = require('react');
var indexService = require('../../../../../service/index.js');
var _ = require('lodash');
var less = require("./index.less")
import moment from 'moment';
import { Table, Icon, Button, message, DatePicker, Row, Col} from 'antd';
const {RangePicker } = DatePicker;

var main = React.createClass({
  getInitialState: function(){
    var me = this;
    return {
      columns: [{
        title: '批次号',
        dataIndex: 'serialNo',
        key: 'serialNo'
      }, {
        title: '门店',
        dataIndex: 'businessName',
        key: 'businessName',
      }, {
        title: '入库商品',
        dataIndex: 'goodsName',
        key: 'goodsName',
      }, {
        title: '入库时间',
        key: 'createAt',
        render: function(data, record){
          return(<span>{moment(record.createAt).format('YYYY-MM-DD HH:mm:ss')}</span>)
        }
      }, {
        title: '入库数量',
        dataIndex: 'count',
        key: 'count',
      }, {
        title: '入库金额',
        key: 'amount',
        render: function(data, record){
          return(<span>{(record.amount/100).toFixed(2)}</span>)
        }
      }, {
        title: '入库人员',
        dataIndex: 'operator',
        key: 'operator',
      }],
      data: [],
      total: 0,
      current: 1,
      pageSize: 20
    }
  },
  componentWillMount: function(){
    this.getTableData(1)
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
    indexService.getSerial("0").then(function(res){
      if(res.status == 0){
        var data = me.getNewDataList(res.data)
        me.setState({
          data: data,
          total: res.msg
        })
      }else{
        message.info(res.msg);
      }
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
      <div className="goodsSerial">
        <div className="header">
          
        </div>
        <Table
          pagination={pagination}
          columns={columns}
          dataSource={data}
          bordered
          title={() => {
            return (
              <div className="sum">
                <div className="list"><span>{me.state.total}</span>条入库记录</div>
              </div>
            )
          }}
        />
      </div>
    )
  }
});

module.exports = main;