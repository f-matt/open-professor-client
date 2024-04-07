import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/models/question.model';
import { Answer } from 'src/app/models/answer.model';
import { Course } from 'src/app/models/course';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionsService } from 'src/app/services/questions.service';
import { CoursesService } from 'src/app/services/courses.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  constructor(private snackBar : MatSnackBar,
    private questionsService : QuestionsService,
    private coursesService : CoursesService) { }

  question : Question = new Question();
  correctAnswer : Answer = new Answer();
  wrongAnswer1 : Answer = new Answer();
  wrongAnswer2 : Answer = new Answer();
  wrongAnswer3 : Answer = new Answer();
  courses : Course[] = [];

  ngOnInit() {
    this.coursesService.getAll().subscribe(courses => this.courses = courses);
  }

  save() : void {
    if (this.question == null || this.question.text == null) {
      this.snackBar.open("Question text is mandatory.", "", { duration: 3000 });
      return;
    }

    if (this.correctAnswer == null || this.correctAnswer.text == null) {
      this.snackBar.open("Correct answer is mandatory.", "", { duration: 3000 });
      return;
    }
    
    if (this.wrongAnswer1 == null || this.wrongAnswer1.text == null ||
      this.wrongAnswer2 == null || this.wrongAnswer2.text == null ||
      this.wrongAnswer3 == null || this.wrongAnswer3.text == null) {

      this.snackBar.open("You need to inform three wrong answers.", "", { duration: 3000 });
      return;
    }

    if (this.question.course == null) {
      this.snackBar.open("Course is mandatory.", "", { duration: 3000 });
      return;
    }

    this.questionsService.save(this.question, this.correctAnswer, this.wrongAnswer1,
      this.wrongAnswer2, this.wrongAnswer3).subscribe(() => {
        this.snackBar.open("Question successfully saved!", "", { duration: 3000 });
        this.question = new Question();
        this.correctAnswer = new Answer();
        this.wrongAnswer1 = new Answer();
        this.wrongAnswer2 = new Answer();
        this.wrongAnswer3 = new Answer();
      });
  }

}
