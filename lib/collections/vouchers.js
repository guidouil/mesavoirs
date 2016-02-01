Vouchers = new Mongo.Collection('vouchers');

Ground.Collection(Vouchers);

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

Vouchers.deny({
  update: function (userId, doc, fields, modifier) {
    return true;
  }
});

var VoucherHistory = new SimpleSchema({
  what: {
    type: Number,
    decimal: true
  },
  who: {
    type: String
  },
  when: {
    type: Date
  }
});

var VouchersSchema = new SimpleSchema({
  placeId: {
    type: String
  },
  name: {
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
  available: {
    type: Boolean
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
    type: [VoucherHistory],
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

Vouchers.attachSchema(VouchersSchema);
