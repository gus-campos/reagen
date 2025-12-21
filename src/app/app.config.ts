import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { IDatabase } from '@core/services/base-repository.service';
import { MockDatabase } from '@core/services/mock-database.service';
import { registerLocaleData } from '@angular/common';

// Localização
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt, 'pt-BR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Injections
    { provide: IDatabase, useClass: MockDatabase },
    // Localização
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
};
