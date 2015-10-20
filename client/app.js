//client only code

Meteor.subscribe("directory");
Meteor.subscribe("inbox");

// USERLIST HELPERS
Template.userlist.helpers({
  // returns the other users list, only the username field
  'allusers': function(){
    var currentUserId = Meteor.userId();  
    return (Meteor.users.find({_id : {"$ne" : currentUserId}},{fields: {username: 1}}));
  },
  // returns the number of users
  'usernum': function(){
    return (Meteor.users.find().count());
  },
  // returns session selected
  'selectedClass': function(){
    var userId = this._id;
    var selectedUser = Session.get('selectedUser');
    if(userId == selectedUser){
      return "selected"
    }
  },
  // returns selectedUser name
  'selectedName': function () {
    var user = Meteor.users.findOne(Session.get("selectedUser"));
    return user && user.username;
  },
});

// USERLIST EVENTS
Template.userlist.events({
  'click .allusers': function(){
    var userId = this._id;
    Session.set('selectedUser', userId);
  },
  'click .send': function () {
    var currentUserId = Meteor.userId();
    var selectedUser = Session.get('selectedUser');
    Meteor.call("sendMsg", currentUserId, selectedUser, function(error, result){
      if (error){
        console.log(error.reason)
      }
      else {
        if (result) {
          alert("This user has not read your sent YO!.\nCannot send another YO! now.");
        }
      }
    });
  }
});

// USER HELPERS
Template.user.helpers({
  selected: function () {
    return Session.equals("selectedUser", this._id) ? "selected" : '';
  },
  // show YO! notifications from other users
  'notification': function () {
    var currentUserId = Meteor.userId();
    var userId = this._id;
    return (Meteor.users.findOne({_id:currentUserId, inbox:userId}));
  }
});

// USER EVENTS
Template.user.events({
  'click': function () {
    Session.set("selectedUser", this._id);
  },
  'click .msgYo': function() {
    var currentUserId = Meteor.userId();
    var userId = this._id;
    Meteor.call('clearYo', userId, currentUserId);
  }         
});

//INBOXINFO HELPERS
Template.inboxinfo.helpers({
    //returns number of inbox YOs
  'inboxYos': function() {
    var currentUserId = Meteor.userId();
    var inboxYo = Meteor.users.findOne(currentUserId).inbox
    if (inboxYo){
      return (inboxYo.length);
    }
    else { 
      return 0;
    }
  }
});

//INBOXINFO EVENTS
Template.inboxinfo.events({
  'click .clear': function () {
    var currentUserId = Meteor.userId();
    Meteor.call('clearAllYos',currentUserId);
  }
});

// Create an account with Username and Email
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});