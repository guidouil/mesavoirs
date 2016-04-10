Boards = new Meteor.Collection('boards');

Ground.Collection(Boards);

Boards.allow({
  insert: function (userId, doc) {
    if ( (doc.placeId && userId && ( isPlaceOwner(doc.placeId, userId) || isPlaceSeller(doc.placeId, userId) )) || userId === doc.to ) {
      return true;
    }
    return false;
  },
  update: function (userId, doc, fields, modifier) {
    return false;
  },
  remove: function (userId, doc) {
    if (userId && doc.to && userId === doc.to) {
      return true;
    }
    return false;
  }
});

Boards.deny({
  update: function (userId, doc, fields, modifier) {
    return true;
  }
});

var Schemas = {};
var Messages = new SimpleSchema({
  text: {
    type: String
  },
  who: {
    type: String
  },
  when: {
    type: Date
  },
  read: {
    type: Boolean
  }
});

Schemas.Boards = new SimpleSchema({
  placeId: {
    type: String,
    label: 'Place',
    optional: true
  },
  to: {
    type: String
  },
  title: {
    type:String,
    optional: true
  },
  messages: {
    type:String
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    },
    autoform: {
      omit: true
    }
  }
});

Boards.attachSchema(Schemas.Boards);
