import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Question } from '../models/question.model';
import { Answer } from '../models/answer.model';
import { Course } from '../models/course';

const baseUrl = '/api';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private httpClient : HttpClient) { }

  save(question : Question, correctAnswer : Answer, wrongAnswer1 : Answer,
    wrongAnswer2 : Answer, wrongAnswer3 : Answer) : Observable<any> {

    let data = {'question' : question.text, 
      'correct' : correctAnswer.text,
      'wrong1' : wrongAnswer1.text, 
      'wrong2' : wrongAnswer2.text, 
      'wrong3' : wrongAnswer3.text,
      'course_id' : question.course?.id};

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.httpClient.post<any>(`${baseUrl}/questions`, data, httpOptions);
  }

  downloadMoodle(ids:string): any {
		return this.httpClient.get(`${baseUrl}/download-moodle/"${ids}"`, {responseType: 'blob'});
  }

  downloadLatex(course: Course, section?: number): any {
    if (!course)
      throwError(() => new Error("Course is mandatory."));

    let httpParams: HttpParams = new HttpParams();
    if (course.id)
      httpParams = httpParams.set("course", course.id);

    if (section)
      httpParams = httpParams.set("section", section);

		return this.httpClient.get(`${baseUrl}/download-latex`, 
      {params: httpParams, responseType: 'blob'});
  }

  downloadAll(course: Course, section: number): any {
		return this.httpClient.get(`${baseUrl}/download-all?course_id=${course.id}&section=${section}`, {responseType: 'blob'});
  }
   
  getAll() : Observable<Question[]> {
    return this.httpClient.get<any>(baseUrl + 'questions').pipe(map(data => data.questions));
  }

  get(id : any) : Observable<Question> {
    return this.httpClient.get(`${baseUrl}/${id}`);
  }

  update(id : any, data : any) : Observable<any> {
    return this.httpClient.put(`${baseUrl}/${id}`, data);
  }

  delete(id : any) : Observable<any> {
    return this.httpClient.delete(`${baseUrl}/${id}`);
  }

  getIds(course : Course) : Observable<Number[]> {
    return this.httpClient.get<Number[]>(`${baseUrl}/questions/course/${course.id}`);
  }

}
