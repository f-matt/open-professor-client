import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpRequest } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AddQuestionComponent } from './components/add-question/add-question.component';
import { QuestionDetailsComponent } from './components/question-details/question-details.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { CourseListComponent } from './components/course-list/course-list.component';

import { JwtModule } from '@auth0/angular-jwt';
import { DownloadsComponent } from './components/downloads/downloads.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { FlexLayoutModule } from '@angular/flex-layout';

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

const TOKEN_NAME = "openProfessorToken";

export function tokenGetter(request: HttpRequest<any> | undefined) {
  const tokenJson = localStorage.getItem(TOKEN_NAME);
  if (!tokenJson)
    return null;

  const token = JSON.parse(tokenJson);
  if (!token || !token.access_token)
    return null;

  if (request && request.url.includes("refresh")) {
    return token.refresh_token;
  }

  return token.access_token;
}

@NgModule({
  declarations: [
    AppComponent,
    AddQuestionComponent,
    QuestionDetailsComponent,
    QuestionListComponent,
    AddCourseComponent,
    CourseListComponent,
    DownloadsComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,    
    FlexLayoutModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: (request:HttpRequest<any> | undefined) => tokenGetter(request),
        allowedDomains: ['localhost:5000'],
        disallowedRoutes: []
      },
    }),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatExpansionModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
