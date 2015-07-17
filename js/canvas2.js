var canvas = $('#c');
var canvasHeight;
var canvasWidth;
var ctx;

var mouseX, mouseY, mousePX, mousePY, pAv, prevLine, width=1, threshold=15;

function init(){
  canvasDimensions();

  draw();
}

init();

function canvasDimensions() {
  canvas.attr({height: $(window).height(), width: $(window).width()});
  canvasWidth = canvas.width();
  canvasHeight = canvas.height();

}

function draw() {
  // get mouse co-ords
  $('.landingPage').mousemove(function(event){
  	mouseX = event.pageX;
  	mouseY = event.pageY;
  });

  var tmpCanvas = canvas.get(0);

  if (tmpCanvas.getContext === null) {
    console.log('return');
    return;
  }

  ctx = tmpCanvas.getContext('2d');


  ctx.fillStyle = "rgba(240,240,240,0.05)";
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	ctx.beginPath();
	ctx.moveTo(mousePX, mousePY);
	ctx.lineTo(mouseX,mouseY);
	var diffX = mousePX - mouseX;
	var diffY = mousePY - mouseY;
	var diffAv = (diffX + diffY)/2;
	if (diffAv > pAv) {
		if (diffAv > 0.9) {
			width++;
			if (width > threshold) {
				width = threshold;
			}
		} else {
			width--;
			if (width < 1) {
				width = 1;
			}
		}
	}
	// if ((diffAv - pAv) > 4) {

	// }
	ctx.lineWidth = width;
	ctx.lineCap = "round";
	ctx.strokeStyle = "#e4cb82";
	ctx.stroke();
	//console.log(mouseX + mouseY + mousePX+ mousePY);
	prevLine = [mousePX, mousePY, mouseX, mouseY, ctx.lineWidth];
	mousePX = mouseX;
	mousePY = mouseY;
	pAv = diffAv;
	requestAnimationFrame(draw);
}

$('.page-content').css({
  'position':'relative',
  'top':$(window).height()
});

$('html').css('overflow', 'hidden');

$('.site-header').css({
  'top': '-56px',
  'visibility': 'hidden'
});

// move on to site
$('.landingPage .continue').click(function(){
  $('.landingPage .continue').css('top', '-50%');
  window.setTimeout(function(){
    $('.landingPage canvas').css('height', 0);
    $('.landingPage .continue').css('opacity', 0);
    $('.page-content').css({
      'top':0
    });

    $('html').css('overflow', 'initial');
  },400);
  window.setTimeout(function(){
    $('.landingPage').remove();
    $('.site-header').css({
      'top': 0,
      'visibility': 'visible'
    });
  }, 1100);

});
