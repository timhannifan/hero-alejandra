import togglePopUpMenu from '../../modules/toggle-popup-menu';
import velocitySlideHook from '../../modules/velocity-slide-hook';
let templateTabGroupName = 'storyTabs';

Template.story.onCreated(function() {
  this.storyId = this.data;
  Session.setDefault(templateTabGroupName, 'storyStory');
});

Template.story.rendered = function() {
  // Slick carousel for suggested stories on desktop
  $('.suggested-carousel').slick({
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    variableWidth: true,
    responsive: [ 
      {
        breakpoint: 990,
        settings: {
          arrows: false,
          centerMode: true,
          dots: true,
          slidesToShow: 3,
          swipe: true,
          variableWidth: true,
        }
      }
    ]
  });
}

// Comments helpers, we get the {{storyId}} var from the router
Template.story.helpers({
  storyId() {
    return Template.instance().storyId;
  },
  isActiveTab: function(name) {
    return Session.equals(templateTabGroupName, name);
  },
  activeTabName: function() {
    return Session.get(templateTabGroupName);
  },
  tabKey: function() {
    return templateTabGroupName;
  }
});

Template.story.events({
  'click .js-tab-trigger': function(e, template){
    e.preventDefault();
    let name = template.$(event.target).closest('.js-tab-trigger').data('tab-template');
    Session.set(templateTabGroupName, name);
  },
  'click .action-share.fixed-icon': function(e){ // Share menu
    e.preventDefault();
    Session.set('showFixedActionBarMenu', true);
    togglePopUpMenu($(e.target).next(".fixed-action-bar-menu"), "256px", "showFixedActionBarMenu");
  },
  'click .fixed-action-bar-menu': function(e){
    if ( Session.get('showFixedActionBarMenu') ) { 
      Session.set('showFixedActionBarMenu', false);
      togglePopUpMenu($(".fixed-action-bar-menu"), "0px", "showFixedActionBarMenu"); 
    }
  },
  'blur .fixed-action-bar-menu': function(e){
    if ( Session.get('showFixedActionBarMenu') ) { 
      Session.set('showFixedActionBarMenu', false);
      togglePopUpMenu($(".fixed-action-bar-menu"), "256px", "showFixedActionBarMenu"); 
    }
  },
  'click .share-more': function(e){ // Share menu
    e.preventDefault();
    Session.set('showActionBarMenu', true);
    togglePopUpMenu($(e.target).next(".action-bar-menu"), "192px", "showActionBarMenu");
  },
  'click .action-bar-menu': function(e){
    if ( Session.get('showActionBarMenu') ) { 
      Session.set('showActionBarMenu', false);
      togglePopUpMenu($(".action-bar-menu"), "0px", "showActionBarMenu"); 
    }
  },
  'blur .action-bar-menu': function(e){
    if ( Session.get('showActionBarMenu') ) { 
      Session.set('showActionBarMenu', false);
      togglePopUpMenu($(".action-bar-menu"), "192px", "showActionBarMenu"); 
    }
  },
  'click .st-like': function(e){
    $closestLike = $(event.target).closest('.st-like');
    if ($closestLike.data('liked-viewer')){
        $('.st-like').removeClass("liked-viewer").data('liked-viewer', false);
      } else {
        $('.st-like').addClass("liked-viewer").data('liked-viewer', true);
      }
    }
});

// Template for sticky share bar for mobile
Template.stickyActionsMobile.onRendered(function() {
  velocitySlideHook("#sticky-actions-mobile-hook", "slideUpIn", "slideDownOut", "1200", "300");
});

// Template for sticky action bar for desktop
Template.stickyActionsDesktop.onRendered(function() {
  velocitySlideHook("#sticky-actions-desktop-hook", "slideUpIn", "slideDownOut", "400", "300");
});
