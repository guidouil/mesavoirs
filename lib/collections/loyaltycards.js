LoyaltyCards = new Meteor.Collection('loyaltycards');

LoyaltyCards.allow({
  insert: function (userId, doc) {
    return false;
  },
  update: function (userId, doc, fields, modifier) {
    return false;
  },
  remove: function (userId, doc) {
    return false;
  }
});

LoyaltyCards.deny({
  update: function (userId, doc, fields, modifier) {
    return true;
  }
});

var Schemas = {};
Schemas.LoyaltyCards = new SimpleSchema({
  placeId: {
    type: String,
    label: 'Place'
  },
  userId: {
    type: String,
    label: 'user'
  },
  points: {
    type: Number,
    label: 'amount'
  },
  creatorId: {
    type: String,
    label: 'owner'
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
  },
  updatedAt: {
    type: Date,
    autoValue: function () {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

LoyaltyCards.attachSchema(Schemas.LoyaltyCards);
