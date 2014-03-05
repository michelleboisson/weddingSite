Guests = new Meteor.Collection('guests');


if (Meteor.isClient) {

addNewGuest = function(event){
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
  
  return false;
}

editGuest = function(guestID){
  console.log(" to edit clicked!");
  //event.preventDefault();
  //event.stopImmediatePropagation();

  //look up guest in question
  //console.log("hi "+ $(this))
  var guestToEdit = Guests.findOne({_id: guestID});
  
  //populate data in fields
  window.scrollTo(0, 0); //scroll to top

  $("#newGuestFirst").val(guestToEdit.firstname);
  $("#newGuestLast").val(guestToEdit.lastname);
  $("#newGuestEmail").val(guestToEdit.email);
  $("#newGuestPlusOne").val(guestToEdit.plusone);
  $("#hiddenID").val(guestToEdit._id);

  //attach event listener for button to save this.
  //$("#saveNewGuestbtn").off('click');

/*  $("#saveEditGuestbtn").on('click',function(event){
    event.preventDefault();
    event.stopImmediatePropagation();
    console.log("saving "+guestToEdit.firstname);
    Guests.update(guestToEdit._id, 
                {$set: {
                    firstname: $("#newGuestFirst").val(), 
                    lastname: $("#newGuestLast").val(), 
                    email: $("#newGuestEmail").val(),
                    plusone: $("#newGuestPlusOne").val(),
                  }});
      $("#newGuestFirst").add("#newGuestLast").add("#newGuestEmail").add("#newGuestPlusOne").val("");
  });
  $("a[data-id="+guestToEdit._id+"]").siblings(".timestamp").text(moment(parseFloat($(this).text())).fromNow());
 // each(function(index, element ){
   //   var time = parseFloat($(element).text());
      //console.log(index+" "+time+" "+moment(time).fromNow());
     // $(element).text( moment(time).fromNow() );
    // });
*/
  return false;
}



currentguest = {};
guestLookUp = function(event){
//event.stopImmediatePropagation();
    event.preventDefault();
  //check if there's a document
  console.log($(event.target).siblings());
  //console.log($(event.target).siblings().val());
  var textInField = $(event.target).siblings(".input-prepend").find("input").val();

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

saveThisRSVP = function(e){
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
      var response = "Sweet! See you on Saturday April 26 at 7:30pm!";
      var htmlEmail = Template[ 'GuestComing' ]();
      var htmlGreeting = currentguest.firstname+", Glad you can make it!";
  }
  if (currentguest.answerme == "1" && currentguest.answerplus1 == "1"){
      var response = "Sweet! See you both on Saturday April 26 at 7:30pm!";
      var htmlEmail = Template[ 'GuestComing' ]();
      var htmlGreeting = currentguest.firstname+" and "+currentguest.plusone+", Glad you can make it!";
  }
  if (currentguest.answerme == "1" && currentguest.answerplus1 == "0" && currentguest.plusone != ""){
    if(currentguest.plusone == "your plus one")
      var response = "We're glad you can make it! See you on Saturday April 26 at 7:30pm!"; 
    else 
      var response = "We'll miss "+ thisguest.plusone +", but we're glad you can make it. See you on Saturday April 26 at 7:30pm!";
    var htmlEmail = Template[ 'GuestComing' ]();
    var htmlGreeting = currentguest.firstname+", Glad you can make it!";
    console.log("true 3");
  }
  if (currentguest.answerme == "0" ){
    console.log("true 4");
      var response = "Bummer!";
      var htmlEmail = Template[ 'GuestNotComing' ]();
      var htmlGreeting = currentguest.firstname+", Sorry you can't make it.";
  }
  // update text on page
  $(".guestinquiry").html(response);
  $(".guestinquiry").css("text-align","center");

  //send email

    //set up emails

  console.log(htmlEmail);
  var toEmails = currentguest.email+',anisahandmichelle@gmail.com';

  console.log("sending email");
  Meteor.call('sendEmail',
            toEmails,
            'anisahandmichelle@gmail.com',
            ''+htmlGreeting+'',
            ''+htmlEmail+'');


}//end SaveThisRSVP

  console.log("hi!");

Template.home.rendered = function(){
  letsGetRolling();
 }
  
Template.guestCount.rsvps = function(){
  var count = 0;
  var rsvpcount = Guests.find({answerme: "1"}).count() + Guests.find({answerplus1: "1"}).count() +" / "+ (Guests.find({}).count() + Guests.find({plusone: {$ne:""}}).count());
  
  return rsvpcount;
}
Template.guestCount.didntRSVP = function(){
  var didntRSVP ={};
  didntRSVP.guests= Guest.find({timestamp: {$lt: 1393210464830}});
  didntRSVP.count= Guest.find({timestamp: {$lt: 1393210464830}}).count();

  return didntRSVP;
}

  Template.addnewGuest.rendered = function(){
    console.log("add guest template rendered");
  }
  Template.addnewGuest.events({
    'click #saveNewGuestbtn' : addNewGuest,
    'click #saveEditGuestbtn' : function(event){
      var thisID = $("#hiddenID").val();
        console.log(thisID);
        event.preventDefault();
        event.stopImmediatePropagation();
        var guestToEdit = Guests.findOne({_id: thisID});
        console.log("saving "+guestToEdit.firstname);
        Guests.update(guestToEdit._id, 
                    {$set: {
                        firstname: $("#newGuestFirst").val(), 
                        lastname: $("#newGuestLast").val(), 
                        email: $("#newGuestEmail").val(),
                        plusone: $("#newGuestPlusOne").val(),
                      }});
          $("#newGuestFirst").add("#newGuestLast").add("#newGuestEmail").add("#newGuestPlusOne").val("");
      
      //$("a[data-id="+guestToEdit._id+"]").siblings(".timestamp").text(moment(parseFloat($(this).text())).fromNow());
    }
  })

Template.guestEmails.allemails = function(){
  return Guests.find({});
}

 Template.guestList.allguests = function(){
    return Guests.find({}, {sort: {timestamp: -1}});
  }
  Template.guestList.rendered = function(){
    console.log("guestlist rendered");
    //timestampes moment
     $(".timestamp").each(function(index, element ){
      var time = parseFloat($(element).attr("data-time"));
      
      //if the timestamp is after launch, they edited their response
      if (time >= 1393210464830){
        $(element).parent("tr").addClass("registered");
      }else{
        $(element).parent("tr").addClass("notregistered");
      }

      //change the display 
      $(element).text( moment(time).fromNow() );

     })
  };

  Template.guestList.events({
    'click #adminpanel td a.editGuestBTN' : function(event){
        var thisID = $(event.target).attr("data-id");
        console.log(thisID);
        editGuest(thisID);

    },
    'click #adminpanel td a.deleteGuestBTN' : function(event){
        var thisID = $(event.target).attr("data-id");
        console.log(thisID);
        if (confirm('Are you sure you want to remove this guest?')) {
          Guests.remove(thisID);
        } else {
            // Do nothing!
        }
        
      }
  })
  Template.mainnav.events({
    'click #rsvplink' : RSVPanimation.toggleSlide
  })
  Template.guestLookUp.rendered = function(){
    console.log("rsvp template rendered");
    $("#rsvpForm").css('padding-left', $("#main-nav").offset().left  +'px');
    //$("#rsvpForm form").css("position", "relative");
    //$("#rsvpForm form").css("left", $("#main-nav").offset().left);
  }
  Template.guestLookUp.events({
    'click #lookupguestbtn' : function(e) {
          guestLookUp(e);
    },
    'click #closebtn' : RSVPanimation.toggleSlide,
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
    Meteor.methods({
      sendEmail: function (to, from, subject, text) {
        check([to, from, subject, text], [String]);

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();

        Email.send({
          to: to,
          from: from,
          subject: subject,
          html: text
        });
      }
    });

  });
}
//end .isServer





