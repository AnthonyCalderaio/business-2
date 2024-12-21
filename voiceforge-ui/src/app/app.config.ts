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
      domain: 'domain', // Replace with your Auth0 domain
      clientId: 'clientID', // Replace with your Auth0 client ID
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
  ]
};
