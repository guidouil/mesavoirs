Contacts = new Mongo.Collection('contacts');

Contacts.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc) {
    return false;
  },
  remove: function (userId, doc) {
    return Roles.userIsInRole(userId, ['bo']);
  }
});

var ContactsSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Nom complet'
  },
  email: {
    type: String,
    label: 'Adresse email',
    regEx: SimpleSchema.RegEx.Email
  },
  subject: {
    type: String,
    label: 'Sujet',
    autoform: {
      type: 'select',
      options: function () {
        return [
          {label: 'Question', value: 'Question'},
          {label: 'Bug detecté', value: 'Bug detecté'},
          {label: 'Suggestion', value: 'Suggestion'},
          {label: 'Autre', value: 'Autre'}
        ];
      }
    }
  },
  message: {
    type: String,
    label: 'Message',
    autoform: {
      rows: 5
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

Contacts.attachSchema(ContactsSchema);
