# PlagasV2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Capacitor social login setup

The project is prepared to use the [`@capgo/capacitor-social-login`](https://github.com/Cap-go/capacitor-social-login) plugin for Google authentication. Install the dependency and synchronise the native projects after updating any Capacitor configuration:

```bash
npm install @capgo/capacitor-social-login
npx cap sync
```

If you do not have access to the private npm registry, request credentials from Capgo and configure npm with the appropriate registry token before running the install command. The Google client identifiers configured in `capacitor.config.ts` and `capacitor.config.json` can be overridden by environment variables (`GOOGLE_CLIENT_ID` or `GOOGLE_SIGNIN_CLIENT_ID`) when building the native projects.
