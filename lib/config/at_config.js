// Options
AccountsTemplates.configure({
  defaultLayout: 'main',
  showForgotPasswordLink: true,
  overrideLoginErrors: true,
  enablePasswordChange: true,
  sendVerificationEmail: false,

  //enforceEmailVerification: true,
  // confirmPassword: true,
  continuousValidation: true,
  //displayFormLabels: true,
  //forbidClientAccountCreation: false,
  // formValidationFeedback: true,
  homeRoutePath: '/',
  showAddRemoveServices: true,
  showPlaceholders: true,

  negativeValidation: true,
  positiveValidation:true,
  negativeFeedback: false,
  positiveFeedback:true,

  // Privacy Policy and Terms of Use
  //privacyUrl: 'privacy',
  termsUrl: 'terms-of-use',
});
