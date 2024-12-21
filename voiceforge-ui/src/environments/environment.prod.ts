export const environment = {
    production: true,
    backendUrl: 'https://voiceforge-backend-e575bd334777.herokuapp.com', // Replace with your actual backend URL on Heroku or wherever deployed
     auth0Domain: process.env['domain'] || '',
     auth0ClientId: process.env['clientId'] || '', 
  };
  