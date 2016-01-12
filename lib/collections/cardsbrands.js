CardsBrands = new Mongo.Collection('cardsbrands');

CardsBrands.allow({
  insert: function (userId, doc) {
    return userId && Roles.userIsInRole(userId, 'bo');
  },
  update: function (userId, doc, fields, modifier) {
    return userId && Roles.userIsInRole(userId, 'bo');
  },
  remove: function (userId, doc) {
    return userId && Roles.userIsInRole(userId, 'bo');
  }
});

var Schemas = {};
Schemas.CardsBrands = new SimpleSchema({
  name: {
    type: String,
    label: 'Nom de la marque'
  },
  baseline: {
    type: String,
    label: 'Slogan de la marque',
    optional: true
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

CardsBrands.attachSchema(Schemas.CardsBrands);
