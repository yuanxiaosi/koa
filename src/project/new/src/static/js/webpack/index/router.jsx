var React = require("react");
var ReactRouter = require('react-router');
var IndexRoute = ReactRouter.IndexRoute;
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var hashHistory = ReactRouter.hashHistory;                 //有_k query
var createMemoryHistory = ReactRouter.createMemoryHistory; //无_k query

var Application = require('./application.jsx');

//console.log(window.AppData)
var arr = [
  {
    path: "/finance/incomeSummary",
    url: "/finance/incomeSummary/index.jsx"
  },{
    path: "/finance/incomeDetail",
    url: "/finance/incomeDetail/index.jsx"
  },{
    path: "/finance/goods",
    url: "/goods/goodsList/index.jsx"
  },{
    path: "/goods/goodsDetail/:goodsId",
    url: "/goods/goodsDetail/index.jsx"
  },{
    path: "/goods/add",
    url: "/goods/add/index.jsx"
  },{
    path: "/goods/add/:goodsId",
    url: "/goods/add/index.jsx"
  },{
    path: "/goods/goodsList",
    url: "/goods/goodsList/index.jsx"
  },{
    path: "/goods/serial",
    url: "/goods/serial/index.jsx"
  },{
    path: "/business/list",
    url: "/business/list/index.jsx"
  },{
    path: "/business/add",
    url: "/business/add/index.jsx"
  },{
    path: "/business/add/:businessId",
    url: "/business/add/index.jsx"
  },{
    path: "/business/detail/:businessId",
    url: "/business/detail/index.jsx"
  },{
    path: "/data/income",
    url: "/data/income/index.jsx"
  },{
    path: "/data/score",
    url: "/data/score/index.jsx"
  },{
    path: "/data/user",
    url: "/data/user/index.jsx"
  },{
    path: "/processStatus/:businessId",
    url: "/process/processStatus/index.jsx"
  }
]

var listRoute = arr.map((v, k)=>{
  return (
    <Route key={k} path={v.path} getComponent={ function(location, callback){
      require.ensure([], function () {
        callback(null, require('./view' + v.url));
      });
    }} />
  )
})

var router = (
	<Router history={hashHistory}>
    <Route path="/" component={Application}>
      {listRoute}
    </Route>
  </Router>
)

module.exports = router;