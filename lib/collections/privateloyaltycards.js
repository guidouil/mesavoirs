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
    label: 'Nom du commerce lié a cette carte',
    autoform: {
      type: 'autocomplete-input',
      settings: {
        position: 'top',
        limit: 5,
        rules: [
          {
            collection: CardsBrands,
            field: 'name',
            matchAll: true,
            template: Meteor.isClient && Template.cardBrandName
          }
        ]
      }
    }
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
    label: 'Format du code de la carte',
    allowedValues: ['QR_CODE', 'CODABAR', 'CODE_128', 'CODE_39', 'EAN_13', 'EAN_8', 'UPC_A', 'ITF'],
    autoform: {
      type: 'select',
      options: function () {
        return [
          {label: 'QR Code', value: 'QR_CODE'},
          {label: 'CODABAR', value: 'CODABAR'},
          {label: 'Code 128', value: 'CODE_128'},
          {label: 'Code 39', value: 'CODE_39'},
          {label: 'EAN 13', value: 'EAN_13'},
          {label: 'EAN 8', value: 'EAN_8'},
          {label: 'UPC-A', value: 'UPC_A'},
          {label: 'ITF', value: 'ITF'}
        ];
      }
    }
  },
  points: {
    type: String,
    label: 'Nombre de points ou valeurs',
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
      label: false,
      afFieldInput: {
        type: 'hidden'
      }
    }
  },
  cardBrandId: {
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

Ground.Collection(PrivateLoyaltyCards);
