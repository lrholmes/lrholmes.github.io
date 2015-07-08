var saveElement;
var saveScroll = 0;
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

	if (toPage == "post") {
		if (selected.hasClass('project-link')) {
			console.log("...to post page");
			fixPosition(selected);
		} else {
			toPage = "page";
		}
	}

	if (fromPage == "post") {
		//$('#frame').css({
		//	'margin-top': '-1000px'
		//});
		if (toPage == "home" && saveElement) {
			$('html,body').animate({
				scrollTop: 0
			}, 200, function(){
				returnToPosition();
				return;
			});
		} else {
			$('#frame').css('margin-top', margin);
			$('.project').fadeOut(400);
		}
	}

	if (toPage == "page" || fromPage == "page" || fromPage == "home") {
		if (toPage == "home") {
			$('#nextFrame').css({
				'transition' : 'opacity 0ms',
				'opacity': 0
			});
		}
		if (toPage == "page" || fromPage == "page") {
			$('#frame').css({
				'margin-top': margin,
				'opacity' : 0
			});
		}
	}

	if (fromPage == "post") {
		//window.setTimeout(function(){
			//$('#frame').css({
			//	'opacity': '0'
			//});
		//}, 300);
	}

	$('footer').css({
		'transition': 'all 0ms',
		'opacity': '0',
		'top':'400px'
	});
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
		if (toPage == "post") {
		$('#nextFrame .post').css('top', '2000px');
		$('.post-title').css({
			'top':'-100px',
			'opacity':'0'
		});
		//$('footer').css('margin-top', (400 + $('#nextFrame').height()+'px'));
		var selector = ".projects a:nth-child(" + (selectedIndex+1) + ") .project";
		$(selector).css('opacity', 0);
		}
		if (toPage == "home" && fromPage == "page") {
			$('#nextFrame').css({
				'transition' : 'opacity 400ms',
				'opacity': 1
			});
		}
		window.setTimeout(function(){
			if (toPage == "post") {
				window.setTimeout(function(){
					$(selector).css('opacity', 1);
				},700);

				$('#nextFrame .post').css('top', '400px');
				$('.post-title').css({
					'top':'0',
					'opacity': '1'
				});
			}
			$('footer').css({
				'transition': 'all 200ms',
				'opacity': '1',
				'top':'0px'
				});
			$('#frame').remove();
			$('#nextFrame').attr('id', 'frame');
			$('.page-content').append('<div id="nextFrame" class="animate" style=""></div>');
		},400);
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
		w: el.outerWidth(),
		h: el.outerHeight(),
		x: el.offset().top-scroll,
		y: el.offset().left
	}
	saveElement = element;
	saveScroll = scroll;
	el.css({
		'transition':' opacity 100ms'
		//'opacity': 0
	});

	//pickup elements in clone
	var pageTitle = clone.children('.heading');
	clone.css({
		'position':'fixed',
		'top': element.x + 'px',
		'left': element.y + 'px',
		//'padding' : 0,
		'margin' : 0,
		'height': element.h,
		'width': element.w,
		'z-index': 3
	});
	clone.prependTo('.page-content');

	window.setTimeout(function(){
		// move whole element
		console.log("resize elements");
		clone.css({
			'top': 0,
			'left': 0,
			'margin': 0,
			'width':'100%'
		});
		clone.children('p').fadeOut('slow');

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

			$('.post').css({
				'top': '2000px'
			});

			$('.projects .project:eq('+saveIndex+')').css('opacity', 0);
			window.setTimeout(function(){
			//$('.single .project').prependTo('.page-content');
			$('#frame').css({
				'opacity': '0'
			});
			
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
					'top' : '-100px',
					'left' : '100px',
					'background-color': 'rgba(250,250,250,0.6)',
					'font-size': '3em'
				});

				$('html,body').animate({
					scrollTop: saveScroll
				}, 50);

			},200);

			window.setTimeout(function(){
				if (saveElement) {
					$('.page-content > .project .heading').removeAttr('style');
					$('.page-content > .project').css({
						'position' : 'fixed',
						'top': saveElement.x + 'px',
						'left': saveElement.y + 'px',
						//'padding': 0,
						'margin' : 0,
						'height': saveElement.h,
						'width': saveElement.w,
					});

					//saveTarget.css('opacity', '1');
				} else {

				}
			}, 800);
			window.setTimeout(function(){
				$('.page-content > .project').fadeOut(800, function() {
					this.remove();
				});
				$('.projects .project:eq('+saveIndex+')').animate({
					'opacity': 1
				}, 200);
		}, 1000);
}
