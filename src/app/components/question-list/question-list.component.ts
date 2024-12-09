import { Component, OnInit } from '@angular/core';
import { QuestionsService } from 'src/app/services/questions.service';
import { Question } from 'src/app/models/question.model';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Course } from 'src/app/models/course';
import { CustomRuntimeError } from 'src/app/errors/custom-runtime-error';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { CoursesService } from 'src/app/services/courses.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.css'],
    imports: [
        FormsModule,
        RouterModule,
        MatFormFieldModule,
        MatSelectModule,
        MatTableModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule
    ]
})
export class QuestionListComponent implements OnInit {

  protected courses : Course[] = [];

  protected course : Course | null = null;

  protected section : number | null = null;

  protected questions : Question[] = [];

  protected displayedColumns: string[] = ['id', 'text', 'actions'];

  protected dataSource: MatTableDataSource<Question> = new MatTableDataSource<Question>(this.questions);

  protected pageIndex: number = 0;
  
  protected pageSize: number = 0;

  protected length: number = 0;        

  constructor(private snackBar : MatSnackBar,
    private router : Router,
    private questionsService : QuestionsService,
    private coursesService: CoursesService) { }

  ngOnInit() {
    this.coursesService.getAll().subscribe({
      next: (courses => {
        this.courses = courses;
      }),
      error: (e => {
        if (e instanceof CustomRuntimeError) 
          this.snackBar.open(e.message, "", { duration : 3000 });
        else
          this.snackBar.open("Error retrieving courses.", "", { duration : 3000 });
      })
    });
  }

  search() {
    if (!this.course) {
      this.snackBar.open("Course is mandatory.", "", { duration : 3000 });
      return;
    }

    if (!this.section) {
      this.snackBar.open("Section is mandatory.", "", { duration : 3000 });
      return;
    }

		this.questionsService.findByCourseAndSection(this.course, this.section).subscribe((questions: Question[]) => { 
      this.questions = questions;
    }), (error: any) => {
      if (error instanceof CustomRuntimeError)
        this.snackBar.open(error.message, "", { duration : 3000 });
      else
        this.snackBar.open("Error retrieving questions.", "", { duration : 3000 });
    }
	}

  selectQuestion(question : Question) {
    this.questionsService.selectedQuestion.set(question);
    this.router.navigateByUrl("/questions/add");
  }

}
