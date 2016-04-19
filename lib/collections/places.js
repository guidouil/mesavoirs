Places = new Mongo.Collection('places');

Ground.Collection(Places);

Places.allow({
  insert: function (userId, doc) {
    return userId && _.contains(doc.owners, userId);
  },
  update: function (userId, doc) {
    return userId && _.contains(doc.owners, userId);
  },
  remove: function (userId, doc) {
    return userId && _.contains(doc.owners, userId);
  },
  fetch: ['owners']
});

var AddressSchema = new SimpleSchema({
  fullAddress: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  lat: {
    type: Number,
    decimal: true,
    label: 'Latitude',
    optional: true,
    autoform: {
      omit: true
    }
  },
  lng: {
    type: Number,
    decimal: true,
    label: 'Longitude',
    optional: true,
    autoform: {
      omit: true
    }
  },
  street: {
    type: String,
    label: 'Numéro et nom de rue',
    max: 100
  },
  zip: {
    type: String,
    label: 'Code postal',
    regEx: /^[0-9]{5}$/
  },
  city: {
    type: String,
    label: 'Ville',
    max: 50
  },
  phone: {
    type: String,
    label: 'Téléphone',
    optional: true,
    max: 50
  },
  email: {
    type: SimpleSchema.RegEx.Email,
    label: 'Email',
    optional: true,
    max: 250
  },
  country: {
    type: String,
    label: 'Pays',
    max: 50,
    defaultValue: 'France'
  }
});

var CustomerSchema = new SimpleSchema({
  customerId: {
    type: String,
    autoform: {
      omit: true
    }
  },
  name:{
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  email:{
    type: SimpleSchema.RegEx.Email,
    autoform: {
      omit: true
    }
  }
});

var LoyaltyCardSchema = new SimpleSchema({
  enabled: {
    type: Boolean,
    label: 'Carte de fidélité',
    optional: true,
    autoValue: function () {
      if (this.isInsert) {
        return true;
      }
    }
  },
  pointCost: {
    type: Number,
    decimal: true,
    label: 'Prix pour compléter un point sur la carte',
    optional: true,
    defaultValue: 10
  },
  size: {
    type: Number,
    label: 'Nombre de points sur la carte de fidélité',
    optional: true,
    defaultValue: 10
  },
  voucherValue: {
    type: Number,
    decimal: true,
    label: 'Valeur de l\'avoir offert pour une carte complète',
    optional: true,
    defaultValue: 5
  },
});

var PlacesSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Nom'
  },
  description: {
    type: String,
    label: 'Description',
    optional: true,
    autoform: {
      rows: 3
    }
  },
  currency: {
    type: String,
    label: 'Devise des avoirs',
    autoValue: function () {
      if (this.isInsert) {
        return '€';
      }
    }
  },
  currencyLeft: {
    type: Boolean,
    label: 'Devise sur la gauche du chiffre',
    optional: true,
    autoValue: function () {
      if (this.isInsert) {
        return false;
      }
    }
  },
  imageUrl: {
    type: String,
    label: 'Image',
    max: 250,
    optional: true,
    autoform: {
      omit: true
    }
  },
  imageId: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  addresses: {
    type: [AddressSchema],
    label: 'Adresses',
    optional: true
  },
  website: {
    type: SimpleSchema.RegEx.Url,
    optional: true,
    label: 'Adresse de votre site internet ou de votre page facebook'
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
  loyaltyCard: {
    type: LoyaltyCardSchema,
    label: 'Carte de fidélité',
    optional: true
  },
  loyaltyPlan: {
    type: String,
    label: 'Modalités cartes de fidélité',
    max: 250,
    optional: true,
    autoform: {
      rows: 3
    }
  },
  owners: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    autoform: {
      type: 'hidden',
      label: false
    },
    autoValue: function () { if (this.isInsert) { return [this.userId]; }}
  },
  sellers: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    autoform: {
      type: 'hidden',
      label: false
    }
  },
  customers: {
    type: [CustomerSchema],
    label: 'Clients',
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

Places.attachSchema(PlacesSchema);
