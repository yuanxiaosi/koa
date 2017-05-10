var React = require('react');
var indexService = require('../../../../../service/index.js');
import moment from 'moment';
var _ = require('lodash');
import { DatePicker, Select, Button, message, Cascader} from 'antd';
const { RangePicker } = DatePicker;
const Option = Select.Option;


var echarts = require('echarts');
var ExcellentExport = require('../../../../../util/excellentexport.min.js');


var main = React.createClass({
  getInitialState: function(){
    var me = this;
    return {
      region: me.props.region,
      business: me.props.business,
      selectRegionId: "0",
      selectBusinessId: "0",
      dateType: "3",
      startDate: "",
      endDate: "",
      tableData: {}
    }
  },
  componentWillMount: function(){ 
  },
  componentDidMount: function(){
    
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
  RangePickerChange: function(value, dateString){
    this.setState({
      startDate: dateString[0],
      endDate: dateString[1]
    })
  },
  dateTypeChange: function(value){
    this.setState({dateType: value})
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
  search: function(){
    var me = this;
    var data = {
      startDate: me.state.startDate,
      endDate: me.state.endDate,
      isExport: "false",
      businessId: me.state.selectBusinessId.split('&')[0],
      dayreportExType: "1",
      dateType: me.state.dateType  //1-2-3 年-月-日
    }

    indexService.dataGetExStall(data).then(function(res){
      if(res.status == 0){
        var xyObj = me.getXYObj(res.data);
        me.setState({tableData: xyObj})
        me.initExcharts(xyObj);
        
      }else{
        message.info(res.msg);
      }
    })
  },
  initExcharts: function(obj){
    var op = {
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        data: obj.yT
      },
      toolbox: {
        show : false,
        feature : {
          mark : {show: true},
          dataView : {show: true, readOnly: false},
          magicType : {show: true, type: ['line', 'bar']},
          restore : {show: true},
          saveAsImage : {show: true}
        }
      },
      calculable : true,
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data : obj.x
        }
      ],
      yAxis : [
        {
          type : 'value'
        }
      ],
      series : obj.y
    };

    var echartsDom = document.querySelectorAll('.dataIncomeStallBuy')[0].querySelector(".echarts")
    var myChart = echarts.init(echartsDom)
    myChart.setOption(op)
  },
  getNewXObj: function(obj){
    var o = {}
    for(var i in obj){
      o[i] = 0
    }
    return o;
  },
  getXYObj: function(data){
    var me = this;
    var yObj = {};
    var yArr = [];
    var yTArr = [];
    var xObj = {};
    var xArr = [];

    for(var i=0; i<data.length; i++){
      if(!yObj[data[i].options]){
        yObj[data[i].options] = []
        yTArr.push(data[i].options)
      }
      if(!xObj[data[i].day]){
        xObj[data[i].day] = {};
        xArr.push(data[i].day)
      }
      yObj[data[i].options].push(data[i])
      
    }

    xArr = xArr.sort()

    for(var i in yObj){
      var o = {
        name: i,
        type:'line',
        tiled: '总量',
        data: []
      }
      var xNewObj = me.getNewXObj(xObj);
      for(var j=0; j<yObj[i].length; j++){
        xNewObj[yObj[i][j].day] = yObj[i][j].val;
      }
      var ar = [];
      for(var k=0; k<xArr.length; k++){
        ar.push(xNewObj[xArr[k]])
      }
      o.data = ar;
      yArr.push(o)
    }

    return {
      x: xArr,
      y: yArr,
      yT: yTArr
    }
  },
  jsExport: function(){
    ExcellentExport.csv(this.refs.jsExport, 'dataIncomeStallBuyTable');
  },
  render: function () {
    var me = this;
    var tableData = me.state.tableData;
    var businessOption = me.state.business.map(function(v, key){
      var arr = [];
      arr.push(<Option key={key} value={v.id+"&"+v.name}>{v.name}</Option>)
      return arr
    })
    return (
      <div className="dataIncomeStallBuy">
        <div className="title">
          购买趋势图
        </div>
        <div className="dataIncomeStallBuyHeader">
          <div className="list" style={{width: "270px"}}>
            <span>选择时间：</span>
            <RangePicker
              /*defaultValue={[moment(me.state.startDate), moment(me.state.endDate)]}*/
              style={{width: "200px"}}
              disabledDate={(current)=>{return current && current.valueOf() > Date.now();}}
              size="large"
              format="YYYY-MM-DD"
              placeholder={['Start Time', 'End Time']}
              onChange={this.RangePickerChange}
            />
          </div>
          <div className="list" style={{width: "170px"}}>
            <span>周期：</span>
            <Select value={me.state.dateType} style={{ width: 120 }} onChange={me.dateTypeChange} showSearch>
              <Option key="1" value="1">年</Option>
              <Option key="2" value="2">月</Option>
              <Option key="3" value="3">日</Option>
            </Select>
          </div>
          <div className="list" style={{width: "270px"}}>
            <span>地区：</span>
            <Cascader style={{"marginTop":"-5px", "width":"220px"}} options={me.state.region} onChange={me.regionChange} defaultValue={["0"]} placeholder="请选择省市区" size="large" showSearch/>
          </div>
          <div className="list" style={{width: "180px"}}>
            <span>门店：</span>
            <Select value={me.state.selectBusinessId} style={{ width: 120 }} onChange={me.businessChange} showSearch>
              <Option className={me.state.selectRegionId!="0"?"hide":""} key="-1" value="0">全部</Option>
              { businessOption }
            </Select>
          </div>
          <div className="list" style={{width: "80px"}}>
            <Button size="large" type="primary" onClick={this.search}>筛选</Button>
          </div>
          <div className="list" style={{width: "80px"}}>
              <a className={"exportBtn"} download="aaa.csv" href={"#"} ref="jsExport" onClick={me.jsExport}>导  出</a>
          </div>
        </div>
        <div className="echarts"></div>
        <table className="hide" id="dataIncomeStallBuyTable">
          <tbody>
            <tr>
              <th>日期</th>
              {
                !tableData.y?(<th></th>):tableData.y.map(function(v, k){
                  return(
                    <th key={k}>{v.name}</th>
                  )
                })
              }
            </tr>
            {
              !tableData.x?(
                  <tr>
                    <td></td>
                    <td></td>
                  </tr>
                ):tableData.x.map(function(v, k){
                return(
                  <tr key={k}>
                    <td>{v}</td>
                    {
                      tableData.y.map(function(yv, yk){
                        return(
                          <td key={yk}>{yv.data[k]}</td>
                        )
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
});

module.exports = main;