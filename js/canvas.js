// global vars
var canvas = $('#c');
var canvasHeight;
var canvasWidth;
var ctx;
var tri = [];
var bgFill = [];
var colours = ["0, 40%", "215, 11%", "90, 3%", "39, 53%", "12, 46%"];
var lightness = [31, 21, 51, 67, 59];
var colours2 = ["48, 89%", "28, 80%", "6, 78%", "192, 15%", "184, 9%"];
var lightness2 = [50, 52, 57, 40, 62];
var tWidth = 80;
var tHeight = 80;
var cols, rows;
var mouseX=-10;
var mouseY=-10;
$(window).mousemove(function(event){
  mouseX = event.pageX;
  mouseY = event.pageY;
});

function init() {
  // setup canvas
  canvasDimensions();

  // loop to create triangles
  for (var x=0;x<cols+1;x++) {   // +1 to fill the width
    for (var y=0;y<rows;y++){

      // random int for colour array
      var index;
      index = y%colours.length;

      // downward pointing triangles
      tri.push(new Triangle(x*tWidth,y*tWidth,(x*tWidth)+tWidth,y*tWidth,(x*tWidth)+(tWidth/2),y*tHeight+tHeight, colours[index], (lightness[index])+getRandomInt(0, 30)));

      //upward pointing triangles
      tri.push(new Triangle(x*tWidth,y*tWidth,(x*tWidth)-(tWidth/2),y*tWidth+tHeight,(x*tWidth)+(tWidth/2),(y*tHeight)+tHeight, colours[index], (lightness[index])+getRandomInt(0, 30)));


    }
  }

  for (var y=0;y<rows;y++){
    bgFill.push(new Rect(y));
  }

  // calculates area of triangles, used when detecting mouse
  for (var i=0;i<tri.length;i++){
    tri[i].calculateArea();
  }

  draw();
}

init();

function canvasDimensions() {
  canvas.attr({height: $(window).height(), width: $(window).width()});
  canvasWidth = canvas.width();
  canvasHeight = canvas.height();

  cols = canvas.width()/tWidth;
  rows = canvas.height()/tHeight;

}


function draw() {
  var tmpCanvas = canvas.get(0);

  if (tmpCanvas.getContext === null) {
    return;
  }

  ctx = tmpCanvas.getContext('2d');
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  for (var i=0;i<bgFill.length;i++){
    bgFill[i].draw();
  }

  for (var i=0;i<tri.length;i++){
    tri[i].checkIfInside(mouseX, mouseY);
    tri[i].update();
    tri[i].draw();
  }
  requestAnimationFrame(draw);
}

function Triangle(x1,y1,x2,y2,x3,y3, colour, lightness) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.x3 = x3;
  this.y3 = y3;
  this.colour = colour;
  this.lightness = lightness;
  var newlightness = lightness;
  //var area, areaOne, areaTwo, areaThree;
  var inside = false;

  this.calculateArea = function() {
    this.a = (x1 - x3);
    this.b = (y1 - y3);
    this.c = (x2 - x3);
    this.d = (y2 - y3);
    this.area = (0.5*Math.abs((this.a*this.d)-(this.b*this.c)));
    //console.log(this.area);
  };

  this.checkIfInside = function(mouseX, mouseY){
    this.areaOne = calculateArea(mouseX, mouseY, this.x2,this.y2,this.x3,this.y3);
    this.areaTwo = calculateArea(mouseX, mouseY, this.x1,this.y1,this.x3,this.y3);
    this.areaThree = calculateArea(mouseX, mouseY, this.x1,this.y1,this.x2,this.y2);
    if ((this.areaOne + this.areaTwo + this.areaThree)>this.area) {
      this.inside = false;
      //console.log(this.area);
    } else {
      this.inside = true;
    }
  };

  this.update = function(){
    if (!this.inside) {
      //console.log(true);
      newlightness--;
      if (newlightness < this.lightness) {
        newlightness = this.lightness;
      }
    } else {
      newlightness = this.lightness+15;
    }
  };
  this.draw = function(){
    var c = "hsl(" + this.colour + ", " + newlightness + "%)";
    ctx.beginPath();
    ctx.moveTo(this.x1,this.y1);
    ctx.lineTo(this.x2,this.y2);
    ctx.lineTo(this.x3,this.y3);
    ctx.fillStyle = c;
    //ctx.strokeStyle = c;
    //ctx.stroke();
    ctx.fill();
    ctx.closePath();
  };
}

function Rect(y){
  this.y = y;
  this.c = "hsl(" + colours[y%colours.length] + ", " + lightness[y%colours.length] + "%)";

  this.draw = function(){
    ctx.beginPath;
    ctx.fillStyle = this.c;
    ctx.fillRect(0, this.y*tHeight, canvasWidth, tHeight);

  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateArea(x1,y1,x2,y2,x3,y3) {
  var a = (x1 - x3);
  var b = (y1 - y3);
  var c = (x2 - x3);
  var d = (y2 - y3);
  return 0.5*Math.abs((a*d)-(b*c));
}


// move on to site
$('.landingPage .title').click(function(){
  $('.landingPage .title').css('top', '-50%');
  window.setTimeout(function(){
    $('.landingPage').css('height', 0);
    $('.landingPage .title').css('opacity', 0);
  },400);
  window.setTimeout(function(){
    $('.landingPage').remove();
  }, 1100);

});
