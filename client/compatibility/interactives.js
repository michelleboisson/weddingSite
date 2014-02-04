//page slide on menu clicks
$(function() {
	  $('a[href*=#]:not([href=#])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {

	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html,body').animate({
	          scrollTop: target.offset().top - 50
	        }, 1000);
	        return false;
	      }
	    }
	  });
	});


var Slideshow = {
	init: function(){
		//Scrolling.weddingDetails();
	$("#slideshow").slidesjs({
		width: 900,
        height: 508,
    	pagination: {
      		active: true,
        	// [boolean] Create pagination items.
	        // You cannot use your own pagination. Sorry.
	      effect: "slide"
	        // [string] Can be either "slide" or "fade".
	    },
	    navigation: {
      active: true,
        // [boolean] Generates next and previous buttons.
        // You can set to false and use your own buttons.
        // User defined buttons must have the following:
        // previous button: class="slidesjs-previous slidesjs-navigation"
        // next button: class="slidesjs-next slidesjs-navigation"
      effect: "slide"
        // [string] Can be either "slide" or "fade".
    }
	  });
	}
}

var RSVPanimation = {
	slideup : function(){
		$("#header").animate({top : "-="+ $("#rsvpForm").outerHeight() }, 500, function(){
			//reset form
			var newHTML = " <form class='form-inline' role='form'> \
     				<div class='form-group' class='guestinquiry'> \
    <input type='email' class='form-control' id='lookupemail' placeholder='Enter your email'> \
    <button id='lookupguestbtn' class='btn btn-default'>Look up</button> \
  </div> \
</form> \
<div id='closebtn'>X</div>";

			$("#rsvpForm").attr("status", "closed");
			$("#rsvpForm").html(newHTML);
			$("#closebtn").on('click', RSVPanimation.slideup);
			$("#header").animate({top : '-90px'});
			 $("#lookupguestbtn").on('click', function(e) {
		        //if admin 
		        if ($("#lookupemail").val() == "admin"){
		          openAdminPanel();
		        }
		        else {
		          //else, regular look up
		          guestLookUp(e);
		        }
		    }
		);
	});
	},
	slidedown : function(){
		$("#rsvpForm").attr("status", "open");
		$("#header").animate({top : 0}, 500);
		$(".guestinquiry").slideDown();
	},
	toggleSlide : function(){
		if ($("#rsvpForm").attr("status") == "open")
			RSVPanimation.slideup();
		else
			RSVPanimation.slidedown();
	}
}

var s; //for scrollr
$(document).ready(function(){
	console.log("ready to roll");
	Slideshow.init();
	var s = skrollr.init({
    render: function(data) {
        //Log the current scroll position.
       //console.log(data.curTop);
  /*    	if (data.curTop < 670){
      		$("#hearts").css('visibility','hidden');
        }
        else
        	$("#hearts").css('visibility','visible');
 */   },

	});
	//if mobile device
	 if ((/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera)){
	 	s.destroy();
	 }
	
	//positioning
	$("#rsvpForm").css('padding-left', $(".nav li a:first-child").offset().left + 30 +'px');
	//$("#parallelogram").css('top', $("#brides-people").offset().top);
	$("#parallelogram").css('height', $("#brides-people").height() + 100);

	$("#RSVPbtn").on('click', RSVPanimation.toggleSlide);
	$("#closebtn").on('click', RSVPanimation.slideup);

})

$(window).load(function(){
   //$("#parallelogram").css('height', $("#brides-people").height() + 100);
});


