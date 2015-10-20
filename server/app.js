//server only code

// smtp configuration to send e-mails to users
Meteor.startup(function () {
  smtp = {
    username: 'postmaster@sandboxbafe23918b32497dab14e0bb60338f31.mailgun.org',
    password: 'a0dce30d88457fc741c1b12b7cbdbe24',
    server:   'smtp.mailgun.org',
    port: 587
  }
  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' +       encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

// add new field to users collection. inbox field is the senders inbox if it doesn't exist
  if (!Meteor.users.find({inbox:{$exists: true}})){
    Meteor.users.update({}, {$set: {'inbox':[]}}, {upsert:false, multi:true});
  }

});
// publish users collection to clients only usernames
Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {username:1}});
});

// publish his inbox field to current user
Meteor.publish("inbox", function () {
  return Meteor.users.find({_id: this.userId},{fields: {inbox: 1}});
});

Meteor.users.deny({update: function () { return true; }});

Meteor.methods({
  sendMsg: function (sender, receiver) {
    if (!Meteor.users.findOne({_id:receiver, inbox:sender})) {
      Meteor.users.update({_id:receiver}, {$push: {'inbox':sender}})
      return false;
    }
    else {
      return true;
    }
  },
  clearYo: function (sender, receiver) {
    Meteor.users.update({_id:receiver}, {$pull: {'inbox':sender}});
  },
  clearAllYos: function (receiver) {
    Meteor.users.update({_id:receiver}, {$set: {'inbox':[]}})
  },
  
});