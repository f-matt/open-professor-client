import { tokenGetter } from './app/app.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, HttpRequest } from '@angular/common/http';
import { ErrorInterceptor } from './app/helpers/error.interceptor';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { JwtModule } from '@auth0/angular-jwt';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { environment } from '@environments/environment';

const TOKEN_NAME = environment.tokenName;
const tokenJson = localStorage.getItem(TOKEN_NAME);

let token = null;
if (tokenJson) 
    token = JSON.parse(tokenJson);

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, FormsModule, FlexLayoutModule, JwtModule.forRoot({
            config: {
                tokenGetter: (request: HttpRequest<any> | undefined) => tokenGetter(request),
                allowedDomains: ['localhost:5000'],
                disallowedRoutes: []
            },
        }), MatToolbarModule, MatIconModule, MatButtonModule, MatInputModule, MatSnackBarModule, MatSelectModule, MatMenuModule, MatSidenavModule, MatListModule, MatTableModule, MatExpansionModule),
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
    ]
})
  .catch(err => console.error(err));
