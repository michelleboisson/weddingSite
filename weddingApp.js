Guests = new Meteor.Collection('guests');

var addNewGuest = function(event){
  console.log("clicked!");
  event.preventDefault();
  event.stopImmediatePropagation();
  Guests.insert({
    timestamp: new Date().getTime(),
    firstname: $("#newGuestFirst").val(), 
    lastname: $("#newGuestLast").val(), 
    email: $("#newGuestEmail").val(),
    plusone: $("#newGuestPlusOne").val(),
    answerme: 0,
    answerplus1: 0
  })
  console.log(Guests);
  $("#newGuestFirst").add("#newGuestLast").add("#newGuestEmail").add("#newGuestPlusOne").val("");
  Meteor.render(function() {
        return Template.guestList(Template.guestList.allguests);
    })
  return false;
}


var currentguest = {};
var guestLookUp = function(event){
//event.stopImmediatePropagation();
    event.preventDefault();
  //check if there's a document
  console.log($(event.target).siblings());
  console.log($(event.target).siblings().val());
  var textInField = $(event.target).siblings("input").val();

  if(Guests.findOne({email: textInField}) == undefined){
    event.preventDefault();
    console.log("NOT Found");
     $(".guestinquiry").append("<p>This email was not found</p>"); 
     return false;
  }
  else{
      currentguest = {
        name : Guests.findOne({email: textInField}).firstname
      }
      console.log(currentguest.name);
      Session.set("currentguest", Guests.findOne({email: textInField}));

      var frag = Meteor.render(function () {
        var guestname = Session.get("currentguest");

        //get current values
        var iscominganswer = Session.get("currentguest").answerme; 
        var isplusonecominganswer = Session.get("currentguest").answerplus1; 

        var YESanswer = {
          num : 1,
          word :  "YES"
        }
        var NOanswer = {
          num : 0,
          word: "No"
        }
        //set up text on page
        var theiranswer = (iscominganswer == 0) ?  NOanswer : YESanswer; 
        var theirplusonanswer = (isplusonecominganswer == 0) ? NOanswer : YESanswer; 

        guestname = guestname.firstname;
        var isSelected = (theiranswer.num == 1) ? " selected" : "";

        var greetingHTML = "<div class=row-fluid><div class=span3><h3>Hi " + guestname + "!</h3></div>";
        var comingHTML = "<div class=span5><div class='row-fluid'><p class='span8'>Will you be joining us for the festivities? \
        <div class='btn-group span4' id=answerme coming="+theiranswer.num+" value="+theiranswer.word+">  \
          <button type='button' value='yes' class='btn btn-default"+isSelected+"'>YES</button>\
          <button type='button' value='no' class='btn btn-default'>NO</button>\
        </div></div>\
        </p>";
       
        var closeDiv = "</div>";
        var submitDiv = "<div class=span2><button type=submit id=saveRSVP class='btn btn-default'>Save RSVP</button>";

        if (Session.get("currentguest").plusone == "" || Session.get("currentguest").plusone == undefined){
          var fullHTML = greetingHTML + comingHTML + closeDiv + submitDiv + closeDiv;
        }
        else { 
          var isSelected = (theirplusonanswer.num == 1) ? " selected" : "";
          var plusoneComingHTML = "\
          <div class='row-fluid'>\
          <p class='span8'>Will "+Session.get("currentguest").plusone+" be joining us as well?\
          <div class='btn-group span4' coming="+theirplusonanswer.num+" id=answerplus1 value="+theirplusonanswer.word+">  \
          <button type='button' value='yes' class='btn btn-default"+isSelected+"'>YES</button>\
          <button type='button' value='no' class='btn btn-default'>NO</button>\
        </div></div>\
          </p>";
          var fullHTML = greetingHTML + comingHTML + plusoneComingHTML + closeDiv + submitDiv + closeDiv;
        }
        return fullHTML;
      });

      // add text to page
      $(".guestinquiry").html(frag);

    }
} //end guestLookUp

var saveThisRSVP = function(e){
  e.stopImmediatePropagation();
   var thisguest = Guests.findOne({_id: Session.get("currentguest")._id});
   var currentguest = Session.get("currentguest");

  //if they have a plus one
  if ($("#answerplus1").length>0){
    //update Session
    Session.get("currentguest").answerme = $("#answerme").attr('coming');
    Session.get("currentguest").answerplus1 = $("#answerplus1").attr('coming'); 

    //update database record
    Guests.update(Session.get("currentguest")._id, 
                {$set: {
                    timestamp: new Date().getTime(),
                    answerme: $("#answerme").attr('coming'), 
                    answerplus1: $("#answerplus1").attr('coming') 
                  }});
  }
  else{ //if there is no plus one
    Session.get("currentguest").answerme = $("#answerme").attr('coming');
    Guests.update(Session.get("currentguest")._id, 
                {$set: {
                    timestamp: new Date().getTime(),
                    answerme: $("#answerme").attr('coming'), 
                  }});
  }

//deal with the interface
  //var thisguest = Session.get("currentguest");
 Session.set("currentguest", Guests.findOne({email: Session.get("currentguest").email }));
 var currentguest = Session.get("currentguest");
  if (currentguest.answerme == "1" && currentguest.plusone == ""){
      var response = "Sweet! See you on April 26!";
      console.log("true 1");
  }
  if (currentguest.answerme == "1" && currentguest.answerplus1 == "1"){
      var response = "Sweet! See you both on April 26!";
      console.log("true 2");
  }
  if (currentguest.answerme == "1" && currentguest.answerplus1 == "0" && currentguest.plusone != ""){
      var response = "We'll miss "+ thisguest.plusone +", but we're glad you can make it!";
      console.log("true 3");
  }
  if (currentguest.answerme == "0" && currentguest.answerplus1 == "0"){
    console.log("true 4");
      var response = "Bummer!";
  }
  // update text on page
  $(".guestinquiry").html(response);
  $(".guestinquiry").css("text-align","center");

}



if (Meteor.isClient) {
  console.log("hi!");

  Template.guestList.allguests = function(){
  return Guests.find();
  }
  //$("#saveNewGuestbtn").on("click",addNewGuest);
  Template.addnewGuest.rendered = function(){
    console.log("add guest template rendered");
     //timestampes moment
     $(".timestamp").each(function(index, element ){
      var time = parseFloat($(element).text());
      console.log(index+" "+time+" "+moment(time).fromNow());
      $(element).text( moment(time).fromNow() );
     })
     //click on save
     $("#saveNewGuestbtn").on('click', addNewGuest);
    //click on delete
      $("#adminpanel td a[data-id]").on('click', function(){
        var thisID = $(this).attr("data-id");

      });
      

  }
  
  Template.mainnav.events({
    'click #rsvplink' : RSVPanimation.toggleSlide
  })

  Template.guestLookUp.events({
    'click #lookupguestbtn' : function(e) {
        //if admin 
        if ($("#lookupemail").val() == "admin"){
          openAdminPanel();
        }
        else {
          //else, regular look up
          guestLookUp(e);
        }
    },
    'click #closebtn' : RSVPanimation.slideup,
    'click #saveRSVP' : saveThisRSVP,
    'click #answerme button[value=no]' : function () {
        $("#answerme button[value=no]").addClass("selected");
        $("#answerme button[value=yes]").removeClass("selected");
        $("#answerme").attr('coming', '0');
        $("#answerme").attr('value', 'No');
    },
    'click #answerme button[value=yes]' : function () {
        $("#answerme button[value=no]").removeClass("selected");
        $("#answerme button[value=yes]").addClass("selected");
        $("#answerme").attr('coming', '1');
        $("#answerme").attr('value', 'YES');
    },
    'click #answerplus1 button[value=no]' : function () {
        $("#answerplus1 button[value=no]").addClass("selected");
        $("#answerplus1 button[value=yes]").removeClass("selected");
        $("#answerplus1").attr('coming', '0');
        $("#answerplus1").attr('value', 'No');
    },
    'click #answerplus1 button[value=yes]' : function () {
        $("#answerplus1 button[value=no]").removeClass("selected");
        $("#answerplus1 button[value=yes]").addClass("selected");
        $("#answerplus1").attr('coming', '1');
        $("#answerplus1").attr('value', 'YES');
    }
  })

}
//end .isClient


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
//end .isServer


var openAdminPanel = function(){
  console.log("opening admin panel");
  // update text on page
  //$("#guestinquiry").html(response);
  
    Template.guestList.allguests = function(){
        return Guests.find();
    };

    $(".guestinquiry").append(Meteor.render(function() {
        return Template.addnewGuest();
    }));
    $(".guestinquiry").append(Meteor.render(function() {
      return Template.guestList(Template.guestList.allguests);
    }));


}