import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course';
import { CoursesService } from 'src/app/services/courses.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  courses : Course[] = [];
  displayedColumns: string[] = ['id', 'name', 'actions'];

  constructor(private coursesService : CoursesService) {}

  ngOnInit() {
    this.coursesService.getAll().subscribe(courses => this.courses = courses);
  }

}
