import { Component, OnInit } from '@angular/core';
import { QuestionsService } from 'src/app/services/questions.service';
import { saveAs } from 'file-saver';
import { Question } from 'src/app/models/question.model';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit {

  questions : Question[] = [];
  displayedColumns: string[] = ['id', 'text', 'actions'];

  constructor(private questionsService : QuestionsService) {}

  ngOnInit() {
    this.questionsService.getAll().subscribe(questions => {
	 	this.questions = questions;
	});
  }

  download() {
		this.questionsService.downloadMoodle('').subscribe((response: any) => {
			let blob:any = new Blob([response], { type: 'text/json; charset=utf-8' });
			const url = window.URL.createObjectURL(blob);
			//window.open(url);
			saveAs(blob, 'file.xml');
			}), (error: any) => console.log('Error downloading the file'),
			() => console.info('File downloaded successfully');
	}

}
