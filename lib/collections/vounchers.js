Vounchers = new Mongo.Collection('vounchers');

Vounchers.allow({
  insert: function (userId, doc) {
    return false;
  },
  update: function (userId, doc) {
    return false;
  },
  remove: function (userId, doc) {
    return false;
  }
});

var VounchersSchema = new SimpleSchema({
  placeId: {
    type: String
  },
  userId: {
    type: String
  },
  creatorId: {
    type: String
  },
  value: {
    type: Number,
    decimal: true
  },
  status: {
    type: String
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

Vounchers.attachSchema(VounchersSchema);
