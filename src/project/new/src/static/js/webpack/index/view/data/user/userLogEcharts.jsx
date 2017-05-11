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

  RangePickerChange: function(value, dateString){
    this.setState({
      startDate: dateString[0],
      endDate: dateString[1]
    })
  },
  dateTypeChange: function(value){
    this.setState({dateType: value})
  },
  search: function(){
    var me = this;
    var data = {
      pageNo: 0,
      pageSize: 0,
      isExport: "false",
      startDate: me.state.startDate,
      endDate: me.state.endDate,
      dateType: me.state.dateType  //1-2-3 年-月-日
    }

    indexService.getUserLog(data).then(function(res){
      if(res.status == 0){
        var xyObj = me.getXYObj(res.data.list);
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
        data:['新增关注', "取消关注", "净增关注"]
      },
      toolbox: {
        show : true,
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
      series : [
        {
          name:'新增关注',
          type:'line',
          tiled: '总量',
          data: obj.addArr
        }, {
          name:'取消关注',
          type:'line',
          tiled: '总量',
          data: obj.delArr
        }, {
          name:'净增关注',
          type:'line',
          tiled: '总量',
          data: obj.growthArr
        }
      ]
    };

    var echartsDom = document.querySelectorAll('.userLogEcharts')[0].querySelector(".echarts")
    var myChart = echarts.init(echartsDom)
    myChart.setOption(op)
  },
  getXYObj: function(data){
    var xArr = [];
    var addArr = []
    var delArr = []
    var growthArr = []

    for (var i=0; i<data.length; i++) {
      xArr.push(data[i].time)
      addArr.push(data[i].addCount)
      delArr.push(data[i].delCount)
      growthArr.push(data[i].addCount-data[i].delCount)
    }

    return {
      x: xArr,
      addArr: addArr,
      delArr: delArr,
      growthArr: growthArr
    }
  },
  jsExport: function(){
    ExcellentExport.csv(this.refs.jsExport, 'userLogEchartsTable');
  },
  render: function () {
    var me = this;
    var tableData = me.state.tableData

    return (
      <div className="userLogEcharts">
        <div className="title">
          用户关注趋势图
        </div>
        <div className="userLogEchartsHeader">
          <div className="list" style={{width: "400px"}}>
            <span>选择时间：</span>
            <RangePicker
              /*defaultValue={[moment(me.state.startDate), moment(me.state.endDate)]}*/
              disabledDate={(current)=>{return current && current.valueOf() > Date.now();}}
              size="large"
              format="YYYY-MM-DD"
              placeholder={['Start Time', 'End Time']}
              onChange={this.RangePickerChange}
            />
          </div>
          <div className="list" style={{width: "200px"}}>
            <span>周期：</span>
            <Select value={me.state.dateType} style={{ width: 120 }} onChange={me.dateTypeChange} showSearch>
              <Option key="1" value="1">年</Option>
              <Option key="2" value="2">月</Option>
              <Option key="3" value="3">日</Option>
            </Select>
          </div>
          <div className="list" style={{width: "100px"}}>
            <Button size="large" type="primary" onClick={this.search}>筛选</Button>
          </div>
          <div className="list" style={{width: "100px"}}>
              <a className={"exportBtn"} download="aaa.csv" href={"#"} ref="jsExport" onClick={me.jsExport}>导  出</a>
          </div>
        </div>
        <div className="echarts"></div>

        <table className="hide" id="userLogEchartsTable">
          <tbody>
            <tr>
              <th>日期</th>
              <th>新增关注</th>
              <th>取消关注</th>
              <th>净增关注</th>
            </tr>
            {
              !tableData.x?(
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                ):tableData.x.map(function(v, k){
                return(
                  <tr key={k}>
                    <th>{v}</th>
                    <th>{tableData.addArr[k]}</th>
                    <th>{tableData.delArr[k]}</th>
                    <th>{tableData.growthArr[k]}</th>
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