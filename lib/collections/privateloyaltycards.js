PrivateLoyaltyCards = new Meteor.Collection('privateloyaltycards');

PrivateLoyaltyCards.allow({
  insert: function (userId, doc) {
    return userId && doc.owner === userId;
  },
  update: function (userId, doc, fields, modifier) {
    return userId && doc.owner === userId;
  },
  remove: function (userId, doc) {
    return userId && doc.owner === userId;
  },
  fetch: ['owner']
});


var Schemas = {};
Schemas.PrivateLoyaltyCards = new SimpleSchema({
  name: {
    type: String,
    label: 'Nom du commerce lié a cette carte'
  },
  owner: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoform: {
      type: 'hidden',
      label: false
    },
    autoValue: function () { return this.userId; }
  },
  code: {
    type:String,
    label: 'Code de la carte'
  },
  format: {
    type: String,
    label: 'Format du code de la carte'
  },
  points: {
    type: Number,
    label: 'Points',
    optional: true
  },
  notes: {
    type: String,
    label: 'Notes',
    optional: true,
    autoform: {
      rows: 3
    }
  },
  imageId: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
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

PrivateLoyaltyCards.attachSchema(Schemas.PrivateLoyaltyCards);
