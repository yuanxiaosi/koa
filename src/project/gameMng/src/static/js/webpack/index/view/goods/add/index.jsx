var React = require('react');
var indexService = require('../../../../../service/index.js');
var getUrlObj = require('../../../../../util/getUrlObj.js');
var less = require("./index.less")
var _ = require("lodash");
import moment from 'moment';
import { Table, Icon, Button, message, Input, Select, Upload, Modal} from 'antd';
const Option = Select.Option;
import np from 'nprogress';

var main = React.createClass({
  getInitialState: function(){
    var me = this;
    return {
      showType: getUrlObj().showType,  // 0-新增商品  1-编辑商品  2-分配入库
      goodsId: "",
      goodsName: "",
      size: "",
      point: "",
      price: "",
      count: "",
      amount: "",
      picUrl: "",
      mark: "",
      operator: "",
      operatorPhone: "",
      business: [],
      serial: []
    }
  },
  componentWillMount: function(){
    var goodsId = this.props.params.goodsId;
    var showType = this.state.showType;

    if(showType != 0){
      this.getGoods(goodsId);
    }

    this.getBusiness(0)   
  },
  componentDidMount: function(){

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
  getGoods: function(goodsId){
    var me = this;
    indexService.getGoodsByGoodsId(goodsId).then(function(res){
      if(res.status == 0){
        me.setState({
          goodsId: res.data.goods.id,
          goodsName: res.data.goods.name,
          size: res.data.goods.size,
          point: res.data.goodsExRule.point,
          price: res.data.goodsExRule.price/100,
          picUrl: res.data.goods.picUrl,
          goodsName: res.data.goods.name,
          goodsName: res.data.goods.name,
        })
      }else{
        message.info(res.msg);
      }
    })
  },
  inputChange: function(name, e){
    var me = this;
    var obj = {};
    obj[name] = e.target.value
    this.setState(obj)
  },
  goodsTypeChange: function(value){
    this.setState({
      exType: value
    })
  },
  getSurplusCount: function(){
    var me = this;
    var count = me.state.count;
    var serial = me.state.serial;
    var serialCount = 0;
    for(var i=0; i<serial.length;i++){
      if(isNaN(parseInt(serial[i].count))) continue;
      serialCount += parseInt(serial[i].count)
    }
    return count-serialCount;
  },
  addSerial: function(){
    var serial = this.state.serial;
    var newObj = {businessId: 0, businessName:"", count:0}
    serial.push(newObj)
    this.setState({
      serial: serial
    })
  },
  delSerial: function(k){
    var serial = this.state.serial;
    serial.splice(k, 1);
    this.setState({
      serial: serial
    })
  },
  businessChange: function(k, v){
    var serial = this.state.serial;
    serial[k].businessId = parseInt(v.key.split("&")[0]);
    serial[k].businessName = v.key.split("&")[1];
    this.setState({
      serial: serial
    })
  },
  serialCountChange: function(k, e){
    var serial = this.state.serial;
    var value = e.target.value;
    serial[k].count = value;
    this.setState({
      serial: serial
    })
  },
  checkData: function(){
    var me = this
    var goodsNameReg = /[^\w\u4e00-\u9fa5]/g;
    var telReg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
    if(me.state.goodsName == ""){
      return ("商品名不能为空");
    }
    /*if(goodsNameReg.test(me.state.goodsName)){
      return "商品名不能带有特殊字符";
    }*/
    if(me.state.goodsName.length > 30){
      return "商品名不能超过30个字";
    }
    if(me.state.point == "" && me.state.price == ""){
      return ("兑换积分和兑换价格必须填写一个");
    }
    if(me.state.operator.length > 10){
      return "入库人员名称不能超过10个字";
    }
    /*if(!telReg.test(me.state.operatorPhone)){
      return "请输入正确的入库人员手机号码"
    }*/
    if(me.getSurplusCount() != 0){
      return "分配不均，可分配总库存不等于0，不能保存！"
    }



    var serial = me.state.serial;
    for(var i=0; i<serial.length; i++){
      if(serial[i].businessName == ""){
        return "第" + (i+1) + "家影院没有选择，请选择再保存！" 
      }
      if(serial[i].count == 0){
        return "第" + (i+1) + "家影院没有分配数量，请分配再保存！" 
      }
    }

    return true

  },
  getIntCount: function(){
    var me = this;
    for(var i=0; i<me.state.serial.length;i++){
      if(isNaN(parseInt(me.state.serial[i].count))) return false;
      me.state.serial[i].count = parseInt(me.state.serial[i].count)
    }
    return true
  },
  clickUpdateBtn: function(){
    var me = this;

    //校验
    /*var goodsNameReg = /[^\w\u4e00-\u9fa5]/g;
    if(goodsNameReg.test(me.state.goodsName)){
      return message.info("商品名不能带有特殊字符");
    }*/
    if(me.state.goodsName.length > 30){
      return message.info("商品名不能超过30个字");
    }

    if(me.state.point == "" && me.state.price == ""){
      return message.info("兑换积分和兑换价格必须填写一个");
    }

    var data = {
      id: me.state.goodsId,
      name: me.state.goodsName,
      size: me.state.size,
      type: me.state.exType+"",
      point: parseInt(me.state.point),
      price: parseInt(me.state.price)*100,
      picUrl: me.state.picUrl
    }
    indexService.updateGoods(data).then(function(res){
      if(res.status == 0){
        me.showModal("编辑商品成功", "back");
      }else{
        message.info(res.msg);
      }
    })
  },
  clickAddSerialBtn: function(){
    var me = this;

    //校验
    var checkRes = me.checkData()
    if( checkRes != true){
      message.info(checkRes)
      return;
    }
    if(!me.getIntCount()){
      message.info("入库流水数量输入格式不对（请输入数字）")
      return
    }
    var data = {
      id: parseInt(me.state.goodsId),
      name: me.state.goodsName,
      count: parseInt(me.state.count),
      amount: parseInt(me.state.amount)*100,
      mark: me.state.mark,
      operator: me.state.operator,
      operatorPhone: me.state.operatorPhone,
      serial: me.state.serial
    }
    indexService.goodsAddSerial(data).then(function(res){
      if(res.status == 0){
        me.showModal("入库成功", "back");
      }else{
        message.info(res.msg);
      }
    })
  },
  clickAddBtn: function() {
    var me = this;

    //校验
    var checkRes = me.checkData()
    if( checkRes != true){
      message.info(checkRes)
      return;
    }
    if(!me.getIntCount()){
      message.info("入库流水数量输入格式不对（请输入数字）")
      return
    }
    var data = {
      name: me.state.goodsName,
      size: me.state.size,
      point: parseInt(me.state.point),
      price: parseInt(me.state.price)*100,
      count: parseInt(me.state.count),
      amount: parseInt(me.state.amount)*100,
      picUrl: me.state.picUrl,
      mark: me.state.mark,
      operator: me.state.operator,
      operatorPhone: me.state.operatorPhone,
      serial: me.state.serial
    }
    indexService.goodsAdd(data).then(function(res){
      if(res.status == 0){
        me.showModal("添加商品成功", "reload");
      }else{
        message.info(res.msg);
      }
    })
    
  },
  showModal: function(msg, action){
    Modal.success({
      title: 'This is a success tips',
      content: msg,
      onOk: function(){
        if(action == "back"){
          window.location.href="#/finance/goods?_k=y7gcgy"
        }

        if(action == "reload"){
          window.location.reload()
        }
        
      }
    });
  },
  render: function () {
    var me = this;
    var detailColumns = me.state.detailColumns;
    var detailData = me.state.detailData;
    var goodsId = me.state.goodsId;
    var showType = me.state.showType;
    const imageUrl = this.state.imageUrl;

    var businessOption = me.state.business.map(function(v, key){
      var arr = [];
      arr.push(<Option key={key} value={v.value+"&"+v.label}>{v.label}</Option>)
      return arr
    })

    var serialDiv = me.state.serial.map(function(v, k){
      return (
        <div key={k} className="list">
          <div className="label">门店分配</div>
          <div className="business">
            <Select labelInValue defaultValue={{ key: "" }} placeholder="请选择门店" style={{ "width": "100%" }} showSearch onChange={_.bind(me.businessChange, me, k)}>
              {businessOption}
            </Select>
          </div>
          <div className="label">分配</div>
          <div className="count">
            <Input onBlur={me.serialCountBlur} onChange={_.bind(me.serialCountChange, me, k)} value={v.count} size="large" placeholder="件数" />
          </div>
          <div className="label">件</div>
          <div className="label"><div onClick={_.bind(me.delSerial, me, k)} className="del">删除</div></div>
        </div>
      )
    })


    const props = {
      name: 'file',
      action: '/api/upload',
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList: false,
      beforeUpload(file) {
        np.start();
        /*const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
          message.error('You can only upload JPG file!');
        }*/
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return /*isJPG &&*/ isLt2M;
      },
      onChange(info) {

        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          np.done();
          if(info.file.response.status == "0"){
            me.setState({picUrl: info.file.response.msg})
          }
          message.info(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
          np.done();
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <div className="GoodsAdd">
        <div className="form">
          <div className="title">{showType==0?"新增商品":showType==1?"编辑商品":"添加入库流水"}</div>
          <div className="body">

            <div className="lf">

              <div className="item">
                <div className="label">商品名：</div>
                <div className="ct">
                  <Input value={me.state.goodsName} size="large" onChange={_.bind(me.inputChange, me, "goodsName")} placeholder="输入商品名称" disabled={showType==2?true:false} />
                </div>
              </div>
              <div className="item">
                <div className="label">商品型号：</div>
                <div className="ct">
                  <Input size="large" placeholder="输入商品型号" value={me.state.size} onChange={_.bind(me.inputChange, me, "size")} disabled={showType==2?true:false} />
                </div>
              </div>
              <div className={"item"}>
                <div className="label">兑换积分：</div>
                <div className="ct">
                  <Input size="large" placeholder="输入兑换积分" value={me.state.point} onChange={_.bind(me.inputChange, me, "point")} disabled={showType==2?true:false} />
                </div>
              </div>
              <div className={"item"}>
                <div className="label">兑换价格：</div>
                <div className="ct">
                  <Input size="large" placeholder="输入兑换价格" value={me.state.price} onChange={_.bind(me.inputChange, me, "price")} disabled={showType==2?true:false} />
                </div>
              </div>
              <div className={showType==1?"item hide":"item"}>
                <div className="label">入库数量：</div>
                <div className="ct">
                  <Input size="large" placeholder="输入商品入库数量" value={me.state.count} onChange={_.bind(me.inputChange, me, "count")} />
                </div>
              </div>
              <div className={showType==1?"item hide":"item"}>
                <div className="label">总金额：</div>
                <div className="ct">
                  <Input size="large" placeholder="输入商品总金额（元）" value={me.state.amount} onChange={_.bind(me.inputChange, me, "amount")} />
                </div>
              </div>
              <div className="item" style={{"marginBottom": "0px"}}>
                <div className="label">商品图片：</div>
                <div className="ct">
                  <Upload {...props}>
                    <Button disabled={showType==2?true:false}>
                      <Icon type="upload" /> Click to Upload
                    </Button>
                  </Upload>
                  
                </div>
              </div>
              <div className="item">
                <div className="label"></div>
                <div className="ct">
                  <div className="upImg">
                    <img src={this.state.picUrl} />
                  </div>
                </div>
              </div>
              <div className={showType==1?"item hide":"item"}>
                <div className="label">备注：</div>
                <div className="ct">
                  <Input size="large" placeholder="备注信息（选填）" value={me.state.mark} onChange={_.bind(me.inputChange, me, "mark")} />
                </div>
              </div>
              <div className={showType==1?"item hide":"item"}>
                <div className="label">入库人员：</div>
                <div className="ct">
                  <Input size="large" placeholder="请输入入库人员姓名" value={me.state.operator} onChange={_.bind(me.inputChange, me, "operator")} />
                </div>
              </div>
              <div className={showType==1?"item hide":"item"}>
                <div className="label">手机号：</div>
                <div className="ct">
                  <Input size="large" placeholder="请输入入库人员手机号" value={me.state.operatorPhone} onChange={_.bind(me.inputChange, me, "operatorPhone")} />
                </div>
              </div>

            </div>

            <div className={showType==1?"rg hide":"rg"}>
              <div className="head">商品分配</div>
              <div className="zx">注：当前商品可分配总库存为{me.getSurplusCount()?me.getSurplusCount():0}件</div>
              <div className="distribution">

                {serialDiv}

              </div>
              <div onClick={this.addSerial} className="btn">添加</div>
            </div>

          </div>
        </div>
        <div onClick={this.clickAddBtn} className={showType==0?"sureBtn addGoodsBtn":"sureBtn addGoodsBtn hide"}>
          保存并继续添加
        </div>
        <div onClick={this.clickUpdateBtn} className={showType==1?"sureBtn updateBtn":"sureBtn updateBtn hide"}>
          修改保存
        </div>
        <div onClick={this.clickAddSerialBtn} className={showType==2?"sureBtn addSerialBtn":"sureBtn updateBtn hide"}>
          添加入库流水
        </div>
      </div>
    )
  }
});

module.exports = main;