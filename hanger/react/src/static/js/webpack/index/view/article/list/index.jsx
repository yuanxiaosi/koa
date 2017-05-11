var React = require('react');
var indexService = require('../../../../../service/index.js');
var _ = require('lodash');
import { Table, Icon, message } from 'antd';
var main = React.createClass({
  getInitialState: function(){
    var me = this;
    return {
      columns: [{
        title: 'id',
        dataIndex: 'id',
        key: 'id'
      }, {
        title: 'title',
        dataIndex: 'title',
        key: 'title',
      }, {
        title: 'author',
        dataIndex: 'author',
        key: 'author',
      }, {
        title: 'create_time',
        dataIndex: 'create_time',
        key: 'create_time',
      }, {
        title: 'Action',
        key: 'action',
        render: (data, record) => {
          console.log(record)
          return (
            <span>
              <a href={"#/article/add/"+record.id}>update</a>
              <span className="ant-divider" />
              <a href="javascript:void(0)" onClick={_.bind(me.del, me, record.id)}>Delete</a>
            </span>
          )
        },
      }],
      data: [],
      total: 0,
      current: 1
    }
  },
  componentWillMount: function(){
    this.getTableData(1);
  },
  componentDidMount: function(){

  },
  getTableData: function(pageNo){
    var me = this;
    var data = {
      pageSize: 20,
      pageNo: pageNo
    }
    indexService.getArticleList(data).then(function(res){
      
      for(var i=0; i<res.data.length; i++){
        res.data[i].key = res.data[i].id
      }

      if(res.status == 0){
        me.setState({ 
          data: res.data,
          total: res.msg 
        });
      }else{
        message.info(res.msg);
      }
    })
  },
  del: function(id){
    var me = this;
    indexService.delArticle(id).then(function(res){
      if(res.status == 0){
        var current = me.state.current;
        me.getTableData(current);
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

    return (
      <div>
        <Table
          pagination={pagination}
          columns={columns}
          dataSource={data}
          bordered
        />
      </div>
    )
  }
});

module.exports = main;