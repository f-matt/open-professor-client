import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course';
import { CoursesService } from 'src/app/services/courses.service';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatIconButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-course-list',
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.css'],
    standalone: true,
    imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatIconButton, RouterLink, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})
export class CourseListComponent implements OnInit {

  courses : Course[] = [];
  displayedColumns: string[] = ['id', 'name', 'actions'];

  constructor(private coursesService : CoursesService) {}

  ngOnInit() {
    this.coursesService.getAll().subscribe(courses => this.courses = courses);
  }

}
