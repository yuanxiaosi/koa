require('es6-promise').polyfill();
import 'babel-polyfill';

var React = require("react");
var RouterDom = require('react-dom');

var router = require('./router.jsx');

RouterDom.render(
  router, document.getElementById('main')
);

