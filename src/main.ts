import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { ApiService } from './app/config/api.service';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule), // HttpClient bereitstellen
  ]
});