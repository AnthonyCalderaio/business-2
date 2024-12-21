import { ApplicationConfig } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),

    provideHttpClient(),
    provideAuth0({
      domain: process.env['domain'] || '', // Use environment variable
      clientId: process.env['clientId'] || '', // Use environment variable
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
  ]
};
