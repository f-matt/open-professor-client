import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { Question } from '../models/question.model';
import { Course } from '../models/course';
import { environment } from '@environments/environment';

const BASE_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  public selectedQuestion = signal<Question>(new Question());

  constructor(private httpClient : HttpClient) { }

  save(question : Question) : Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.httpClient.post<any>(`${BASE_URL}/questions`, question, httpOptions);
  }

  exportLatex(ids : number[]): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Response-Type': 'blob'
      })
    };

    let data = { "questionIds" : ids };

		return this.httpClient.post(`${BASE_URL}/questions/export-latex`, data, httpOptions);
  }

  exportMoodle(ids : number[]): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Response-Type': 'blob'
      })
    };

    let data = { "questionIds" : ids };

		return this.httpClient.post(`${BASE_URL}/questions/export-moodle`, data, httpOptions);
  }

  exportLatexAndMoodle(course: Course, section: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      }),
      responseType: 'blob' as 'json'
    };

    let data = { "course" : course, "section" : section };

		return this.httpClient.post(`${BASE_URL}/questions/export-moodle-and-latex`, data, httpOptions);
  }

  downloadLatex(course: Course, section?: number): any {
    if (!course)
      throwError(() => new Error("Course is mandatory."));

    let httpParams: HttpParams = new HttpParams();
    if (course.id)
      httpParams = httpParams.set("course", course.id);

    if (section && section != 0)
      httpParams = httpParams.set("section", section);

		return this.httpClient.get(`${BASE_URL}/questions/export-latex`,
      {params: httpParams, responseType: 'blob'});
  }

  downloadAll(course: Course, section: number): any {
		return this.httpClient.get(`${BASE_URL}/download-all?course_id=${course.id}&section=${section}`, {responseType: 'blob'});
  }

  findByCourseAndSection(course : Course, section : number) : Observable<Question[]> {
    return this.httpClient.get<Question[]>(`${BASE_URL}/questions?course=${course.id}&section=${section}`);
  }

  getAll() : Observable<Question[]> {
    return this.httpClient.get<any>(BASE_URL + 'questions').pipe(map(data => data.questions));
  }

  get(id : any) : Observable<Question> {
    return this.httpClient.get<Question>(`${BASE_URL}/${id}`);
  }

  update(id : any, data : any) : Observable<any> {
    return this.httpClient.put(`${BASE_URL}/${id}`, data);
  }

  delete(id : any) : Observable<any> {
    return this.httpClient.delete(`${BASE_URL}/${id}`);
  }

  getIds(course : Course) : Observable<Number[]> {
    return this.httpClient.get<Number[]>(`${BASE_URL}/questions/course/${course.id}`);
  }

}
