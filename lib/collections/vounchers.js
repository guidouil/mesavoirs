Vouchers = new Mongo.Collection('vouchers');

Vouchers.allow({
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

var VouchersSchema = new SimpleSchema({
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

Vouchers.attachSchema(VouchersSchema);
