var saveElement;
var saveScroll;
var saveTarget;
var saveIndex;

$(document).ready(function(){

	pageFunctions();

	var siteUrl = 'http://'+(document.location.hostname||document.location.host);
	var currentUrlHash = History.getState().hash;
	var selectedElement;

    $(document).delegate('a[href^="/"],a[href^="'+siteUrl+'"]', "click", function(e) {
        e.preventDefault();
        History.pushState({}, "", this.pathname);
				selectedElement = $(this);
				console.log(selectedElement);
				if (selectedElement.hasClass('project-link')) {
					saveIndex = $(this).index();
				}

				console.log("index chosen: " + saveIndex);
    });

    History.Adapter.bind(window, 'statechange', function(){
        var State = History.getState();
        $.get(State.url, function(data){
            document.title = $(data).find("title").text();

            transition(currentPage(currentUrlHash), currentPage(State.hash), selectedElement, saveIndex, data);

						pageFunctions();

						currentUrlHash = State.hash;
        });
    });

});


function pageFunctions() {
// functions triggered at every page change

}

function transition(fromPage, toPage, selected, selectedIndex, data) {
	console.log("transitioning from: " + fromPage + ", to: " + toPage + ", index: " + selectedIndex);
	var pageSelector = "." + fromPage;
	var margin = '-' + $('#frame').height() + 'px';

	if (fromPage == "post") {
		$('.post').css({
			'top': '2000px'
		});
		//$('#frame').css({
		//	'margin-top': '-1000px'
		//});
		if (toPage == "home") {
		window.setTimeout(function(){
			returnToPosition();
		},400);
		}
	}

	if (toPage == "post") {
		console.log("...to post page");
		fixPosition(selected);
	}


	//$('#frame').css({
	//	'opacity': '0'
	//});
	if (fromPage == "post") {
		//$('#frame .post').css
		window.setTimeout(function(){
			$('#frame').css({
				'opacity': '0'
			});
		}, 300);
	}

	$('footer').css('opacity', '0');
	$('#nextFrame').html($(data).find('#frame').html());
	window.setTimeout(function(){
		transitionToPage(fromPage, toPage, selectedIndex, data);
		console.log("load new page with ajax and begin transitionToPage");
	}, 600);
}

function transitionToPage(fromPage, toPage, selectedIndex, data) {
	var pageSelector = "." + toPage;
		// position off-canvas
		$('#nextFrame').css({
			'display':'block'
		});
		if (toPage == "post" || toPage == "home") {
		$('#nextFrame .post').css('top', '2000px');
		$('.post-title').css({
			'top':'-100px',
			'opacity':'0'
		});
		var selector = ".projects a:nth-child(" + (selectedIndex+1) + ") .project";
		$(selector).css('opacity', 0);
		window.setTimeout(function(){
			window.setTimeout(function(){
				$(selector).css('opacity', 1);
			},700);

			$('#nextFrame .post').css('top', '400px');
			$('.post-title').css({
				'top':'0',
				'opacity': '1'
			});

			$('#frame').remove();
			$('#nextFrame').attr('id', 'frame');
			$('.page-content').append('<div id="nextFrame" class="animate" style=""></div>');
		},400);
	}
	pageFunctions();
}

function currentPage(current) {
	var hashArray = current.split("/", 2);
	if (current == "/") {
		return "home";
	} else {
		if (hashArray[1] == "projects") {
			return "post";
		}
		return "page";
	}

}

function nextPage(next) {
	console.log(next);
	if (next == "/") {
		return "home";
	} else {
		return "post";
	}

}

function fixPosition(element) {
	console.log("fixing position...");
	var scroll = $(window).scrollTop();
	var screenWidth = $(window).width();

	var el = element.children('.project');
	saveTarget = el;
	var clone = el.clone();
	var element = {
		w: el.width(),
		h: el.height(),
		x: el.offset().top-scroll,
		y: el.offset().left
	}
	saveElement = element;
	saveScroll = scroll;
	el.css({
		'transition':' opacity 100ms',
		'opacity': 0
	});
	clone.prependTo('.page-content');

	//pickup elements in clone
	var pageTitle = clone.children('.heading');
	clone.css({
		'position':'fixed',
		'top': Math.ceil(element.x + 5) + 'px',
		'left': Math.ceil(element.y + 6) + 'px',
		'padding' : 0,
		'height': element.h,
		'width': element.w,
		'z-index': 3
	});

	window.setTimeout(function(){
		// move whole element
		console.log("resize elements");
		clone.css({
			'top': 0,
			'left': 0,
			'margin': 0,
			'width':'100%'
		});

		// move heading
		pageTitle.css({
			'position': 'absolute',
			'padding': '20px',
			'top' : '100px',
			'left' : '100px',
			'background-color': 'rgba(250,250,250,0.6)',
			'font-size': '3em'
		});
	},200);

	window.setTimeout(function(){
		console.log("make nextFrame visible");
		$('#nextFrame').css({
			'opacity':'1'
		});
		$(window).scrollTop(0);
		clone.css({
			'position': 'absolute'
			});
		var newClone = clone.clone();
		newClone.prependTo('#nextFrame');
		console.log("attached to nextFrame, and positioned absolute");
	}, 1000);

}

function returnToPosition() {
		$('html,body').animate({
			scrollTop: 0
		}, 200);
		window.setTimeout(function(){
		$('.single .project').prependTo('.page-content');
		$('.page-content > .project').css({
			'position': 'fixed',
			'top': 0,
			'left': 0,
			'margin': 0,
			'width':'100%',
			'padding': 0,
			'z-index': '3'
			});

			$('.page-content > .project .heading').css({
				'position': 'fixed',
				'padding': '20px',
				'top' : '100px',
				'left' : '100px',
				'background-color': 'rgba(250,250,250,0.6)',
				'font-size': '3em'
			});

		},200);

		$('html,body').animate({
			scrollTop: saveScroll
		}, 350);

		window.setTimeout(function(){
			$('.page-content > .project').css({
				'position' : 'fixed',
				'top': saveElement.x + 'px',
				'left': saveElement.y + 'px',
				'padding': 0,
				'margin' : $(window).width()*0.01 + 6 + 'px',
				'height': saveElement.h,
				'width': saveElement.w,
			});
			//saveTarget.css('opacity', '1');
			$('.page-content > .project .heading').removeAttr('style');
		}, 800);
		window.setTimeout(function(){
			$('.page-content > .project').fadeOut('slow', function() {
				this.remove();
			});
	}, 1000);

}
