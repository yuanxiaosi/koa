module.exports = function(data, isNew){
  var newData = []
  if(!isNew){ //是否需要有默认全部选项
    newData = [{
      label: "全部",
      value: "0"
    }];
  }else {
    newData = [{
      label: "请选择区域",
      value: "0"
    }];
  }
	 
  var allData = {};
  var A = {}

  for(var i=1; i<=3; i++){
    allData[i] = {}
  }
  for (var i=0; i<data.length; i++){
    var obj = {}
    obj.name = data[i].name
    obj.label = data[i].name
    obj.pid = data[i].pid
    obj.id = data[i].id
    obj.level = data[i].level
    obj.children = {};
    allData[obj.level][obj.id] = (obj)
  }

  for(var i in allData[1]){
    var id = allData[1][i].id;
    A[id] = allData[1][i]
  }
  for(var i in allData[2]){
    var pid = allData[2][i].pid;
    var id = allData[2][i].id;
    A[pid].children[id] = allData[2][i];
  }
  for(var i in allData[3]){
    var pid = allData[3][i].pid;
    var ppid = allData[2][pid].pid;
    var id = allData[3][i].id;
    /*if(!A[ppid]) continue;
    if(!A[ppid].children[pid]) continue;*/
    A[ppid].children[pid].children[id] = allData[3][i];
  }

  for(var i in A){
    var Aobj = {}
    Aobj.id = A[i].id
    Aobj.value = A[i].id
    Aobj.label = A[i].name
    Aobj.children = [];
    for(var j in A[i].children){
      var Bobj = {}
      Bobj.id = A[i].children[j].id
      Bobj.value = A[i].children[j].id
      Bobj.label = A[i].children[j].name
      Bobj.children = [];
      for(var k in A[i].children[j].children){
        var Cobj = {}
        Cobj.id = A[i].children[j].children[k].id
        Cobj.value = A[i].children[j].children[k].id
        Cobj.label = A[i].children[j].children[k].name
        Bobj.children.push(Cobj)
      }
      Aobj.children.push(Bobj)
    }
    newData.push(Aobj)
  }
  return newData
}

