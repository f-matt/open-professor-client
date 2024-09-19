import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddQuestionComponent } from './components/add-question/add-question.component';
import { QuestionDetailsComponent } from './components/question-details/question-details.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { DownloadsComponent } from './components/downloads/downloads.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './helpers/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
  { path: 'questions', component: QuestionListComponent, canActivate: [authGuard] },
  { path: 'questions/detail/:id', component: QuestionDetailsComponent, canActivate: [authGuard]},
  { path: 'questions/add', component: AddQuestionComponent, canActivate: [authGuard]},
  { path: 'courses/add', component: AddCourseComponent, canActivate: [authGuard]},
  { path: 'courses', component: CourseListComponent, canActivate: [authGuard]},
  { path: 'downloads', component: DownloadsComponent, canActivate: [authGuard]},
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
