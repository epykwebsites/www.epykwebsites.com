jQuery(document).ready(function($) {

	'use strict';

/*==========================================================*/
/* Preloader
/*==========================================================*/

	$(window).on('load', function(){
		$('#status').fadeOut();
		$('#preloader').delay(350).fadeOut('slow');
	});

/*==========================================================*/
/* Collapsible sidebar
/*==========================================================*/

	$('#sidebar-button, #overlay').click(function() {
		$('.portfolio-full').removeClass('portfolio-open');
		$('#top').removeClass('portfolio-open');
		$('#sidebar-button').toggleClass('open');
		$('body').toggleClass('sidebar-open');
		return false;
	});

/*==========================================================*/
/* Main menu
/*==========================================================*/

	$('#mainmenu ul > li:has(ul)').each(function() {
		$(this).addClass('expandable');
	});

	$('#mainmenu ul > li:has(ul) > a').click(function() {
		$(this).parent('li').toggleClass('expanded');
		$(this).parent('li').children('ul').slideToggle();
		return false;
	});

/*==========================================================*/
/* Swiper slider
/*==========================================================*/

	/* Initialize sliders */

	var swiper = [];
	$('.swiper').each(function(i,obj){
		swiper[i] = new Swiper(obj, {
			loop: false,
			calculateHeight: true
		});
		// Bind navigation arrows
		$(this).children('.nav-left').on('click', function(e){
			e.preventDefault();
			swiper[i].swipePrev();
		});
		$(this).children('.nav-right').on('click', function(e){
			e.preventDefault();
			swiper[i].swipeNext();
		});
	});

	/* Resize fix for IE11 */

	$(window).on('load', function(){
		swiper.forEach(function(entry) {
			window.setTimeout(function() { entry.resizeFix(); }, 500);
		});
	});

	/* Fullscreen slider */

	var fSwiper = new Swiper('#fullscreen-slider',{
		onSwiperCreated: function() {
			// Slide has video
			if ($('#fullscreen-slider .swiper-slide-active').has('video').length) {
				$('#fullscreen-slider .swiper-slide-active video').get(0).play();
			}
		},
		onSlideChangeStart: function() {
			// Stop videos in slider
			$('#fullscreen-slider .swiper-slide').each(function() {
				if ($(this).has('video').length) {
					$(this).children('video').get(0).pause();
				}
			});
			// Has video
			if ($('#fullscreen-slider .swiper-slide-active').has('video').length) {
				$('#fullscreen-slider .swiper-slide-active video').get(0).play();
			}
			// Hide arrow on first and last slide
			if (fSwiper.activeIndex == 0) {
				$('#nav-arrows .nav-left').addClass('hidden');
			} else {
				$('#nav-arrows .nav-left').removeClass('hidden');
			}
			if (fSwiper.activeIndex == (fSwiper.slides.length - 1)) {
				$('#nav-arrows .nav-right').addClass('hidden');
			} else {
				$('#nav-arrows .nav-right').removeClass('hidden');
			}
		}
	});
	// Bind external navigation arrows for fullscreen slider
	$('#nav-arrows .nav-left').on('click', function(e){
		e.preventDefault();
		fSwiper.swipePrev();
	});
	$('#nav-arrows .nav-right').on('click', function(e){
		e.preventDefault();
		fSwiper.swipeNext();
	});
	// Resize videos in fullscreen slider
	function resizeToCover() {
		$('#fullscreen-slider .swiper-slide').each(function() {
			if ($(this).has('video').length) {
				var vid_w_orig = parseInt($(this).find('video').attr('width'));
				var vid_h_orig = parseInt($(this).find('video').attr('height'));
				var container_w = $(this).width();
				var container_h = $(this).height();
				// Use largest scale factor of horizontal / vertical
				var scale_h =  container_w / vid_w_orig;
				var scale_v =  container_h / vid_h_orig;
				var scale = scale_h > scale_v ? scale_h : scale_v;
				// Scale the video
				$(this).find('video').width(scale * vid_w_orig);
				$(this).find('video').height(scale * vid_h_orig);
				// Center the video
				$(this).find('video').css('left', ((container_w - scale * vid_w_orig) / 2));
				$(this).find('video').css('top', ((container_h - scale * vid_h_orig) / 2));
			}
		});
	}
	resizeToCover();

/*==========================================================*/
/* On resize
/*==========================================================*/

	$(window).resize(function() {
		resizeToCover();
	});

/*==========================================================*/
/* On scroll
/*==========================================================*/

	$('#content').scroll(function(){
		// Add shadow to top header
		if ($('#content').scrollTop() > 0) {
			$('#top').addClass('shadow');
		} else {
			$('#top').removeClass('shadow');
		}
	});

/*==========================================================*/
/* Masonry blog
/*==========================================================*/

	// 3 columns
	$('.masonry-3').masonry({
		itemSelector: 'article',
		columnWidth: '.col-4'
	});

	// 4 columns
	$('.masonry-4').masonry({
		itemSelector: 'article',
		columnWidth: '.col-3'
	});

/*==========================================================*/
/* Isotope
/*==========================================================*/

	$('.isotope').isotope({
		resizable: 'false',
		itemSelector: '.isotope-item',
		masonry: {
			columnWidth: colW()
		}
	});

	/* Smart resize */

	function colW() {
		var colN;
		if ($('.isotope').hasClass('isotope-2')) {
			colN = 2;
		} else if ($('.isotope').hasClass('isotope-3')) {
			colN = 3;
		} else {
			colN = 4;
		}
		var colW = Math.floor($('.isotope').width() / colN);
		$('.isotope').find('.isotope-item').each(function() {
			$(this).css({
				width: colW
			});
		});
		return colW;
	}

	$(window).smartresize(function(){
		$('.isotope').isotope({
			masonry: {
				columnWidth: colW()
			}
		});
	});

	/* Filter */

	$('.filter-dropdown ul li').click(function(){
		var selector = $(this).attr('data-filter');
		$('.isotope').isotope({
			filter: selector
		});
	});

	/* Dropdown list */

	$('.filter-dropdown').click(function(){
		$(this).toggleClass('open');
	});

	$('.filter-dropdown ul li').click(function(){
		$(this).parent('ul').prev('.selected').children('span.val').text($(this).text());
	});

	/* Resize fix */

	$(window).on('load', function(){
		$(window).smartresize();
	});

/*==========================================================*/
/* Portfolio Item
/*==========================================================*/

	$('article.portfolio a').click(function() {
		var itemID = $(this).attr('href');
		$('#top').addClass('portfolio-open');
		$(itemID).addClass('portfolio-open');
		return false;
	});
	$('#portfolio-close').click(function() {
		$('.portfolio-full').removeClass('portfolio-open');
		$('#top').removeClass('portfolio-open');
		return false;
	});

/*==========================================================*/
/* AJAX Contact form
/*==========================================================*/

	$('#contact-form').submit(function() {
		$.post('send.php', $(this).serialize(), function(data){
			$('#contact-form').html('<p>' + data + '</p>');
		});
		return false;
	});

});