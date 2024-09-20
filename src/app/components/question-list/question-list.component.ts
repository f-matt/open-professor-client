import { Component, OnInit } from '@angular/core';
import { QuestionsService } from 'src/app/services/questions.service';
import { saveAs } from 'file-saver';
import { Question } from 'src/app/models/question.model';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.css'],
    standalone: true,
    imports: [FormsModule, MatButton, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatIconButton, RouterLink, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
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
