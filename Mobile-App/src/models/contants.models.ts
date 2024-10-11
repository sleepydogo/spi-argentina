export class Constants {
  // theme and language
  static KEY_DEFAULT_LANGUAGE = 'cabBookDriver_ionic_dl';
  static KEY_DARK_MODE = 'cabBookDriver_ionic_dark_mode';
  static KEY_IS_DEMO_MODE = 'cabBookDriver_ionic_is_demo_mode';

  static THEME_MODE_DARK = 'theme_dark';
  static THEME_MODE_LIGHT = 'theme_light';
  
  // tokens
  static AUTH_TOKEN = 'ubik_authToken';
  static REFRESH_TOKEN = 'ubik_refreshToken';

  // data
  static VERIFICATION_EMAIL = 'ubik_verification_email';
  static RECOVERY_EMAIL = 'ubik_recovery_email';
  static STATE_DRIVER_DUTY = 'ubik_driver_on_duty';
  static STATE_ACTIVE_TRIP = 'ubik_driver_has_active_trip';
  static STATE_ACTIVE_TRIP_DATA = 'ubik_driver_active_trip_data';
  

  // urls
  static TRIPS_ENDPOINT = 'api/viajes/';
  static CURRENT_TRIP_ENDPOINT = 'api/current-trip';
  static ENDPOINT_SIGN_UP = 'api/sign-up';
}
