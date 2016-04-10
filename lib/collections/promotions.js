Promotions = new Mongo.Collection('promotions');

Promotions.allow({
  insert: function (userId, doc) {
    return userId && isPlaceOwner(doc.placeId, userId);
  },
  update: function (userId, doc, fields, modifier) {
    return userId && isPlaceOwner(doc.placeId, userId);
  },
  remove: function (userId, doc) {
    return userId && isPlaceOwner(doc.placeId, userId);
  },
  fetch: ['placeId']
});

var Schemas = {};
Schemas.Promotions = new SimpleSchema({
  name: {
    type: String,
    label: 'Nom de la promotion'
  },
  start: {
    type: Date,
    label: 'Date de début de la promotion',
    optional: true
  },
  stop: {
    type: Date,
    label: 'Date de fin de la promotion',
    optional: true
  },
  description: {
    type: String,
    label: 'Description de la promotion',
    autoform: {
      rows: 3
    }
  },
  voucherValue: {
    type: Number,
    decimal: true,
    label: 'Valeur de l\'avoir offert par cette promotion'
  },
  usageLimit: {
    type: Number,
    optional: true,
    label: 'Nombre limite d\'utilisations'
  },
  imageId: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  enabled: {
    type: Boolean,
    autoValue: function () {
      if (this.isInsert) {
        return true;
      }
    },
    autoform: {
      omit: true
    }
  },
  placeId: {
    type: String,
    autoform: {
      label: false,
      afFieldInput: {
        type: 'hidden'
      }
    }
  },
  users: {
    type: [String],
    optional: true,
    autoform: {
      omit: true
    }
  },
  sent: {
    type: Boolean,
    autoValue: function () {
      if (this.isInsert) {
        return true;
      }
    },
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

Promotions.attachSchema(Schemas.Promotions);
