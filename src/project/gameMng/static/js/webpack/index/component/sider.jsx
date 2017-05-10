var React = require("react");
import { Menu, Icon, Switch } from 'antd';
const SubMenu = Menu.SubMenu;

const Sider = React.createClass({
  getInitialState() {
    return {
      theme: 'dark',
      current: '#/',
      menu: window.AppData.menu
    };
  },
  componentWillMount: function(){
    var key = 0;
    var menu = this.state.menu;
    for(var i=0; i<menu.length; i++){
      for(var j=0;j<menu[i].children.length;j++){
        menu[i].children[j].key = key;
        key+=1;
      }
    }
    this.setState({menu: menu})
  },
  handleClick(e) {
    var k = e.key
    this.setState({
      current: e.key,
    });

    var menu = this.state.menu;
    for(var i=0; i<menu.length; i++){
      for(var j=0;j<menu[i].children.length;j++){
        if(menu[i].children[j].key == k){
          window.location.href = "#" + menu[i].children[j].per;
        }
      }
    }
  },
  getSubMenu(obj) {
    var me = this;
    var vdom = [];
    obj.map(function(v, k){
      vdom.push(
        <SubMenu key={k} title={<span><Icon type="mail" /><span>{v.name}</span></span>}>
          {me.getChildMenu(v.children)}
        </SubMenu>
      )
    })
    return vdom;
  },
  getChildMenu(obj) {
    var me = this;
    var vdom = [];
    obj.map(function(v, k){
      vdom.push(
        <Menu.Item key={v.key}>{v.name}</Menu.Item>
      )
    })
    return vdom;
  },
  render() {
    var menu = this.state.menu;
    var nowHash = window.location.hash.split("#")[1].split("?")[0]
    var defaultOpenKeys = "";
    var selectedKeys = "";

    for(var i=0; i<menu.length;i++){
      for(var j=0; j<menu[i].children.length;j++){
        if(nowHash == menu[i].children[j].per){
          defaultOpenKeys = i+""
          selectedKeys = menu[i].children[j].key+""
        }
      }
    }
    return (
      <div>
        <Menu
          theme={this.state.theme}
          onClick={this.handleClick}
          defaultOpenKeys={[defaultOpenKeys]}
          selectedKeys={[selectedKeys]}
          mode="inline"
        >
          {this.getSubMenu(menu)}
        </Menu>
      </div>
    );
  },
});

module.exports = Sider;