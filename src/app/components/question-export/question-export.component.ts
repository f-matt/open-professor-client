import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import saveAs from 'file-saver';
import { CustomRuntimeError } from 'src/app/errors/custom-runtime-error';
import { Course } from 'src/app/models/course';
import { Question } from 'src/app/models/question.model';
import { CoursesService } from 'src/app/services/courses.service';
import { QuestionsService } from 'src/app/services/questions.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-question-download',
    imports: [
        FormsModule,
        RouterModule,
        MatButtonModule,
        MatTableModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatCheckboxModule
    ],
    templateUrl: './question-export.component.html',
    styleUrl: './question-export.component.scss'
})
export class QuestionExportComponent {
  protected courses : Course[] = [];

  protected course : Course | null = null;

  protected section : number | null = null;

  protected questions : Question[] = [];

  protected displayedColumns: string[] = ['id', 'text', 'actions'];

  protected dataSource: MatTableDataSource<Question> = new MatTableDataSource<Question>(this.questions);

  protected pageIndex: number = 0;
  
  protected pageSize: number = 0;

  protected length: number = 0;        

  protected selectedQuestions: number[] = [];

  constructor(private snackBar : MatSnackBar,
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

  exportMoodle() {
    console.log(this.selectedQuestions);
		this.questionsService.exportMoodle(this.selectedQuestions).subscribe((response: any) => {
			let blob:any = new Blob([response], { type: 'text/json; charset=utf-8' });
			const url = window.URL.createObjectURL(blob);
			//window.open(url);
			saveAs(blob, 'file.xml');
			}), (error: any) => console.log("Error exporting questions."),
			() => console.info("Questions succesfully exported.");
	}

  exportLatex() {
    console.log(this.selectedQuestions);
		this.questionsService.exportLatex(this.selectedQuestions).subscribe((response: any) => {
			let blob:any = new Blob([response], { type: 'text/json; charset=utf-8' });
			const url = window.URL.createObjectURL(blob);
			saveAs(blob, 'file.tex');
			}), (error: any) => console.log("Error exporting questions."),
			() => console.info("Questions succesfully exported.");
	}

  updateSelected(selected : boolean, id : number) {
    if (selected && !this.selectedQuestions.includes(id)) {
      this.selectedQuestions.push(id);
      return;
    }

    if (!selected && this.selectedQuestions.includes(id)) {
      let index = this.selectedQuestions.indexOf(id);
      this.selectedQuestions = this.selectedQuestions.splice(index, 1);
      return;
    }
  }

}