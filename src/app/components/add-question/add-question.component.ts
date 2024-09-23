import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/models/question.model';
import { Answer } from 'src/app/models/answer.model';
import { Course } from 'src/app/models/course';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionsService } from 'src/app/services/questions.service';
import { CoursesService } from 'src/app/services/courses.service';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-add-question',
    templateUrl: './add-question.component.html',
    styleUrls: ['./add-question.component.css'],
    standalone: true,
    imports: [FormsModule, MatFormField, MatLabel, MatSelect, NgFor, MatOption, MatInput, MatButton]
})
export class AddQuestionComponent implements OnInit {

  constructor(private snackBar : MatSnackBar,
    private route : ActivatedRoute,
    private questionsService : QuestionsService,
    private coursesService : CoursesService) { }

  protected question : Question = new Question();
 
  courses : Course[] = [];

  ngOnInit() {
    this.coursesService.getAll().subscribe(courses => this.courses = courses);
    this.question.section = 1;

    // Empty answers
    let answers : Answer[] = [];
    for (let i = 0; i < 4; ++i) {
      let answer : Answer = new Answer();
      if (i == 0)
        answer.correct = true;
      else
        answer.correct = false;
      answers.push(answer);
    }

    if (this.route.snapshot.queryParams["new"]) {
      this.questionsService.selectedQuestion.set(new Question());
    }

    if (this.questionsService.selectedQuestion().id != null) {
      this.question = this.questionsService.selectedQuestion();

      let nextIdx = 1;
      if (this.question.answers && this.question.answers.length > 0) {
        let correctFound = false;
        for (let a of this.question.answers) {
          if (a.correct) {
            // Treat existing multiple correct answers
            if (!correctFound) {
              correctFound = true;
              answers[0] = a;
            } else {
              a.correct = false;
              answers[nextIdx++] = a;
            }
          } else {
            answers[nextIdx++] = a;
          }
        }

      }
    }

    this.question.answers = answers;
  }

  save() : void {
    if (this.question == null || this.question.text == null) {
      this.snackBar.open("Question text is mandatory.", "", { duration: 3000 });
      return;
    }

    if (this.question.answers == null || this.question.answers.length != 4) {
      this.snackBar.open("Exactly four answers are required.", "", { duration : 3000 });
    }

    if (!this.question.answers[0].correct) {
      this.snackBar.open("Correct answer is mandatory.", "", { duration: 3000 });
      return;
    }

    for (let i = 1; i < 4; ++i) {
      if (this.question.answers[i].correct) {
        this.snackBar.open("Only one correct answer is permitted.", "", { duration: 3000 });
        return;
      }
    }
    
    if (this.question.course == null) {
      this.snackBar.open("Course is mandatory.", "", { duration: 3000 });
      return;
    }

    this.questionsService.save(this.question).subscribe(() => {
        this.snackBar.open("Question successfully saved!", "", { duration: 3000 });
        this.question = new Question();
        let answers : Answer[] = [];
        for (let i = 0; i < 4; ++i) {
          let answer : Answer = new Answer();
          answer.correct = (i == 0);
          answers.push(answer);
        }

        this.question.answers = answers;
      });
  }

  compareCourses(c1: Course, c2: Course): boolean {
    if (c1 && !c2)
      return false;

    if (!c1 && c2)
      return false;

    return c1.id === c2.id;
  }

}
