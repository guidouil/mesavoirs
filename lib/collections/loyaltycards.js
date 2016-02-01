LoyaltyCards = new Meteor.Collection('loyaltycards');

Ground.Collection(LoyaltyCards);

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

var LoyaltyCardsHistory = new SimpleSchema({
  what: {
    type: Number
  },
  who: {
    type: String
  },
  when: {
    type: Date
  }
});

var Schemas = {};
Schemas.LoyaltyCards = new SimpleSchema({
  placeId: {
    type: String,
    label: 'Place'
  },
  name: {
    type: String
  },
  userId: {
    type: String,
    label: 'user'
  },
  points: {
    type: Number,
    label: 'Points'
  },
  size: {
    type: Number,
    label: 'Size'
  },
  code: {
    type:String,
    optional: true
  },
  creatorId: {
    type: String,
    label: 'owner'
  },
  imageId: {
    type: String,
    optional: true,
    autoform: {
      label: false,
      afFieldInput: {
        type: 'hidden'
      }
    }
  },
  histories: {
    type: [LoyaltyCardsHistory],
    optional: true
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
