import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';


import { App } from './app/app';
import { appConfig } from './app/app.config';
import { authInterceptor } from './app/core/interceptors/auth-interceptor';
import { errorInterceptor } from './app/core/interceptors/error-interceptor';
import { appRoutes } from './app/app.routes';



bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([
      authInterceptor,
      errorInterceptor
    ])),
    
  ]
}).catch(err => console.error(err));
