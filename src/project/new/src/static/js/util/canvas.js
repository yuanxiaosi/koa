
function canvasAction(id){
  var canvas = document.getElementById(id)
  var ctx = canvas.getContext("2d")
  var normalColor = "#4a4a4a";
  var inColor = "#ffa500";


  var arcGrid = [ //圆心坐标
    {x: 60, y: 40, text: "合同已回", status: 2},
    {x: 260, y: 40, text: "采购完成", status: 4},
    {x: 460, y: 40, text: "装修完成", status: 6},
    {x: 660, y: 40, text: "安装完成", status: 8},
    {x: 660, y: 200, text: "安装完成", status: 10},
    {x: 460, y: 200, text: "营业中", status: 11},
    {x: 260, y: 200, text: "已停业", status: 12},
  ]

  var lineArcGrid = [
    {x: 160, y: 40, text: "采购中", status: 3},
    {x: 360, y: 40, text: "装修中", status: 5},
    {x: 560, y: 40, text: "安装中", status: 7},
    {x: 760, y: 120, text: "安装中", status: 9, offset: true},
    {x: 560, y: 200, text: "开始营业", status: 11},
  ]

  var lineGrid = [
    {x1: 60, y1: 40, x2: 160, y2: 40, status: 3},
    {x1: 160, y1: 40, x2: 260, y2: 40, status: 4},
    {x1: 260, y1: 40, x2: 360, y2: 40, status: 5},
    {x1: 360, y1: 40, x2: 460, y2: 40, status: 6},
    {x1: 460, y1: 40, x2: 560, y2: 40, status: 7},
    {x1: 560, y1: 40, x2: 660, y2: 40, status: 8},
    {x1: 660, y1: 40, x2: 760, y2: 40, status: 9},
    {x1: 760, y1: 40, x2: 760, y2: 120, status: 9},
    {x1: 760, y1: 120, x2: 760, y2: 200, status: 10},
    {x1: 760, y1: 200, x2: 660, y2: 200, status: 10},
    {x1: 660, y1: 200, x2: 560, y2: 200, status: 11},
    {x1: 560, y1: 200, x2: 460, y2: 200, status: 11},
    {x1: 460, y1: 200, x2: 260, y2: 200, status: 12},
  ]

  var clear = function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  var drawLine = function(k, status){
    var color = status >= lineGrid[k].status?inColor:normalColor

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(lineGrid[k].x1, lineGrid[k].y1);
    ctx.lineTo(lineGrid[k].x2, lineGrid[k].y2);
    ctx.stroke();
  }

  var drawTextArc = function(k, status){
    var color = status >= arcGrid[k].status?inColor:normalColor

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(arcGrid[k].x, arcGrid[k].y, 10, 0, 2*Math.PI);
    ctx.fill();

    ctx.font = "12px Georgia";  // 字体大小，样式
    ctx.fillStyle = "#fff";  // 颜色
    ctx.textAlign = 'center';  // 位置
    ctx.textBaseline = 'middle'; 
    ctx.fillText(k+1, arcGrid[k].x, arcGrid[k].y);

    ctx.font = "14px Georgia";  // 字体大小，样式
    ctx.fillStyle = color;  // 颜色
    ctx.textAlign = 'center';  // 位置
    ctx.textBaseline = 'middle'; 
    ctx.fillText(arcGrid[k].text, arcGrid[k].x, arcGrid[k].y+30);
  }

  var drawLineArc = function(k, status){
    var color = status >= lineArcGrid[k].status?inColor:normalColor

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(lineArcGrid[k].x, lineArcGrid[k].y, 5, 0, 2*Math.PI);
    ctx.fill();

    ctx.font = "14px Georgia";  // 字体大小，样式
    ctx.fillStyle = color;  // 颜色
    ctx.textAlign = 'center';  // 位置
    ctx.textBaseline = 'middle'; 

    var x = lineArcGrid[k].x;
    var y = lineArcGrid[k].y-30;

    if(lineArcGrid[k].offset){
      x = lineArcGrid[k].x-50;
      y = lineArcGrid[k].y
    }

    ctx.fillText(lineArcGrid[k].text, x, y);
  }

  this.draw = function(status){
    clear();

    for(var i=0; i<lineGrid.length; i++){
      drawLine(i, status)
    }

    for(var i=0; i<lineArcGrid.length; i++){
      drawLineArc(i, status)
    }

    for(var i=0; i<arcGrid.length; i++){
      drawTextArc(i, status)
    }
  }
}


module.exports = canvasAction
