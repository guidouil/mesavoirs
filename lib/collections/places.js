Places = new Mongo.Collection('places');

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
  country: {
    type: String,
    label: 'Pays',
    max: 50,
    defaultValue: 'France'
  }
});

var CustomerShema = new SimpleSchema({
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
    type: String,
    autoform: {
      omit: true
    }
  }
});

var PlacesSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Nom',
    max: 140
  },
  description: {
    type: String,
    label: 'Description',
    max: 250,
    optional: true,
    autoform: {
      rows: 3
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
  owners: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    autoform: {
      type: 'hidden',
      label: false
    },
    autoValue: function () { return [this.userId]; }
  },
  customers: {
    type: [CustomerShema],
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
