var Model = function () {
  
};


Model.prototype.set = function(name, data){
  this[name] = data;
  return;
}
Model.prototype.get = function(name){
  return this[name];
}


var model = new Model();

module.exports = model;