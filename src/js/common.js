head.ready(function(){

	$('#loader').fadeOut('fast');

	// validation
	$.validate({
		scrollToTopOnError : false
	});

	// Clear placeholder
	(function() {
		$('input,textarea').focus(function(){
				$(this).data('placeholder',$(this).attr('placeholder'))
				$(this).attr('placeholder','');
		});
		$('input,textarea').blur(function(){
			$(this).attr('placeholder',$(this).data('placeholder'));
		});
	}());

	// flexMenu
	$('.navigation ul').flexMenu({
		'linkText': 'More <i class="icon-triangle"></i>'
	});
	$(document).on('click', '.flexMenu-viewMore > a', function(){
		if ($(this).parent().hasClass('is-active')) {
			$('.header').animate({'margin-bottom': $('.flexMenu-popup').outerHeight() - 1 + 'px'},500).siblings().eq(0).slideToggle(500);
		} else {
			$('.header').animate({'margin-bottom': '0'},500).siblings().eq(0).slideToggle(500);
		}
	});
	// onResize
	$(window).on('resize', function(){
		$('.header').animate({'margin-bottom': '0'},0).siblings().eq(0).slideUp(0);
		$('.form-search').slideUp(0);
		$('#menu_toggle').removeClass('is-active');
	});

	// search Toggle
	$('.search-btn').on('click', function() {
		$(this).toggleClass('is-active');
		$('.form-search').slideToggle(500).css({
			'position': 'relative',
			'top': '0'
		});
	});

	// mobile nav
	$('#menu_toggle').on('click', function(){
		$(this).toggleClass('is-active');
		if ($(this).hasClass('is-active')) {
			$('.header').animate({'margin-bottom': $('.flexMenu-popup').outerHeight() - 1 + 70 + 'px'},500).siblings().eq(0).slideToggle(500);
			$('.flexMenu-popup').fadeToggle(500).css({
				'top': '120px'
			});
			$('.form-search').slideToggle(500).css({
				'position': 'absolute',
				'left': '0',
				'top': '50px',
				'right': 0
			});
		} else {
			$('.header').animate({'margin-bottom': '0'},500).siblings().eq(0).slideToggle(500);
			$('.flexMenu-popup').fadeToggle(500);
			$('.form-search').slideToggle(500);
		}
	});

	// popup close
	$('.popup__close-btn').on('click', function(){
		$(this).parent().parent().fadeOut(200).removeClass('is-active');
	});
	$(document).on('click touchstart', function(e) {
	    if ( ($(e.target).closest('.popup__in').length === 0) && ($(e.target).closest('.popup-toggle').length === 0) ) {
	        $('.popup').fadeOut(200);
	        $('.popup').removeClass('is-active');
	    }
	});

	// popup login
	$('.login-btn').on('click', function(){
		$('.popup-login').addClass('is-active').fadeIn(300);
	});

	// popup register
	$('.sign-btn').on('click', function(){
		$('.popup').fadeOut(200).removeClass('is-active');
		$('.popup-sign').addClass('is-active').fadeIn(300);
	});

	// mobile slider
	if (phoneInd) {
		if ($('.grid__list').length) {
			$('.grid__list').slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				dots: true,
				arrows: false,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: true,
				autoplaySpeed: 10000,
				speed: 300,
				adaptiveHeight: true
			});
		}
	}

	// grid
	if (!phoneInd) {
		var gridInterval = null;
		var gridTime;
		var setTime = [];
		var userTimeAFK = 7000;
		// grid animation
		function gridAnimation() {
			var textTitleSpeed = 1000,
				titleOpacitySpeed = 500,
				tooltipSpeed = 600, // css grid__tooltip transition time
				tooltipHold = 3000;
			gridTime = 2*textTitleSpeed + tooltipHold + tooltipHold/2 + 5*(2*tooltipSpeed + tooltipHold) + 1000;
			function showTitle() {
				$('.grid__title').show();
		    	$('.grid__title').animate({opacity: '1'}, titleOpacitySpeed);
		    	$('.grid__title-text').css('top', '-20px').animate({top: '50%'}, textTitleSpeed);
			};
			function hideTitle(){
				$('.grid__title-text').animate({top: '110%'}, textTitleSpeed);
				setTimeout(function(){
					$('.grid__title').animate({opacity: '0'}, titleOpacitySpeed, function(){
						$(this).hide();
					});
				}, (textTitleSpeed + titleOpacitySpeed)/2);
			};
			function animateEl(){
				var numberEl = 0;
				$('.grid__list li').each(function(){
					if ($(this).is(':visible')) {
						numberEl++;
					}
				});
				var randomEl = Math.floor(Math.random() * numberEl);
				$('.grid__list li').eq(randomEl).find('.grid__tooltip').css({top: '0'});
				setTime[0] = setTimeout(function(){
					$('.grid__tooltip').css({top: '100%'});
				},tooltipHold + tooltipSpeed);
			};

			function gridAnimationLogic() {
				$('.grid__tooltip').css({top: '100%'});
				$.when(showTitle()).done(function(){
		    		setTime[1] = setTimeout(function(){
		    			$.when(hideTitle()).done(function(){
		    				setTime[2] = setTimeout(function(){
		    					for (var i = 0; i < 5; i++) {
		    						setTime[3 + i] = setTimeout(function(){
		    							animateEl();
		    						}, i * (2 * tooltipSpeed + tooltipHold));	
		    					}
		    				}, tooltipHold / 2);
		    			});    			
		    		},tooltipHold);
		    	});
			};

		    $(document).idleTimer(userTimeAFK);

		    $(document).on("idle.idleTimer", function (event, elem, obj) {
		    	gridAnimationLogic();
		    	gridInterval = setInterval(function(){
		    		gridAnimationLogic();
		    	}, gridTime);
			});

			$(document).on("active.idleTimer", function (event, elem, obj, e) {
				clearInterval(gridInterval);
				for (var i = 0; i < setTime.length; i++) {
					clearTimeout(setTime[i]);
				};
				hideTitle();
				$('.grid__tooltip').css({top: '100%'});
			});
		};

		// resize grid blocks
		function gridResize() {
			$('.grid__list li').css('height', $('.grid__list li').eq(0).width() * 2 / 3);
		};

		if ($('.grid-wrap').length) {
			$('.grid__list li').hover(function(){
				$(this).find('.grid__tooltip').css('top', '0');
			}, function(){
				$(this).find('.grid__tooltip').css('top', '100%');
			});
			if (!phoneInd) {
				gridResize();
				$(window).on('resize', function(){
					gridResize();
				});
				gridAnimation();
			}
		}
	}
	
});