var React = require('react');
var Ueditor = require('../../../component/ueditor.jsx');
var indexService = require('../../../../../service/index.js');
var moment = require('moment');
import { Form, Select, Input, Button, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const App = Form.create()(React.createClass({
  getInitialState: function(){
    return {
      title: "",
      content: "",
    }
  },
  componentWillMount: function() {
    this.checkId();
  },
  componentDidMount: function(){

  },
  componentWillUnmount: function(){

  },
  checkId: function(){
    var me = this;
    if(this.props.params.id){
      me.getArticle();
    }
  },
  getArticle: function(){
    var me = this;
    var id = this.props.params.id;
    indexService.findArticleById(id).then(function(res){
      if(res.status == 0){
        me.setState({
          title: res.data.title,
          content: unescape(res.data.content)
        })
        me.props.form.setFieldsValue({
          title: res.data.title,
        });
        try{
          UE.getEditor('content').setContent(unescape(res.data.content))
        }catch(e){
          console.log('warn')
        }
        
      }else{
        message.info(res.msg)
      }
    })
  },
  handleSubmit(e) {
    var me = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      var content = UE.getEditor('content').getContent();
      if (!err && content != "") {
        me.saveArticle(values)
      }else{
        message.info('请输入标题和内容');
      }
    });
  },
  saveArticle: function(obj){
    if(this.props.params.id){
      this.updateArticle(obj);
    }else{
      this.addArticle(obj);
    }
  },
  addArticle: function(obj){
    var data = {
      title: obj.title,
      content: escape(UE.getEditor('content').getContent()),
      author: window.user.username,
      point: "23",
      create_time: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
    }
    indexService.articleAdd(data).then(function(res){
      if(res.status == 0){
        message.info(res.msg)
      }else{
        message.info(res.msg)
      }
    })
  },
  updateArticle: function(obj){
    var data = {
      id: this.props.params.id,
      title: obj.title,
      content: escape(UE.getEditor('content').getContent())
    }
    indexService.updateArticle(data).then(function(res){
      if(res.status == 0){
        message.info(res.msg)
      }else{
        message.info(res.msg)
      }
    })
  },
  render() {
    const { getFieldDecorator } = this.props.form;

    var title = !this.props.params.id?"":this.state.title;
    var content = !this.props.params.id?"":this.state.content;

    var type = !this.props.params.id?"添加":"修改";

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label="title"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 20 }}
        >
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input your title!' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="content"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 20 }}
        >
          <Ueditor value={content} id={"content"} height="200" disabled={false}/> 
        </FormItem>
        
        <FormItem wrapperCol={{ span: 8, offset: 2 }}>
          <Button type="primary" htmlType="submit">
            {type}
          </Button>
        </FormItem>
      </Form>
    );
  },
}));

module.exports = App;