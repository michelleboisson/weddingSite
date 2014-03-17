//// Routes

Router.configure({
  layoutTemplate: 'layout'
});





Router.map(function () {
  /**
   * The route's name is "home"
   * The route's template is also "home"
   * The default action will render the home template
   */
   this.route('home', {
     path: '/',
     template: 'home',
     layoutTemplate: 'layout',
     after: function(){
      jQuery.getScript('/interactives.js', function(){
        letsGetRolling();
        $('#RSVPbtn').on('click', RSVPanimation.toggleSlide);
        $('.editGuestBTN').on('click', editGuest);
      });
      
     }
   });

  /**
   * The route's name is "posts"
   * The route's path is "/posts"
   * The route's template is inferred to be "posts"
   */
   this.route('admin', {
     path: '/admin',
     layoutTemplate: 'layout',
     after: function(){
        //Template.addnewGuest.rendered();
        $(".timestamp").each(function(index, element ){
          var time = parseFloat($(element).text());
          //console.log(index+" "+time+" "+moment(time).fromNow());
          $(element).text( moment(time).fromNow() );
         })
     }

   });

 this.route('gifts', {
     path: '/gifts',
     template: 'gifts',
     layoutTemplate: 'layout',
     after: function(){
      jQuery.getScript('/interactives.js', function(){
        letsGetRolling();
        $('#RSVPbtn').on('click', RSVPanimation.toggleSlide);
        $('.editGuestBTN').on('click', editGuest);
      });
      
     }
   });
this.route('savethedate', {
     layoutTemplate: 'layout',
     path: '/savethedate',
     template: 'savethedate',
   });

 this.route('email', {
     path: '/email',
     template: 'email',
   });

 this.route('sendemail', {
     path: '/sendemail',
     template: 'sendemail',
   });

 });