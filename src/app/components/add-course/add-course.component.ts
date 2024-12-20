import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Course } from 'src/app/models/course';
import { CoursesService } from 'src/app/services/courses.service';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-add-course',
    templateUrl: './add-course.component.html',
    styleUrls: ['./add-course.component.css'],
    imports: [FormsModule, MatFormField, MatLabel, MatInput, MatButton]
})
export class AddCourseComponent {

  constructor(private snackBar : MatSnackBar,
    private coursesService : CoursesService) {}

  course : Course = new Course();

  save() : void {
    if (this.course == null || this.course.name == null) {
      this.snackBar.open("Course name is mandatory.");
      return;
    }

    this.coursesService
      .save(this.course)
      .subscribe(() => this.snackBar.open("Course successfully saved!", "", { duration : 3000 }));
  }

}
