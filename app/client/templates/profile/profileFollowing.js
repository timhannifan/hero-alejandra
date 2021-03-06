// Follow events
// If a user is being followed, [data-following="true"], otherwise, it's shown as [data-following="false"]
// If following is true, the .following class is added for the active background and the text is updated
Template.profileFollowing.events({
  'click .js-follow': function(e){
    if ($(e.target).data('following')){
      $(e.target).text('follow').removeClass("following").data('following', false);
    } else {
      $(e.target).text('following').addClass("following").data('following', true);
    }
  }
});

