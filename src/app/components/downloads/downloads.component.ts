import { Component } from '@angular/core';
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

@Component({
    selector: 'app-downloads',
    templateUrl: './downloads.component.html',
    styleUrls: ['./downloads.component.css'],
    standalone: true,
    imports: [FormsModule, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, FlexModule, MatFormField, MatLabel, MatSelect, NgFor, MatOption, MatInput, MatButton]
})
export class DownloadsComponent {

	selectedCourse : Course = new Course();
	selectedCourseLatex : Course = new Course();

	courses : Course[] = [];
	moodleIds : string = '';
	latexIds : string = '';

	section?: number; 
	sectionLatex?: number; 

	constructor(
		private snackBar : MatSnackBar,
		private questionsService : QuestionsService,
		private coursesService : CoursesService) { }

	ngOnInit() {
		this.coursesService.getAll().subscribe(courses => this.courses = courses);
	}

	fillRandomIds() {
		this.questionsService.getIds(this.selectedCourse).subscribe((response: any) => {
			if (response.questions.length != 20) {
				this.snackBar.open("Wrong number of questions.", "", { duration: 3000 });
				return;
			}

			this.moodleIds = '';
			this.latexIds = '';
			for (let i = 0; i < 20; ++i) {
				if (i < 10)
					this.moodleIds += response.questions[i] + ', ';
				else
					this.latexIds += response.questions[i] + ', ';
			}

			this.moodleIds = this.moodleIds.replace(/, $/gm, '');
			this.latexIds = this.latexIds.replace(/, $/gm, '');
		}), 
		(error: any) => this.snackBar.open("Error getting question IDs", "", { duration: 3000 });
	}

	downloadMoodle() {
		this.questionsService.downloadMoodle(this.moodleIds).subscribe((response: any) => {
			let blob:any = new Blob([response], { type: 'text/json; charset=utf-8' });
			const url = window.URL.createObjectURL(blob);
			saveAs(blob, 'file.xml');
		}), (error: any) => this.snackBar.open("Error downloading file.", '', { duration: 3000}),
			() => this.snackBar.open("File successfully downloaded!", '', { duration:3000});
	}

	downloadLatex() {
		if (!this.selectedCourseLatex) {
			this.snackBar.open("Course is mandatory.", "", { duration:3000 });
			return;
		}

		this.questionsService.downloadLatex(this.selectedCourseLatex, this.sectionLatex).subscribe((response: any) => {
			let blob:any = new Blob([response], { type: 'text/json; charset=utf-8' });
			const url = window.URL.createObjectURL(blob);
			saveAs(blob, 'questions.tex');
		}), (error: any) => this.snackBar.open("Error downloading file.", '', { duration: 3000}),
		() => this.snackBar.open("File successfully downloaded!", '', { duration:3000});
	}

	downloadAll() {
		if (!this.selectedCourse || !this.section) {
			this.snackBar.open("Course and section are mandatory.");
			return;
		}

		this.questionsService.downloadAll(this.selectedCourse, this.section).subscribe((response: any) => {
			let blob:any = new Blob([response], { type: 'text/json; charset=utf-8' });
			const url = window.URL.createObjectURL(blob);
			saveAs(blob, 'download.zip');
		}), (error: any) => this.snackBar.open("Error downloading file.", '', { duration: 3000}),
			() => this.snackBar.open("File successfully downloaded!", '', { duration:3000});
	}



}
