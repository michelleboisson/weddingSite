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


Slideshow = {
	init: function(){
		console.log("slideshow init");
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

RSVPanimation = {
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


})

$(window).load(function(){
   //$("#parallelogram").css('height', $("#brides-people").height() + 100);
});

letsGetRolling = function(){
	console.log("ready to roll");
	$('#rsvplink').on('click', RSVPanimation.toggleSlide);
	$('#RSVPbtn').on('click', RSVPanimation.toggleSlide);
	Slideshow.init();
	var s = skrollr.init({
    render: function(data) {
        //Log the current scroll position.
       //console.log(data.curTop);
		}
	})
	//if mobile device
	 if ((/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera)){
	 	s.destroy();
	 }
	
	//positioning
	$("#rsvpForm").css('padding-left', $(".nav li a:first-child").offset().left + 30 +'px');
	//////$("#parallelogram").css('top', $("#brides-people").offset().top);
	$("#parallelogram").css('height', $("#brides-people").height() + 100);

	//$("#RSVPbtn").on('click', RSVPanimation.toggleSlide);
	//$("#closebtn").on('click', RSVPanimation.slideup);

}






/* =========================================== 
// This will parse a delimited string into an array of
    // arrays. The default delimiter is the comma, but this
    // can be overriden in the second argument.
    //taken from http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
    function CSVToArray( strData, strDelimiter, callback, deferred ){
      // Check to see if the delimiter is defined. If not,
      // then default to comma.
      strDelimiter = (strDelimiter || ",");

      // Create a regular expression to parse the CSV values.
      var objPattern = new RegExp(
        (
          // Delimiters.
          "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

          // Quoted fields.
          "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

          // Standard fields.
          "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


      // Create an array to hold our data. Give the array
      // a default empty first row.
      var arrData = [[]];

      // Create an array to hold our individual pattern
      // matching groups.
      var arrMatches = null;


      // Keep looping over the regular expression matches
      // until we can no longer find a match.
      while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
          strMatchedDelimiter.length &&
          (strMatchedDelimiter != strDelimiter)
          ){

          // Since we have reached a new row of data,
          // add an empty row to our data array.
          arrData.push( [] );

        }


        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

          // We found a quoted value. When we capture
          // this value, unescape any double quotes.
          var strMatchedValue = arrMatches[ 2 ].replace(
            new RegExp( "\"\"", "g" ),
            "\""
            );

        } else {

          // We found a non-quoted value.
          var strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
      }
      //console.log(arrData);
      //callback(arrData, deferred);
    //convertToSJSON(arrData);
      // Return the parsed data.
      return( arrData );
    }
function convertToSJSON(arrayData , deferred){
  var json = {};
  for (i=1; i < arrayData.length; i++){
    var thisArr = arrayData[i];
        var str="";
        //dealing with commas in string
        for (j=1; j<thisArr.length; j++){
            str +=  thisArr[j]+", "
        }
        str = str.slice(0,-2); //remove the last to chars ", "        
    json[""+thisArr[0]+""] = str;
  }
  //console.log(json);
    window.document.title = json.meta_title;
  deferred.resolve(json);
    

  return json;
}



var adminAddNewGuest = function(obj){
  Guests.insert({
    timestamp: new Date().getTime(),
    firstname: obj.firstname, 
    lastname: obj.lastname, 
    email: obj.email,
    plusone: "",
    answerme: 0,
    answerplus1: 0
  })
  
  //$("#newGuestFirst").add("#newGuestLast").add("#newGuestEmail").add("#newGuestPlusOne").val("");
  Meteor.render(function() {
        return Template.guestList(Template.guestList.allguests);
    })
  return false;
}



*/


/** use this in console to convert to Collection Documents 
use in console to import users from launch rock CSV
USE: uncomment the above, save, copy the stuff below and paste in console.---- 

$.get( "/LaunchRock_Export_20140210_043602_UTC.csv")
  .done(function( data ) {
    var array = CSVToArray(data, ",",convertToSJSON);
    //console.log(array.length);
	//["2014-02-07 21:13:33", "artistaitaliana1@gmail.com", "0", undefined, "http://lnc.hr/c5gh1", "Francesca", "Mirra"] 


	$.each(array, function( index, value ) {
	  //alert( index + ": " + value );
	  var obj = {
	  	email: value[1],
	  	firstname: value[5],
	  	lastname: value[6]
	  }
	  
	  console.log(obj.email+", "+obj.firstname+" "+obj.lastname);
	  adminAddNewGuest(obj);

	});
  });

  */