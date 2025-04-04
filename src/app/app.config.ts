import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"da-notes-a2ab3","appId":"1:70162511196:web:81a3113a610f81a8123d99","storageBucket":"da-notes-a2ab3.firebasestorage.app","apiKey":"AIzaSyA9Ggj7FMV_tQqi1qMVfm23YDrjoDhb6gE","authDomain":"da-notes-a2ab3.firebaseapp.com","messagingSenderId":"70162511196"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
