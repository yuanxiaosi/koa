var React = require('react');
var less = require('./main.less');
var indexService = require('../../../../service/index.js');
var antCss = require('../../../../../css/antd/antd.min.css');
var ngCss = require('../../../../../css/nprogress/nprogress.css');
var md5 = require('md5');
import { Form, Icon, Input, Button, Checkbox, message, Row, Col } from 'antd';
const FormItem = Form.Item;

const NormalLoginForm = Form.create()(React.createClass({
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      var data = values
      data.passWord = md5(data.passWord);
      if (!err) {
        if(!values.msgCode){
          message.info("请输入短信验证码")
          return 
        }
        indexService.login(values).then(function(res){
          if(res.status == 0){
            window.location.href = '/'
          }else{
            message.info(res.msg)
          }
        })
      }
    });
  },
  getCode() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var data = values
        data.passWord = md5(data.passWord);
        data.msgCode = "";
        indexService.login(data).then(function(res){
          message.info(res.msg)
        })
      }
    });
  },
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="index">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入您的账号！' }],
            })(
              <Input addonBefore={<Icon type="user" />} placeholder="请输入账号" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('passWord', {
              rules: [{ required: true, message: '请输入您的密码！' }],
            })(
              <Input addonBefore={<Icon type="lock" />} type="password" placeholder="请输入密码" />
            )}
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={14}>
                {getFieldDecorator('msgCode', {
                  rules: [{ required: false, message: '请输入您接收到的短信验证码' }],
                })(
                  <Input size="large" placeholder="请输入短信验证码"/>
                )}
              </Col>
              <Col span={10}>
                <Button onClick={this.getCode} style={{"width": "100px"}} size="large">获取</Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button id="submit" type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  },
}));


module.exports = NormalLoginForm;