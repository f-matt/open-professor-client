import {Component, inject, OnInit} from '@angular/core';
import { QuestionsService } from '../../services/questions.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoursesService } from 'src/app/services/courses.service';
import { Course } from 'src/app/models/course';
import { FormsModule } from '@angular/forms';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import {MessagesService} from "../../services/messages.service";

@Component({
    selector: 'app-downloads',
    templateUrl: './downloads.component.html',
    styleUrls: ['./downloads.component.css'],
    imports: [FormsModule, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, FlexModule, MatFormField, MatLabel, MatSelect, NgFor, MatOption, MatInput, MatButton]
})
export class DownloadsComponent implements OnInit {

  private messagesService: MessagesService = inject(MessagesService);

	selectedCourse : Course = new Course();
	selectedCourseLatex : Course = new Course();

	courses : Course[] = [];
	moodleIds : string = '';

	section?: number;
	sectionLatex?: number = 0;

	constructor(
		private snackBar : MatSnackBar,
		private questionsService : QuestionsService,
		private coursesService : CoursesService) { }

	ngOnInit() {
		this.coursesService.getAll().subscribe(courses => this.courses = courses);
	}

	downloadMoodle() {
		this.questionsService.exportMoodle([]).subscribe({
      next: (response: any) => {
        let blob: any = new Blob([response], {type: 'text/json; charset=utf-8'});
        window.URL.createObjectURL(blob);
        saveAs(blob, 'file.xml');
      },
      error: (e: Error) => {
        this.messagesService.handleError(e, "Error downloading file.");
      }
    });
	}

	downloadLatex() {
    if (!this.selectedCourseLatex) {
      this.snackBar.open("Course is mandatory.", "", {duration: 3000});
      return;
    }

    this.questionsService.downloadLatex(this.selectedCourseLatex, this.sectionLatex).subscribe({
      next: (response: any) => {
        let blob: any = new Blob([response], {type: 'text/plain; charset=utf-8'});
        window.URL.createObjectURL(blob);
        saveAs(blob, 'questions.tex');
      },
      error: (error: Error) => {
        this.messagesService.handleError(error, "Error downloading file.");
      }
    });
  }

	downloadAll() {
    if (!this.selectedCourse || !this.section) {
      this.snackBar.open("Course and section are mandatory.");
      return;
    }

    this.questionsService.exportLatexAndMoodle(this.selectedCourse, this.section).subscribe({
      next: (response: BlobPart) => {
        const blob = new Blob([response], {type: 'application/zip'});
        window.URL.createObjectURL(blob);
        saveAs(blob, 'download.zip');
      },
      error: (error: Error) => {
        this.messagesService.handleError(error, "Error downloading file.");
      }
    });
	}

}
