// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    hmr: false,
    firebase: {
        apiKey: 'AIzaSyDFmocOLK2FsV7TaQnh0qYNPU5AJCOxZJ8',
        authDomain: 'bbv-pantry.firebaseapp.com',
        databaseURL: 'https://bbv-pantry.firebaseio.com',
        projectId: 'bbv-pantry',
        storageBucket: 'bbv-pantry.appspot.com',
        messagingSenderId: '611310470642',
        appId: '1:611310470642:web:a5d3e5f8070be86e'
    },
    url: 'http://localhost:3979',
    aadClientId: 'fe9b28c6-8829-4c88-83ba-40b88a2d5d13',
    aadAuthority: 'https://login.microsoftonline.com/279985bd-2077-4d9d-9797-42238cfc06e2',
    aadScope: 'fe9b28c6-8829-4c88-83ba-40b88a2d5d13/access_as_user',
    bbvApiUrl: 'https://bbveventacademytest.bbv.ch/api/v2'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
