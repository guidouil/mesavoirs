if (Meteor.isServer) {
  Meteor.startup(function () {
    // Houstan admin view collections users and _admins
    Houston.add_collection(Meteor.users);
    Houston.add_collection(Houston._admins);

    Accounts.emailTemplates.from = 'Loyali <no-reply@loya.li>';
    Accounts.emailTemplates.siteName = 'Loyali';
  });
}
