Growls = new Meteor.Collection('growls');

Growls.allow({
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

Growls.deny({
  update: function (userId, doc, fields, modifier) {
    return true;
  }
});

var Schemas = {};
Schemas.Growls = new SimpleSchema({
  placeId: {
    type: String,
    label: 'Place',
    optional: true
  },
  from: {
    type: String,
    optional: true
  },
  to: {
    type: String
  },
  type: {
    type: String
  },
  title: {
    type:String,
    optional: true
  },
  message: {
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

Growls.attachSchema(Schemas.Growls);

Ground.Collection(Growls);
