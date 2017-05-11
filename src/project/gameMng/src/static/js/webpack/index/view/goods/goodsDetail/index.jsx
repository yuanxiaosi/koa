var React = require('react');
var indexService = require('../../../../../service/index.js');
var less = require("./index.less")
import moment from 'moment';
import model from '../../../../../model/index.js';
import { Table, Icon, Button, message, colgroup } from 'antd';

var main = React.createClass({
  getInitialState: function(){
    var me = this;
    return {
      balanceColumns: [{
        title: '门店名',
        dataIndex: 'businessName',
        key: 'businessName'
      }, {
        title: '入库数量',
        dataIndex: 'count',
        key: 'count'
      }, {
        title: '结存数（件）',
        key: 'balance',
        render: (data, record)=>{
          return(
            <span>{record.count-record.exCount}</span>
          )
        }
      }],
      serialColumns: [{
        title: '批次号',
        dataIndex: 'serialNo',
        key: 'serialNo'
      }, {
        title: '入库时间',
        key: 'createAt',
        render: function(data, record){
          return(<span>{moment(record.createAt).format('YYYY-MM-DD HH:mm:ss')}</span>)
        }
      }, {
        title: '入库人',
        key: 'operator',
        dataIndex: 'operator',
      }, {
        title: '入库件数',
        key: 'count',
        dataIndex: 'count',
      }, {
        title: '单价',
        key: 'price',
        render: (data, record)=>{
          return(<span>{((record.amount/record.count)/100).toFixed(2)}</span>)
        }
      }, {
        title: '入库金额',
        key: 'amount',
        render: (data, record)=>{
          return(<span>{(record.amount/100).toFixed(2)}</span>)
        }
      }],
      exListColumns: [{
        title: '兑换门店',
        dataIndex: 'businessName',
        key: 'businessName'
      }, {
        title: '兑换时间',
        key: 'createAt',
        render: function(data, record){
          return(<span>{moment(record.createAt).format('YYYY-MM-DD HH:mm:ss')}</span>)
        }
      }, {
        title: '兑换类型',
        key: 'type',
        render: function(data, record){
          let msg = ""
          if(record.type == 1){
            msg = "积分兑换"
          }else if(record.type == 2){
            msg = "充值兑换"
          }else if(record.type == 3){
            msg = "pk兑换"
          }
          return(<span>{msg}</span>)
        }
      }, {
        title: '兑换数量',
        key: 'count',
        dataIndex: 'count',
      }],
      goodsExSerial: {},
      goodsId: me.props.params.goodsId,
      balanceData: [],
      serialData: [],
      exListData: []
    }
  },
  componentWillMount: function(){
    var me = this;

    /*var goodsExSerialModel = model.get("goodsExSerial-model")
    
    if(!goodsExSerialModel){
      window.history.go(-1)
      return;
    }

    for(var i=0; i<goodsExSerialModel.length; i++){
      if(goodsExSerialModel[i].goodsId == me.state.goodsId){
        me.setState({goodsExSerial: goodsExSerialModel[i]})
      }
    }*/

    this.getGoodsDetail(1);
  },
  componentDidMount: function(){

  },
  pushKey: function(data){
    for(var i=0; i<data.length; i++){
      data[i].key = i
    }
    return data
  },
  getGoodsDetail: function(pageNo){
    var me = this;
    indexService.getGoodsDetail(me.state.goodsId).then(function(res){
      if(res.status == 0){
        var goodsBalance = me.pushKey(res.data.goodsBalance)
        var goodsSerial = me.pushKey(res.data.goodsSerial)
        var goodsExList = me.pushKey(res.data.goodsExList)
        var goodsExSerial = res.data.goodsExSerial[0]
        me.setState({
          balanceData: goodsBalance,
          serialData: goodsSerial,
          exListData: goodsExList,
          goodsExSerial: goodsExSerial
        })
      }else{
        message.info(res.msg);
      }
    })
  },
  render: function () {
    var me = this;
    var balanceColumns = me.state.balanceColumns;
    var balanceData = me.state.balanceData;
    var serialColumns = me.state.serialColumns;
    var serialData = me.state.serialData;
    var exListColumns = me.state.exListColumns;
    var exListData = me.state.exListData;

    var goodsExSerial = me.state.goodsExSerial
    console.log(goodsExSerial)
    return (
      <div className="GoodsDetail">
        <div className="pic">
          <div className="title">{goodsExSerial.name}</div>
          <div className="img">
            <img src={goodsExSerial.picUrl} />
          </div>
        </div>
        <div className="detail">
          <div className="title">商品信息</div>
          <table className="detailTable">
            <tbody>
              <tr>
                <th>商品型号</th>
                <th>入库总金额</th>
                <th>入库总数量</th>
                <th>兑换积分</th>
                <th>兑换价格</th>
                <th>兑换数量</th>
                <th>结存</th>
              </tr>
              <tr>
                <td>{goodsExSerial.size}</td>
                <td>{(goodsExSerial.amount/100).toFixed(2)}</td>
                <td>{goodsExSerial.count}</td>
                <td>{goodsExSerial.point}</td>
                <td>{(goodsExSerial.price/100).toFixed(2)}</td>
                <td>{goodsExSerial.exCountPk+goodsExSerial.exCountPoint+goodsExSerial.exCountPrice}</td>
                <td>{goodsExSerial.count-goodsExSerial.exCountPk-goodsExSerial.exCountPoint-goodsExSerial.exCountPrice}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="count">
          <div className="title">门店库存</div>
          <Table pagination={true} columns={balanceColumns} dataSource={balanceData} />
        </div>
        <div className="inDepot">
          <div className="title">入库流水</div>
          <Table pagination={true} columns={serialColumns} dataSource={serialData} />
        </div>
        <div className="outDepot">
          <div className="title">出库流水</div>
          <Table pagination={true} columns={exListColumns} dataSource={exListData} />
        </div>

      </div>
    )
  }
});

module.exports = main;