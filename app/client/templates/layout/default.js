import openSidePanel from '../../modules/open-side-panel';
import storyLike from '../../modules/story-like';

let dataReadyHold = null;
const NOTIFICATION_TIMEOUT = 3000;
const IGNORE_CONNECTION_ISSUE_KEY = 'ignoreConnectionIssue';
const CONNECTION_ISSUE_TIMEOUT = 3000;
let notifications = new Mongo.Collection(null);

Session.setDefault(IGNORE_CONNECTION_ISSUE_KEY, true);
Session.setDefault('showMobileNav', false);
Session.setDefault('showStickyHeader', false);
Session.setDefault('showStickActionsMobile', false);
Session.setDefault('showStickActionsDesktop', false);
Session.setDefault('showUserNav', false);
Session.setDefault('showFixedActionBarMenu', false);
Session.setDefault('showActionBarMenu', false);

Meteor.startup(function () {
  if (Meteor.isClient) {
    dataReadyHold = LaunchScreen.hold();
  }
  // Only show the connection error box if it has been 3 seconds since
  // the app started
  setTimeout(function () {
    dataReadyHold.release();
    Session.set(IGNORE_CONNECTION_ISSUE_KEY, false);
  }, CONNECTION_ISSUE_TIMEOUT);
});

Template.default.onCreated(function() {
  this.addNotification = function(notification) {
    let id = notifications.insert(notification);

    Meteor.setTimeout(function() {
      notifications.remove(id);
    }, NOTIFICATION_TIMEOUT);
  };
  

  this.scrollPosition = new ReactiveVar(0);
  this.screenWidth = new ReactiveVar(window.innerWidth);

  this.showMobileNav = Session.get('showMobileNav');
  this.stickyHeaderActive = Session.get('showStickyHeader');
  this.stickyActionsMobileActive = Session.get('showStickActionsMobile');
  this.stickyActionsDesktopActive = Session.get('showStickActionsDesktop');
  this.setStickyHeader = function(val){
    Session.set('showStickyHeader',val);
  };
  this.setShowMobileNav = function(val){
    Session.set('showMobileNav',val);
  };
  this.setStickyStoryBar = function(val){
    Session.set('showStickActionsMobile',val);
  };
  this.setStickyActionBar = function(val){
    Session.set('showStickActionsDesktop',val);
  };

  this.onResize = function(newValue,instance) {
    instance.screenWidth.set(newValue);
  };
  this.onScroll = function(newValue,instance) {
    instance.scrollPosition.set(newValue);
  };

  this.autorun(() => {
    this.scrollPosition.get() > 180 && this.screenWidth.get() > 992 ? Session.set('showStickyHeader', true) : Session.set('showStickyHeader', false)//this.stickyHeaderActive.set(true) : this.stickyHeaderActive.set(false);
    this.scrollPosition.get() < ($(document).height()-$(window).height()-900) && this.screenWidth.get() > 992 ? Session.set('showStickActionsDesktop', true) : Session.set('showStickActionsDesktop', false);
    console.log('scrollPosition from autorun: ' + this.scrollPosition.get());
  });
  this.autorun(() => {
    this.screenWidth.get() > 992 ? Session.set('showMobileNav', false) : Session.set('showMobileNav', true);    
    this.scrollPosition.get() > 103 && this.screenWidth.get() < 992 ? Session.set('showStickActionsMobile', true) : Session.set('$(window).height()', false);    
    console.log('screenWidth from autorun: ' + this.screenWidth.get());
  });
});

Template.default.onRendered(function() {
  let self = this;
  $(window).on('scroll', function() {
    self.onScroll(window.scrollY, self);
  });
  $(window).on('resize', function() {
    self.onResize(window.innerWidth, self);
  });
});
Template.default.onDestroyed(function() {
  let self = this;
  $(window).off('scroll', function() {
    self.onScroll(0,self);
  });
    $(window).off('resize', function() {
    self.onResize(window.innerWidth, self);
  });
});

Template.default.helpers({
  connected: function() {
    return Session.get(IGNORE_CONNECTION_ISSUE_KEY) ||
      Meteor.status().connected;
  },  
  notifications: function() {
    return notifications.find();
  }
});

Template.default.events({
  'click .side-panel-trigger': function(e, template){
    openSidePanel(e, template);
  },
  'click .st-count': function(e){
      e.preventDefault();
      storyLike(e);
  }
});
