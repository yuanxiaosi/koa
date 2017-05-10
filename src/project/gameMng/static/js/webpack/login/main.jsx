require('es6-promise').polyfill();
import 'babel-polyfill';

var React = require("react");
var RouterDom = require('react-dom');

//var router = require('./router.jsx');

var Login = require('./view/index/main.jsx');

RouterDom.render(
  <Login />, document.getElementById('main')
);

