App.info({
  id: 'loya.ly.app',
  name: 'Loyali',
  description: 'Gérez vos cartes de fidélité et vos avoirs',
  author: 'guillaume.darbonne@gmail.com',
  email: 'guillaume.darbonne@gmail.com',
  website: 'http://loya.li',
  version: '1.3.0'
});

App.icons({
  // iOS
  'iphone_2x': 'resources/icons/icon-120x120.png', // 120x120
  'iphone_3x': 'resources/icons/icon-180x180.png', // 180x180
  'ipad': 'resources/icons/icon-76x76.png', // 76x76
  'ipad_2x': 'resources/icons/icon-152x152.png', // 152x152
  'ipad_pro': 'resources/icons/icon-167x167.png', //167x167

  // Android
  'android_mdpi': 'resources/icons/icon-48x48.png',
  'android_hdpi': 'resources/icons/icon-72x72.png',
  'android_xhdpi': 'resources/icons/icon-96x96.png',
  'android_xxhdpi': 'resources/icons/icon-144x144.png',
  'android_xxxhdpi': 'resources/icons/icon-192x192.png',
});

App.launchScreens({
  // iOS
  'iphone_2x': 'resources/splash/Default@2x.png', // 640x960
  'iphone5': 'resources/splash/Default-568h@2x.png', // 640x1136
  'iphone6': 'resources/splash/Default-667h@2x.png', // 750x1334
  'iphone6p_portrait': 'resources/splash/Default-Portrait-736h@3x.png', // 1242x2208
  'iphone6p_landscape': 'resources/splash/Default-Landscape-736h@3x.png', // 2208x1242
  'ipad_portrait': 'resources/splash/Default-Portrait.png', // 768x1024
  'ipad_landscape': 'resources/splash/Default-Landscape.png', // 1024x768
  'ipad_portrait_2x': 'resources/splash/Default-Portrait@2x.png', // 1536x2048
  'ipad_landscape_2x': 'resources/splash/Default-Landscape@2x.png', // 2048x1536
  'ipad_pro_portrait': 'resources/splash/Default-Portrait@3x.png', // 2048x2732
  'ipad_pro_landscape': 'resources/splash/Default-Landscape@3x.png', // 2732x2048

  // Android
  'android_mdpi_portrait': 'resources/splash/splash-320x480.png',
  'android_mdpi_landscape': 'resources/splash/splash-480x320.png',
  'android_hdpi_portrait': 'resources/splash/splash-480x800.png',
  'android_hdpi_landscape': 'resources/splash/splash-800x480.png',
  'android_xhdpi_portrait': 'resources/splash/splash-720x1280.png',
  'android_xhdpi_landscape': 'resources/splash/splash-1280x720.png',
  'android_xxhdpi_portrait': 'resources/splash/splash-1080x1440.png',
  'android_xxhdpi_landscape': 'resources/splash/splash-1440x1080.png',
});

App.setPreference('StatusBarOverlaysWebView', 'false');
App.setPreference('StatusBarBackgroundColor', '#000000', 'android');
App.setPreference('StatusBarBackgroundColor', '#ffffff', 'ios');
App.setPreference('Orientation', 'portrait');
App.setPreference('Orientation', 'portrait', 'ios');

App.configurePlugin('com.phonegap.plugins.facebookconnect', {
  APP_ID: '562245447284862',
  APP_NAME: 'Loyali'
});

// App.configurePlugin('cordova-plugin-googleplus', {
//   'REVERSED_CLIENT_ID': 'com.googleusercontent.apps.277804142620-qfe4t0eham3mhd2mojps67fc3nd3kda5'
// });

App.accessRule('*.loya.li/*');
App.accessRule('*.mesavoirs.fr/*');
App.accessRule('*.openfoodfacts.org/*');
App.accessRule('*.meteor.com/*');
App.accessRule('*.google.com/*');
App.accessRule('*.googleapis.com/*');
App.accessRule('*.gstatic.com/*');

// upload bug
App.accessRule('data:*');
App.accessRule('blob:*');
App.accessRule('*');
