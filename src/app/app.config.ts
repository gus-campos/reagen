import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import Aura from '@primeuix/themes/aura';
import { MockDatabaseService } from '@core/services/mock-database.service';
import { IDatabase } from '@core/services/base-repository.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Injections
    { provide: IDatabase, useClass: MockDatabaseService },
  ],
};
