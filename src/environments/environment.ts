// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  administrationApiUrl: 'http://localhost:8000/api',
  publicUrl: 'http://localhost:8000/api',
  webUrl: 'http://localhost:8000',
  googleClientId:'547267894981-b130sbc443qmrj9murll50kq3i13ep3c.apps.googleusercontent.com',
  paypalClientId:'AVu7kV-SxJyaZO3LuyAzmOEHa1lbpMbyZDvf8BUdGse8qs-tSo6ariu92gby_CarSCMNNYnF9F70Q1Qp',
  capgo: {
    enabled: false,
    appId: 'pestsy',
    channel: 'development',
    autoUpdate: true,
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
